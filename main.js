let currentSheet = null; // Track the currently open sheet
Hooks.on('setup', async () => {
    if (isSheetOnly() && !game.settings.get("core", "noCanvas")) {
        await game.settings.set('core', 'noCanvas', true)
        foundry.utils.debouncedReload();
    }
});

Hooks.once('ready', async function () {
    if (isSheetOnly()) {
        setupContainer();
        hideElements();
        popupSheet(getUser());
    }
});

Hooks.on('renderActorSheet', async (app, html, data) => {
    if (isSheetOnly() && html.hasClass('sheet')) {
        app.setPosition({
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });

        html.addClass('sheet-only-sheet');
        $('.sheet-only-container').append(html);
    }
})

Hooks.on('createActor', async function () {
    rebuildActorList();
});

Hooks.on('deleteActor', async function () {
    rebuildActorList();
    popupSheet(getUser())
});

function setupContainer() {
    const flexContainer = $('<div>').addClass('sheet-only-container');
    $('body').append(flexContainer);

    flexContainer.append($('<div>').addClass('sheet-only-actor-list'));
    rebuildActorList()
}

function rebuildActorList() {
    let actorList = $('.sheet-only-actor-list');

    actorList.empty();
    getActorElements().forEach(elem => actorList.append(elem));
}

function getActorElements() {
    let actors = game.actors.filter(actor => actor.ownership[game.user.id] === 3);
    return actors.map(actor => {
            return $('<div>')
                // .text(actor.name)
                .append($('<img>').attr('src', actor.img).attr('width', '75').attr('height', '75'))
                .click(async () => {
                    if (currentSheet) {
                        currentSheet.close();
                    }
                    currentSheet = actor.sheet.render(true);
                });

        }
    );
}

function hideElements() {
    $("#notifications").addClass("sheet-only-hide");
    $("#interface").addClass("sheet-only-hide");
    $("#pause").addClass("sheet-only-hide");
    $("#tooltip").addClass("sheet-only-hide");
}

function isSheetOnly() {
    let playerdata = game.settings.get("sheet-only", 'playerdata');
    let user = getUser();
    return playerdata[user.id] && playerdata[user.id].display;
}

function getUser() {
    return game.users.get(game.userId);
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



