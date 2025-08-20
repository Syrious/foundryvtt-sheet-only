import {actorStorage, saveLastActorId} from "./actorStorage.js";


export function rebuildActorList() {
    let actorList = $('.sheet-only-actor-list');

    displayActorListButton();

    actorList.empty();
    let actorElements = getActorElements();

    actorList.show();
    actorElements.forEach(elem => actorList.append(elem));
}

export function displayActorListButton() {
    const actorsListButton = $("#so-collapse-actor-select")
    const ownedActors = getOwnedActors();

    if (ownedActors.length > 1) {
        actorsListButton.show();
    } else {
        actorsListButton.hide();
    }
}

export function getOwnedActors() {
    return game.actors.filter(actor => isActorOwnedByUser(actor));
}

export function isActorOwnedByUser(actor) {
    return actor.ownership[game.user.id] === 3;
}

export function getActorElements() {
    let actors = getOwnedActors();
    return actors.map(actor => {
            return $('<div>')
                //.text(actor.name)
                .append($('<img>').attr('src', actor.img))
                .click(async () => {
                    await switchToActor(actor);
                    toggleActorList();
                });
        }
    );
}

/**
 * @param {Actor} actor
 */
export async function switchToActor(actor, render = true) {
    actorStorage.current = actor;
    if (render) await actor.sheet.render(true);

    setCurrentActorTokenAsControlled(actor);
    saveLastActorId(actorStorage.current.id);
}

// Take control of the token of this actor (for targeting)
function setCurrentActorTokenAsControlled() {
    if (actorStorage.current) {
        const activeTokens = actorStorage.current.getActiveTokens();
        if (activeTokens.length > 0) {
            activeTokens[0].control({releaseOthers: true})
        }
    }
}

export function toggleActorList() {
    $('.sheet-only-actor-list').toggleClass('collapse');
    if ($('.sheet-only-actor-list.collapse')) {
        localStorage.setItem("collapsed-actor-select", "true");
    } else {
        localStorage.setItem("collapsed-actor-select", "false");
    }
}