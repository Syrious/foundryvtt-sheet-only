import { socketlibActive } from "./compatibility.js";
import { revertOriginalForm } from "./morphSearch.js";

let socket;

export function setUpSocketlib() {
    Hooks.once("socketlib.ready", () => {
        initSocket();
    });
}

export function initSocket() {
    socket = socketlib.registerModule("sheet-only");
    socket.register("revertOriginalForm", revertOriginalForm);
}

export function getSocket() {
    return socket;
}