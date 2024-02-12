const FOUNDRY_MIN_WIDTH = 1024;

import {addFontSizeButtons} from "./addFontSizeButtons.js";

import {addControlButtons} from "./addControlButtons.js";
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
        $(".window-resizable-handle").hide();

        getTokenizerImage();
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
    if (navigator.userAgent.indexOf("Firefox") !== -1) {
        console.log("Adding font-size buttons for firefox");
        addFontSizeButtons(sheetContainer);
    } else {
        console.log("Adding zoom buttons");
        addControlButtons(sheetContainer);
    }

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
                //.text(actor.name)
                .append($('<img>').attr('src', actor.img))
                .click(() => {
                    if (currentSheet) {
                        currentSheet.close();
                    }
                    currentSheet = actor.sheet.render(true);
                });
        }
    );

}
function getTokenizerImage() {
    let actors = getOwnedActors();
    actors.map(actor => {
        let actorImg = actor.img;
        let sheet = $('#ActorSheet5eCharacter-Actor-' + actor._id)[0];
        if (sheet !== undefined) {
            if (actorImg.includes('tokenizer')
                && actorImg.includes('Avatar')) {
                actorImg = actorImg.replace('Avatar', 'Token');
                $('.sheet-only-container .sheet-header img.profile')[0].src = actorImg;
            }
        }
    });

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
    let userData = playerdata[user.id];

    if (userData) {
        if (userData.display) {
            // Check if mobile only is set & is actually mobile device
            if (!userData.mobile) {
                return true;
            } else if (userData.screenwidth > 0 && userData.screenwidth >= screen.width) {
                return true;
            }
        }
    }

    return false;
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
