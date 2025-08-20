import {openChat} from "../../chat.js";
import { moduleId } from "../../settings.js";

export function dnd5eReadyHook() {
    if (!isDnd5e()) {
        return
    }

    document.body.addEventListener("click", onActivate, true);

    Hooks.on("renderChatMessage", handleChatMessage)
}

export function isDnd5e() {
    return game.system.id === 'dnd5e';
}

/**
 * Handle use items
 */
function handleChatMessage(message, _html, messageData){
    const shouldOpenChat = game.settings.get(moduleId, "open-chat-on-item-use");
    if(!shouldOpenChat) return;

    // Check if this user is the author of the message
    if (!messageData.author.isSelf) return;

    // Check if the messsage is usage of an item
    const useFlag = message.getFlag("dnd5e", "use")
    if (!useFlag) return;

    /**
     * Open chat and scroll to bottom.
     * It might be possible to scroll to the specific message. But from my experience, it doesn't worth the effort.
     * Since this message is highly likely to be the last message (Given that we're scrolling right after it is sent)
     */
    openChat()
    game.messages.directory.scrollBottom();
}

/**
 * Opens a tooltip
 * @param event
 */
function onActivate(event) {
    let element = event.target;

    while(element) {
        if (element.hasAttribute('data-tooltip-class')) {
            game.tooltip.activate(element);
            break;
        }
        element = element.parentElement;
    }
}