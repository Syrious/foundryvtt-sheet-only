import {isSheetOnly} from "./util";
import {moduleId} from "./settings";
import {enableCanvasDialog} from "./dialogs";
import {getOwnedActors, rebuildActorList, switchToActor} from "./actorsList";
import {dnd5eReadyHook} from "./system-specific/dnd5e/dnd5e";
import {addControlButtons} from "./addControlButtons";
import * as FirefoxZoom from "./firefoxZoom";
import * as DefaultZoom from "./defaultZoom";
import {i18n} from "./utils";
import {getLastActorId} from "./actorStorage";
import {popupSheet} from "./sheet";

export async function onReady() {
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

function hideUnusedElements() {
    $("#interface").addClass("sheet-only-hide");
    $("#pause").addClass("sheet-only-hide");

    $("#tooltip").addClass("sheet-only-hide");

    if (!game.settings.get("sheet-only", "display-notifications")) {
        $("#notifications").addClass("sheet-only-hide");
    }
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

function onResize(event) {

    currentSheet?.setPosition({
        width: window.innerWidth,
        height: window.innerHeight
    });
}

