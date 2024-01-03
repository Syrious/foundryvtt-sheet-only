import {addSizingButtons} from "./addSizingButtons.js";

let currentSheet = null; // Track the currently open sheet
Hooks.on('setup', async () => {
    let isCanvasDisabled = game.settings.get("core", "noCanvas");
    let shouldCanvasBeDisabled = game.settings.get("sheet-only", "disable-canvas");

    if (isSheetOnly() && isCanvasDisabled !== shouldCanvasBeDisabled) {
        await game.settings.set('core', 'noCanvas', shouldCanvasBeDisabled)
        foundry.utils.debouncedReload();
    }
});

Hooks.once('ready', async function () {
    if (isSheetOnly()) {
        setupContainer();

        hideElements();
        popupSheet(game.user);
    }
});

Hooks.on('renderActorSheet', async (app, html) => {
    if (isSheetOnly()) {
        app.setPosition({
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });

        app.element.addClass('sheet-only-sheet');
        $('.sheet-only-container').append(app.element);

        $(".window-resizable-handle").hide();

    }
})

Hooks.on('createActor', async function (actor) {
    rebuildActorList();

    if (isActorOwnedByUser(actor)) {
        actor.sheet.render(true);
    }
});

Hooks.on('deleteActor', async function () {
    rebuildActorList();
    popupSheet(game.user)
});

function isActorOwnedByUser(actor) {
    return actor.ownership[game.user.id] === 3;
}

function setupContainer() {
    const sheetContainer = $('<div>').addClass('sheet-only-container');
    $('body').append(sheetContainer);

    sheetContainer.append($('<div>').addClass('sheet-only-actor-list'));
    rebuildActorList()

    addSizingButtons(sheetContainer);
}
function rebuildActorList() {
    let actorList = $('.sheet-only-actor-list');

    actorList.empty();

    let actorElements = getActorElements();

    if (actorElements.length > 1) {
        actorList.show();
        actorElements.forEach(elem => actorList.append(elem));
    } else {
        actorList.hide();
    }
}

function getOwnedActors() {
    return game.actors.filter(actor => isActorOwnedByUser(actor));
}

function getActorElements() {
    let actors = getOwnedActors();
    return actors.map(actor => {
            return $('<div>')
                // .text(actor.name)
                .append($('<img>').attr('src', actor.img).attr('width', '75').attr('height', '75'))
                .click(() => {
                    if (currentSheet) {
                        currentSheet.close();
                    }
                    currentSheet = actor.sheet.render(true);
                });
        }
    );
}

function hideElements() {
    $("#interface").addClass("sheet-only-hide");
    $("#pause").addClass("sheet-only-hide");
    $("#tooltip").addClass("sheet-only-hide");

    if (!game.settings.get("sheet-only", "display-notifications")) {
        $("#notifications").addClass("sheet-only-hide");
    }
}

function isSheetOnly() {
    let playerdata = game.settings.get("sheet-only", 'playerdata');
    let user = game.user;
    return playerdata[user.id] && playerdata[user.id].display;
}

function popupSheet(user) {
    const actor = user.character;

    if (actor) {
        currentSheet = actor.sheet;
        currentSheet.render(true);
    } else {
        console.log(`No actor for user found.`);
    }
}



