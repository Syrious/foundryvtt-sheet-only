import {moduleId} from "./settings.js";

function updateChatState(isCollapsed) {
    const $sheet = $('.sheet-only-chat');
    $sheet.toggleClass('collapse', isCollapsed);

    localStorage.setItem("collapsed-chat", isCollapsed ? "true" : "false");
}

export function openChat() {
    updateChatState(false);
}

export function closeChat() {
    updateChatState(true);
}

export function toggleChat() {
    const $sheet = $('.sheet-only-chat');
    const isCollapsed = $sheet.hasClass('collapse');
    updateChatState(!isCollapsed);
}

export function setupChatPanel() {
    const chatElement = $('#chat'); // Get the chat element
    const newParentElement = $('.sheet-only-container'); // Get the new parent

    if (chatElement.length && newParentElement.length) {
        // Create a new div and wrap the chat element inside it
        chatElement.wrap('<div id="chat-wrapper"></div>');

        // Get the wrapper we just created along with its child
        const chatElementWrapper = $('#chat-wrapper');
        chatElementWrapper.addClass("sheet-only-chat");
        chatElementWrapper.addClass('collapse');

        const chatFullscreen = game.settings.get(moduleId, "chat-fullscreen");
        updateChatFullscreen(chatFullscreen)

        chatElementWrapper.detach(); // Remove the wrapped chatElement (along with its wrapper) from the DOM
        newParentElement.append(chatElementWrapper); // Append the wrapped chatElement (with its wrapper) to the new parent
    } else {
        console.log("Could not find chat panel")
    }
}

export function updateChatFullscreen(fullscreen) {
    const chatElementWrapper = $('#chat-wrapper');
    if(fullscreen) {
        // To reset the chat to correct place even after moved around with draggable
        chatElementWrapper.css({
            left: 0,
            right: 0,
            top: 0
        });
        chatElementWrapper.removeClass('so-draggable')
        chatElementWrapper.addClass('fullscreen')
    } else {
        chatElementWrapper.css({
            left: '',
            right: 0,
            top: 0
        });
        chatElementWrapper.removeClass('fullscreen')
        chatElementWrapper.addClass('so-draggable');
    }
}