import {renderOnSidebar} from "./sidebar";

let journalPopout;

export function openJournal() {
    game.journal.apps[0]?.renderPopout().then(journalApp => {
        journalPopout = journalApp;
        journalPopout.classList.add("so-draggable");

        renderOnSidebar(journalPopout).then(() => {
            addListener()
        });
    });
}

function addListener() {
    journalPopout.addEventListener('close', () => {
        journalPopout = undefined;
    });
}

export function toggleJournal() {
    if (journalPopout) {
        closeJournal();
    } else {
        openJournal();
    }
}

export function closeJournal() {
    if (journalPopout) {
        journalPopout.close();
    }
}