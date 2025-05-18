import {addControlButtons} from "./addControlButtons.js";
import * as FirefoxZoom from "./firefoxZoom.js";
import * as DefaultZoom from "./defaultZoom.js";
import {setupCompatibility} from "./compatibility.js";
import {hideCanvas} from "./canvasHider.js";
import {dnd5eReadyHook} from "./system-specific/dnd5e/dnd5e.js";
import {actorStorage, getLastActorId} from "./actorStorage.js";
import {i18n} from "./utils.js";
import {enableCanvasDialog} from "./dialogs.js";
import {moduleId} from "./settings.js";
import {getOwnedActors, isActorOwnedByUser, rebuildActorList, switchToActor} from "./actorsList.js";
import {updateMorphSearchButton} from "./system-specific/dnd5e/morphSearch.js";
import {setUpSocketlib} from "./socketlib.js";

/* global game, canvas, Hooks, CONFIG, foundry */
// CONFIG.debug.hooks = false;

/** @type {FormApplication|null} */
let currentSheet = null; // Track the currently open sheet

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

/* Wildshape, Polymorph etc */
Hooks.on('dnd5e.transformActor', async (fromActor, toActor) => {
    if (!isSheetOnly()) {
        return;
    }

    if (actorStorage.current?.id === fromActor.id) {
        actorStorage.current = toActor;
    }
});

Hooks.once('ready', async function () {
    if (!isSheetOnly()) {
        const canvasDisabled = game.settings.get("core", "noCanvas");
        const neverAsk = game.settings.get(moduleId, "neverAskCanvas");

        if (canvasDisabled && !neverAsk) {
            enableCanvasDialog();
        }

        return;
    }

    await userInitialization();

    setupContainer();
    rebuildActorList()
    await popupSheet();
    hideUnusedElements();

    addEventListener("resize", onResize);

    dnd5eReadyHook();
});

Hooks.on('renderActorSheetV2', async (app, _sheet, {actor}) => {
        if (currentSheet?.id === app.id || !isSheetOnly()) {
            return;
        }

        currentSheet?.close();
        currentSheet = app;

        app?.setPosition({
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });

        app.classList.add('sheet-only-sheet');

        $(".window-resizable-handle").hide();

        getTokenizerImage();

        if (actor) {
            await switchToActor(actor, false);
        }

        updateMorphSearchButton();
    }
);

Hooks.on('createActor', async function (actor) {
    if (!isSheetOnly()) {
        return;
    }

    if (isActorOwnedByUser(actor)) {
        rebuildActorList();
        await switchToActor(actor);
    }
});

Hooks.on('deleteActor', async function (actor) {
    if (!isSheetOnly()) {
        return;
    }

    if (isActorOwnedByUser(actor)) {
        rebuildActorList();

        if (actor === actorStorage.current) {
            // We need to pop up the sheet for another character the user owns
            await popupSheet()
        }
    }
});

Hooks.on('renderContainerSheet', async (app, html) => {
    if (!isSheetOnly()) {
        return;
    }

    app.setPosition({
        left: window.innerWidth,
        top: 0,
        width: 1, // It will adjust to its minimum width
        height: window.innerHeight // It will adjust to its minimum height
    })
    html.css('z-index', '99999');
});

Hooks.once('closeUserConfig', async () => {
    if (!isSheetOnly()) {
        return;
    }
    // Popup sheet after user selected their character
    await popupSheet()
});

Hooks.on('renderSettingsConfig', async (app, element, settings) => {
    if (!isSheetOnly()) {
        return;
    }

    app.setPosition({zIndex: 2000})

    if (window.innerWidth < 600) {
        app.setPosition({
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        })

        const content = element.querySelector('.window-content');

        if (content) {
            content.style.flexDirection = 'column'
            content.style.overflowY = 'auto';
            content.style.maxHeight = '100vh';
        }
    }
})

setUpSocketlib();

/* ************************************* */

async function setupClient() {
    controlCanvas()
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

function setupContainer() {
    const sheetContainer = $('<div>').addClass('sheet-only-container');

    $('body').append(sheetContainer);
    sheetContainer.append(
        $('<div>')
            .css({'padding-top': '40px'})
            .addClass('sheet-only-actor-list')
            .attr('id', 'sheet-only-actor-list')
    );

    // Add control buttons depending on browser
    if (navigator.userAgent.indexOf("Firefox") !== -1) {
        console.log("Adding font-size buttons for firefox");
        addControlButtons(sheetContainer, FirefoxZoom.increaseZoom, FirefoxZoom.decreaseZoom, FirefoxZoom.resetZoom);
    } else {
        console.log("Adding zoom buttons");
        addControlButtons(sheetContainer, DefaultZoom.increaseZoom, DefaultZoom.decreaseZoom, DefaultZoom.resetZoom);
    }
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

async function popupSheet() {
    const ownedActors = getOwnedActors();
    const lastActorId = getLastActorId();

    // Attempt to open the last used actor
    if (lastActorId) {
        const lastActor = game.actors.get(lastActorId);
        const actorIsOwned = ownedActors.some(actor => actor.id === lastActorId);

        if (lastActor && actorIsOwned) {
            await switchToActor(lastActor);
            return; // Exit the function if the last actor was successfully loaded
        } else {
            console.log("The saved actor could not be found, opening the first actor.");
        }
    }

    // Open the first actor in the list if no saved actor was found or could not be loaded
    if (ownedActors?.length > 0) {
        await switchToActor(ownedActors[0]);
    } else {
        console.error("No actor for user found.");
    }
}

function onResize(event) {

    currentSheet?.setPosition({
        width: window.innerWidth,
        height: window.innerHeight
    });
}
