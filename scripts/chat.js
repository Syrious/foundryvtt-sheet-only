import {moduleId} from "./settings.js";
import {isSheetOnly} from "./main.js";

let chatPopout;

function popoutChat() {
    // Retrieve the chat tab element
    const chatTabElement = document.querySelector('#chat');

    // Ensure the element is found and the associated tab app can be accessed
    if (chatTabElement && window.ui) {
        const tabApp = window.ui[chatTabElement.dataset.tab];

        if (tabApp && typeof tabApp.renderPopout === 'function') {
            // Call renderPopout on the tabApp
            tabApp.renderPopout().then(popout => {
                chatPopout = popout;
                chatPopout.classList.add("so-draggable");

                const chatFullscreen = game.settings.get(moduleId, "chat-fullscreen");
                updateChatFullscreen(chatFullscreen, chatPopout)
            });

        } else {
            console.error("The popout or renderPopout function is not available.");
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
    if(!chatPopout){
        popoutChat();
    }
}

export function closeChat() {
    if (chatPopout) {
        chatPopout.close();
        chatPopout = undefined;
    }
}

export function toggleChat() {
    if (chatPopout) {
        closeChat();
    }else{
        popoutChat();
    }
}

export function updateChatFullscreen(fullscreen, chatPopout) {
    if(!isSheetOnly()) return;

    chatPopout.element.style.zIndex = 9999;

    if (fullscreen) {
        // To reset the chat to correct place even after moved around with draggable
        chatPopout.setPosition({
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });

        chatPopout.classList.remove('so-draggable')

    } else {
        chatPopout.setPosition({
            left: window.innerWidth,
            top: 0
        });

        chatPopout.classList.add('so-draggable');
    }
}
