import {getOwnedActors, switchToActor} from "./actorsList";
import {getLastActorId} from "./actorStorage";

export async function popupSheet() {
    const ownedActors = getOwnedActors();
    const lastActorId = getLastActorId();

    // Attempt to open the last used actor
    if (lastActorId) {
        const lastActor = game.actors.get(lastActorId);
        const actorIsOwned = ownedActors.some(actor => actor.id === lastActorId);

        if (lastActor && actorIsOwned) {
            await switchToActor(lastActor);
            return; // Exit the function if the last actor was successfully loaded
        } else {
            console.log("The saved actor could not be found, opening the first actor.");
        }
    }

    // Open the first actor in the list if no saved actor was found or could not be loaded
    if (ownedActors?.length > 0) {
        await switchToActor(ownedActors[0]);
    } else {
        console.error("No actor for user found.");
    }
}