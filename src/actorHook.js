import {isSheetOnly} from "./util";
import {isActorOwnedByUser, rebuildActorList, switchToActor} from "./actorsList";
import {actorStorage} from "./actorStorage";

export async function onCreateActor(actor){
    if (!isSheetOnly()) {
        return;
    }

    if (isActorOwnedByUser(actor)) {
        rebuildActorList();
        await switchToActor(actor);
    }
}

export async function onDeleteActor(actor){
    if (!isSheetOnly()) {
        return;
    }

    if (isActorOwnedByUser(actor)) {
        rebuildActorList();

        if (actor === actorStorage.current) {
            // We need to pop up the sheet for another character the user owns
            await popupSheet()
        }
    }
}