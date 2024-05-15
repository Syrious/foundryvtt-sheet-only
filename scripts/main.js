import {addControlButtons, toggleActorList} from "./addControlButtons.js";
import * as FirefoxZoom from "./firefoxZoom.js";
import * as DefaultZoom from "./defaultZoom.js";
import {setupCompatibility} from "./compatibility.js";
import {hideCanvas} from "./canvasHider.js";
import {dnd5eReadyHook, dnd5eEditSlider} from "./system/dnd5e.js";
import {getLastActorId, saveLastActorId} from "./actorStorage.js";
import {i18n} from "./utils.js";

/* global game, canvas, Hooks, CONFIG, foundry */

CONFIG.debug.hooks = false;

/** @type {FormApplication|null} */
let currentSheet = null; // Track the currently open sheet
export let currentActor; // The currently selected actor

/* ************************************* */
/* *************** HOOKS *************** */
/* ************************************* */
Hooks.on('setup', async () => {
    if (!isSheetOnly()) {
        return;
    }

    await setupClient();
    setupCompatibility();
});

Hooks.once('ready', async function () {
    if (!isSheetOnly()) {
        return;
    }

    await userInitialization();

    setupContainer();
    rebuildActorList()
    setupChatPanel();
    popupSheet();
    hideUnusedElements();

    addEventListener("resize", onResize);

    dnd5eReadyHook();
});


Hooks.on('renderActorSheet',
    /** @param {FormApplication|null} app */
    async (app) => {
        if (!isSheetOnly()) {
            return;
        }

        app?.setPosition({
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });

        app.element.addClass('sheet-only-sheet');

        dnd5eEditSlider();

        $(".window-resizable-handle").hide();

        getTokenizerImage();
    })


Hooks.on('createActor', async function (actor) {
    if (!isSheetOnly()) {
        return;
    }

    if (isActorOwnedByUser(actor)) {
        rebuildActorList();
        switchToActor(actor);
    }
});

Hooks.on('deleteActor', async function (actor) {
    if (!isSheetOnly()) {
        return;
    }

    if (isActorOwnedByUser(actor)) {
        rebuildActorList();

        if(actor === currentActor){
            // We need to pop up the sheet for another character the user owns
            popupSheet()
        }
    }
});

Hooks.on('renderContainerSheet', async (app, html) => {
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
    popupSheet()
});

/* ************************************* */
/* ************************************* */
/* ************************************* */

async function setupClient() {
    disableSounds();
    controlCanvas()
}

function disableSounds() {
    game.settings.set("core", "globalPlaylistVolume", 0.0)
    game.settings.set("core", "globalAmbientVolume", 0.0)
    game.settings.set("core", "globalInterfaceVolume", 0.0)
}

function controlCanvas() {
    const setting = game.settings.get("sheet-only", "canvas-option");
    const coreIsDisabled = game.settings.get("core", "noCanvas");

    if (setting === 'Disabled' && !coreIsDisabled) {
        game.settings.set("core", "noCanvas", true);
        foundry.utils.debouncedReload();
    } else if (setting === 'Hidden') {
        hideCanvas();

        if (coreIsDisabled) {
            game.settings.set("core", "noCanvas", false);
            foundry.utils.debouncedReload();
        }
    }
}

function isActorOwnedByUser(actor) {
    return actor.ownership[game.user.id] === 3;

}

/**
 *
 * @param {Actor} actor
 */
function switchToActor(actor) {
    currentSheet?.close();

    currentActor = actor;
    currentSheet = currentActor.sheet;

    currentSheet.render(true);

    setCurrentActorTokenAsControlled();
    saveLastActorId(currentActor.id);
}

function setupContainer() {
    const sheetContainer = $('<div>').addClass('sheet-only-container');

    $('body').append(sheetContainer);
    sheetContainer.append($('<div>').addClass('sheet-only-actor-list').attr('id', 'sheet-only-actor-list'));

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

                    switchToActor(actor);
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

export function isSheetOnly() {

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

function userInitialization() {
    return new Promise((resolve, reject) => {
        let count = 0;
        const checkApiInterval = setInterval(() => {
            if (count % 10 === 0) {
                ui.notifications.info(i18n("Sheet-Only.display-notifications.wait-init"));
            }

            const ownedActors = getOwnedActors();

            if (ownedActors && ownedActors.length > 0) {
                ui.notifications.info(i18n("Sheet-Only.notifications.ownedActorFound"));
                clearInterval(checkApiInterval);
                resolve();
            } else if (count >= 500) {
                ui.notifications.error(i18n("Sheet-Only.notifications.actorInitError"));
                clearInterval(checkApiInterval);
                reject(new Error("Could not initialize actor."));
            } else {
                count++;
            }
        }, 500);
    });
}

function popupSheet() {
    const ownedActors = getOwnedActors();
    const lastActorId = getLastActorId();

    // Attempt to open the last used actor
    if (lastActorId) {
        const lastActor = game.actors.get(lastActorId);
        const actorIsOwned = ownedActors.some(actor => actor.id === lastActorId);

        if (lastActor && actorIsOwned) {
            switchToActor(lastActor);
            return; // Exit the function if the last actor was successfully loaded
        } else {
            console.log("The saved actor could not be found, opening the first actor.");
        }
    }

    // Open the first actor in the list if no saved actor was found or could not be loaded
    if (ownedActors?.length > 0) {
        switchToActor(ownedActors[0]);
    } else {
        console.error("No actor for user found.");
    }
}

// Take control of the token of this actor (for targeting)
function setCurrentActorTokenAsControlled() {
    const activeTokens = currentActor.getActiveTokens();
    if (activeTokens.length > 0) {
        activeTokens[0].control({releaseOthers: true})
    }
}

function onResize(event) {
    currentSheet?.element.css({
        width: window.innerWidth,
        height: window.innerHeight
    });
}
