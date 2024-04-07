import {showPatreonDialog, wipDialog} from "./dialogs.js"

export function addControlButtons(sheetContainer, increaseZoom, decreaseZoom, resetZoom) {
    const uiElement = $(`<div class="button-container"></div>`);

    uiElement.load("modules/sheet-only/templates/buttons.html", function () {
        const collapseButton = uiElement.find("#so-collapse-actor-select")
        const chatButton = uiElement.find("#so-toggle-chat")
        const increaseButton = uiElement.find("#so-increase-font");
        const decreaseButton = uiElement.find("#so-decrease-font");
        const resetButton = uiElement.find("#so-reset-font");
        const logoutButton = uiElement.find("#so-log-out");
        const targetingButton = uiElement.find("#so-targeting");
        const controllingButton = uiElement.find("#so-controlling");
        const settingsButton = uiElement.find("#so-fvtt-settings");
        const menuButton = uiElement.find("#so-menu");

        collapseButton.on("click", function () {
            toggleActorList();
        });

        chatButton.on("click", function () {
            toggleChat();
        });

        increaseButton.on("click", function () {
            increaseZoom();
        });

        decreaseButton.on("click", function () {
            decreaseZoom();
        });

        resetButton.on("click", function () {
            resetZoom()
        });

        logoutButton.on("click", function () {
            ui.menu.items.logout.onClick();
        });

        settingsButton.on("click", function () {
            game.settings.sheet.render(true);
        })

        targetingButton.on("click", function () {
            if (window.sheetOnlyPlus && typeof window.sheetOnlyPlus.openTargeting === "function") {
                window.sheetOnlyPlus.openTargeting();
            } else {
                showPatreonDialog("Targeting");
            }
        });

        controllingButton.on("click", function () {
            wipDialog("Movement", "It will let you move your tokens.");

            // if (window.sheetOnlyPlus && typeof window.sheetOnlyPlus.openControls === "function") {
            //     window.sheetOnlyPlus.openControls();
            // } else {
            //    showPatreonDialog("Movement");
            // }
        });

        menuButton.on("click", function () {
            toggleMenu();
        });
    });

    sheetContainer.append(uiElement);

    setupDefaults();
}

function setupDefaults() {
    $('#collapse-actor-select i').addClass('hidden');
    $('.sheet-only-actor-list').addClass('collapse');
}

export function toggleActorList() {
    $('#collapse-actor-select i').toggleClass('hidden');

    $('.sheet-only-actor-list').toggleClass('collapse');
    if ($('.sheet-only-actor-list.collapse')) {
        localStorage.setItem("collapsed-actor-select", "true");
    } else {
        localStorage.setItem("collapsed-actor-select", "false");
    }
}

function toggleChat() {
    $('.sheet-only-chat').toggleClass('collapse');

    if ($('.sheet-only-chat.collapse')) {
        localStorage.setItem("collapsed-chat", "true");
    } else {
        localStorage.setItem("collapsed-chat", "false");
    }
}

function toggleMenu(){
    $('#so-main-buttons').toggle();
    $('#so-settings-buttons').toggle();
}

