import {moduleId} from "./settings.js";
import {isSheetOnly} from "./main.js";

function popoutChat() {
    // Retrieve the chat tab element
    const chatTabElement = document.querySelector('#sidebar-tabs .item[data-tab="chat"]');

    // Ensure the element is found and the associated tab app can be accessed
    if (chatTabElement && window.ui) {
        const tabApp = window.ui[chatTabElement.dataset.tab];

        if (tabApp && typeof tabApp.renderPopout === 'function') {
            // Call renderPopout on the tabApp
            tabApp.renderPopout(tabApp);

            function waitForRender() {
                if (tabApp._popout.rendered) {
                    tabApp._popout.element.addClass("so-draggable");
                    tabApp._popout.element.find('#chat-form, #chat-controls').hide();

                    const chatFullscreen = game.settings.get(moduleId, "chat-fullscreen");
                    updateChatFullscreen(chatFullscreen, tabApp._popout.element)
                } else {
                    setTimeout(waitForRender, 10); // check again after 10ms
                }
            }

            waitForRender();
        } else {
            console.error("The tabApp or renderPopout function is not available.");
        }
    } else {
        console.error("Chat tab element or ui object not found.");
    }
}

function updateChatState(isCollapsed) {
    if (isCollapsed) {
        popoutChat();
    } else {
        closeChat();
    }
}

export function openChat() {
    updateChatState(false);
}

export function closeChat() {
    // Get the chat popout div
    const chatPopout = document.getElementById('chat-popout');

    // Check if the chat popout exists to prevent errors
    if (chatPopout) {
        // Find the close button within the chat popout
        const closeButton = chatPopout.querySelector('.header-button.control.close');

        // Check if the close button exists
        if (closeButton) {
            // Trigger the click event on the close button
            closeButton.click();
        } else {
            console.error('Close button not found within chat popout!');
        }
    } else {
        console.error('Chat popout not found!');
    }
}

export function toggleChat() {
    const chat = document.getElementById('chat-popout');
    const isOpen = chat !== null;
    updateChatState(!isOpen);
}

export function updateChatFullscreen(fullscreen, chatPopout) {
    if(!isSheetOnly()) return;

    if (fullscreen) {
        // To reset the chat to correct place even after moved around with draggable
        chatPopout.css({
            left: 0,
            right: 0,
            top: 0,
            width: '100%',
            height: '100vh',
        });

        chatPopout.removeClass('so-draggable')

    } else {
        chatPopout.css({
            left: '',
            right: 0,
            top: 0
        });
        chatPopout.addClass('so-draggable');
    }
}
