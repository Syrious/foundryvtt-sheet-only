import {addControlButtons, toggleActorList} from "./addControlButtons.js";
import * as FirefoxZoom from "./firefoxZoom.js";
import * as DefaultZoom from "./defaultZoom.js";
import {setupCompatibility} from "./compatibility.js";
import {hideCanvas} from "./canvasHider.js";

CONFIG.debug.hooks = false;

let currentSheet = null; // Track the currently open sheet
let currentActor; // The currently selected actor

async function setupClient() {
    let shouldReload = false;

    if (await game.settings.get("core", "noCanvas")) {
        await game.settings.set('core', 'noCanvas', false)
        shouldReload = true;
    }

    if (shouldReload) {
        foundry.utils.debouncedReload();
    }
}

Hooks.on('setup', async () => {
    if (isSheetOnly()) {
        await setupClient();
    } else if (!isSheetOnly() && isCanvasDisabled) {
        // We should re-enable the canvas
        await setCanvasDisabled(false);
    }

    setupCompatibility();
});

Hooks.once('ready', async function () {
    if (isSheetOnly()) {
        setupContainer();
        setupChatPanel();
        hideUnusedElements();
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

        const shouldMoveDOM = false
        if (shouldMoveDOM) {
            var parent = $('.sheet-only-container');
            parent.append(app.element);
        }

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

Hooks.on('renderContainerSheet', async (app, html, data) => {
    app.setPosition({
        left: window.innerWidth,
        top: 0,
        width: 1, // It will adjust to its minimum width
        height: window.innerHeight // It will adjust to its minimum height
    })
    html.css('z-index', '99999');
});

Hooks.once('closeUserConfig', async () => {
    // Popup sheet after user selected their character
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

    // Add control buttons depending on browser
    if (navigator.userAgent.indexOf("Firefox") !== -1) {
        console.log("Adding font-size buttons for firefox");
        addControlButtons(sheetContainer, FirefoxZoom.increaseZoom, FirefoxZoom.decreaseZoom, FirefoxZoom.resetZoom);
    } else {
        console.log("Adding zoom buttons");
        addControlButtons(sheetContainer, DefaultZoom.increaseZoom, DefaultZoom.decreaseZoom, DefaultZoom.resetZoom);
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
                    if (currentActor === actor) {
                        // We clicked the same actor. Do nothing here
                        toggleActorList();
                        return;
                    }

                    if (currentSheet) {
                        currentSheet.close();
                    }

                    currentSheet = actor.sheet.render(true);
                    currentActor = actor;

                    setCurrentActorTokenAsControlled();
                    toggleActorList();
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

function hideUnusedElements() {
    $("#interface").addClass("sheet-only-hide");
    $("#pause").addClass("sheet-only-hide");

    $("#tooltip").addClass("sheet-only-hide");

    if (!game.settings.get("sheet-only", "display-notifications")) {
        $("#notifications").addClass("sheet-only-hide");
    }

    if(game.settings.get("sheet-only", "hide-canvas")) {
        hideCanvas();
    }
}

function setupChatPanel() {
    var chatElement = $('#chat'); // Get the chat element

    var newParentElement = $('.sheet-only-container'); // Get the new parent

    if (chatElement.length && newParentElement.length) {
        // Create a new div and wrap the chat element inside it
        chatElement.wrap('<div id="chat-wrapper"></div>');

        // Get the wrapper we just created along with its child
        var chatElementWrapper = $('#chat-wrapper');
        chatElementWrapper.addClass("sheet-only-chat");
        chatElementWrapper.addClass('collapse');

        chatElementWrapper.detach(); // Remove the wrapped chatElement (along with its wrapper) from the DOM
        newParentElement.append(chatElementWrapper); // Append the wrapped chatElement (with its wrapper) to the new parent
    } else {
        console.log("Could not find chat panel")
    }
}

function isSheetOnly() {

    let playerdata = game.settings.get("sheet-only", 'playerdata');
    let user = game.user;
    let userData = playerdata[user.id];

    if (userData) {
        const useSheetOnly = userData.display;

        if (useSheetOnly) {
            const screenWidthToIgnoreSheetOnly = userData.screenwidth;

            if (screenWidthToIgnoreSheetOnly <= 0) {
                // We ignore screen size
                return true;
            }

            if (screen.width < screenWidthToIgnoreSheetOnly) {
                // If the mobile value is set, the screen width must be smaller than the set value to get sheet-only activated
                return true;
            }
        }
    }

    return false;
}

function popupSheet(user) {
    const actor = user.character;
    currentActor = actor;

    if (actor) {
        currentSheet = actor.sheet;
        currentSheet.render(true);
        setCurrentActorTokenAsControlled();
    } else {
        console.log(`No actor for user found.`);
    }
}

// Take control of the token of this actor (for targeting)
function setCurrentActorTokenAsControlled() {
    const activeTokens = currentActor.getActiveTokens();
    if (activeTokens.length > 0) {
        activeTokens[0].control({releaseOthers: true})
    }
}

window.sheetOnly = {
    isSheetOnly: function () {
        return isSheetOnly();
    },

    getActor: function () {
        return currentActor;
    },

    getPlusCompatibility: function() {
        return "0.1.0";
    }
}
