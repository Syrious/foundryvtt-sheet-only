export function saveLastActorId(actorId) {
    game.settings.set("sheet-only", "lastActorId", actorId);
}

export function getLastActorId() {
    return game.settings.get("sheet-only", "lastActorId");
}