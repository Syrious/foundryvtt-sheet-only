import {showPatreonDialog} from "./dialogs.js"
import {initDragListener, wasDragged} from "./drag.js";
import {toggleFullscreen} from "./fullscreen.js";
import {sheetOnlyPlusActive} from "./compatibility.js";
import {toggleChat} from "./chat.js";
import {displayActorListButton, toggleActorList} from "./actorsList.js";
import { displayMorphSearchButton } from "./system-specific/dnd5e/morphSearch.js";

const maxWithForSmallDisplays = 800;
const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export function addControlButtons(sheetContainer, increaseZoom, decreaseZoom, resetZoom) {
    const buttonContainer = $(`<div class="button-container so-draggable"></div>`);

    if (screenWidth < maxWithForSmallDisplays) {
        // Create a new container for main buttons at the bottom of the screen
        const mainButtonsContainer = $(`<div class="small-display-main-buttons"></div>`);

        buttonContainer.load("modules/sheet-only/templates/buttons-small-display.html", () => {
            setupDefaultButtons(buttonContainer, increaseZoom, decreaseZoom, resetZoom);
            setupMenuButtonForSmallDisplays(buttonContainer);

            const mainButtons = buttonContainer.find('#so-main-buttons');
            mainButtonsContainer.append(mainButtons);
        });

        sheetContainer.append(mainButtonsContainer);
    } else {

        buttonContainer.load("modules/sheet-only/templates/buttons.html", () => {
            setupDefaultButtons(buttonContainer, increaseZoom, decreaseZoom, resetZoom);
            setupMenuButtonForLargeDisplays(buttonContainer);
        });
    }

    sheetContainer.append(buttonContainer);

    setupDefaults();
    initDragListener();
}

function setupMenuButtonForLargeDisplays(buttonContainer) {
    const menuButton = buttonContainer.find("#so-menu");

    menuButton.on("click", function () {
        if (wasDragged()) return;

        $('#so-main-buttons').toggle();
        $('#so-settings-buttons').toggle();
    });
}

function setupMenuButtonForSmallDisplays(buttonContainer) {
    const menuButton = buttonContainer.find("#so-menu");
    menuButton.on("click", function () {
        if (wasDragged()) return;

        $('#so-settings-buttons').toggle();
    });
}

function setupDefaultButtons(buttonContainer, increaseZoom, decreaseZoom, resetZoom) {
    const collapseButton = buttonContainer.find("#so-collapse-actor-select")
    const chatButton = buttonContainer.find("#so-toggle-chat")
    const increaseButton = buttonContainer.find("#so-increase-font");
    const decreaseButton = buttonContainer.find("#so-decrease-font");
    const resetButton = buttonContainer.find("#so-reset-font");
    const logoutButton = buttonContainer.find("#so-log-out");
    const targetingButton = buttonContainer.find("#so-targeting");
    const journalButton = buttonContainer.find("#so-journal");
    const controllingButton = buttonContainer.find("#so-controlling");
    const settingsButton = buttonContainer.find("#so-fvtt-settings");
    const fullscreen = buttonContainer.find("#so-fullscreen");

    collapseButton.on("click", function () {
        if (wasDragged()) return;

        toggleActorList();
    });

    chatButton.on("click", function () {
        if (wasDragged()) return;
        toggleChat();
    });

    increaseButton.on("click", function () {
        if (wasDragged()) return;
        increaseZoom();
    });

    decreaseButton.on("click", function () {
        if (wasDragged()) return;
        decreaseZoom();
    });

    resetButton.on("click", function () {
        if (wasDragged()) return;
        resetZoom()
    });

    logoutButton.on("click", function () {
        if (wasDragged()) return;
        ui.menu.items.logout.onClick();
    });

    settingsButton.on("click", function () {
        if (wasDragged()) return;
        game.settings.sheet.render(true);
    })

    targetingButton.on("click", function () {
        if (wasDragged()) return;
        if (sheetOnlyPlusActive()) {
            game.modules.get('sheet-only-plus').api.openTargeting();
        } else {
            showPatreonDialog("Targeting");
        }
    });

    journalButton.on("click", function () {
        if (wasDragged()) return;
        if (sheetOnlyPlusActive()) {
            game.modules.get('sheet-only-plus').api.openJournal();
        } else {
            showPatreonDialog("Journal");
        }
    });

    controllingButton.on("click", function () {
        if (wasDragged()) return;

        if (sheetOnlyPlusActive()) {
            game.modules.get('sheet-only-plus').api.openControls();
        } else {
            showPatreonDialog("Movement");
        }
    });

    fullscreen.on("click", function () {
        if (wasDragged()) return;
        toggleFullscreen();
    });

    displayActorListButton();
    displayMorphSearchButton();
}

function setupDefaults() {
    $('#collapse-actor-select i').addClass('hidden');
    $('.sheet-only-actor-list').addClass('collapse');
}


