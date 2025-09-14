import {renderOnSidebar} from "./sidebar";
import {isSheetOnly} from "./utils";

let journalPopout;

export function onRenderJournalDirectory(app, html) {
    if (isSheetOnly()) {

        app.setPosition({
            left: window.innerWidth,
            top: 0,
            zIndex: 9999
        });

        app.classList.add('so-draggable');
    }
}

export function openJournal() {
    game.journal.apps[0]?.renderPopout().then(journalApp => {
        journalPopout = journalApp;
        journalPopout.classList.add("so-draggable");

        if (window.innerWidth > 800) {
            renderOnSidebar(journalPopout);
        }

        addListener();
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