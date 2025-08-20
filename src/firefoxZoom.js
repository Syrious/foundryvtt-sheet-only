export function increaseZoom() {
    const max = game.settings.settings.get('core.fontSize').range.max;
    const currentFontSize = game.settings.get("core", "fontSize");

    let newFontSize = currentFontSize + 1;

    if (newFontSize > max) {
        newFontSize = max;
    }

    game.settings.set("core", "fontSize", newFontSize)
}

export function decreaseZoom() {
    const min = game.settings.settings.get('core.fontSize').range.min;
    const currentFontSize = game.settings.get("core", "fontSize");

    let newFontSize = currentFontSize - 1;

    if (newFontSize < min) {
        newFontSize = min;
    }

    game.settings.set("core", "fontSize", newFontSize)
}

export function resetZoom() {
    const defaultFontSize = game.settings.settings.get('core.fontSize').default;

    game.settings.set("core", "fontSize", defaultFontSize)
}