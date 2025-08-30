export default function integrateLame(htmlPassed) {
    const html = htmlPassed instanceof jQuery ? htmlPassed[0] : htmlPassed
    if (html.querySelector("#lame-messenger-button")) {
        return;
    }

    const lameInstance = game.modules.get("lame-messenger").instance;
    const lameButton = lameInstance.chatbarButton;
    lameButton.addEventListener('click', () => lameInstance.bringToFront())
    const chatControlBar = document.getElementById("chat-controls")
    chatControlBar.appendChild(lameButton);
}