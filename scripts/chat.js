import {moduleId} from "./settings.js";

function updateChatState(isCollapsed) {
    const $sheet = $('.sheet-only-chat');
    $sheet.toggleClass('collapse', isCollapsed);

    const chatFullscreen = game.settings.get(moduleId, "chat-fullscreen");
    chatElementWrapper.toggleClass('fullscreen', chatFullscreen)

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
