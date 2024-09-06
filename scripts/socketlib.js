import { socketlibActive } from "./compatibility.js";
import { deleteAfterUnmorph } from "./morphSearch.js";

let socket;

export function setUpSocketlib() {
    Hooks.once("socketlib.ready", () => {
        initSocket();
    });
}

export function initSocket() {
    socket = socketlib.registerModule("sheet-only");
    socket.register("deleteAfterUnmorph", deleteAfterUnmorph);
}

export function getSocket() {
    return socket;
}