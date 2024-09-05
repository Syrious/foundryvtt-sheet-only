export function setupCompatibility() {
    realDice();
    searchEngineAvailable();
}

export function sheetOnlyPlusActive() {
    let moduleName = "sheet-only-plus";
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}

/**
 * https://foundryvtt.com/packages/real-dice
 *
 */
export function realDiceActive() {
    let moduleName = "real-dice";
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}

async function realDice() {
    const isRealDiceActive = realDiceActive();
    const shouldBeEnabled = game.settings.settings.has('sheet-only.real-dice')
        ? await game.settings.get('sheet-only', 'real-dice')
        : false;

    if (isRealDiceActive) {
        console.log("Enabling Real Dice for Sheet-Only ", shouldBeEnabled)
        game.settings.set("real-dice", "manualRollMode", shouldBeEnabled ? 1 : 0)
    }
}

export function spotlightOmnisearchActive() {
    let moduleName = 'spotlight-omnisearch';
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}

export function quickInsertActive() {
    let moduleName = 'quick-insert';
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}

export function searchEngineAvailable() {
    // const isSpotlightOmnisearchAvailable = spotlightOmnisearchActive();
    // const isQuickInsertAvailable = quickInsertActive();

    // return isSpotlightOmnisearchAvailable || isQuickInsertAvailable;

    return false;
}
