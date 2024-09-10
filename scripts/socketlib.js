import { transformInto, revertOriginalForm } from "./system-specific/dnd5e/morphSearch.js";

let socket;

export function setUpSocketlib() {
    Hooks.once("socketlib.ready", () => {
        initSocket();
    });
}

export function initSocket() {
    socket = socketlib.registerModule("sheet-only");
    socket.register("revertOriginalForm", revertOriginalForm);
    socket.register("transformInto", transformInto);
}

export function getSocket() {
    return socket;
}