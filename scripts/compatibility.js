export function setupCompatibility() {
    realDice();
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

/**
 * https://foundryvtt.com/packages/spotlight-omnisearch
 * 
 */
export function spotlightOmnisearchActive() {
    let moduleName = 'spotlight-omnisearch';
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}

/**
 * https://foundryvtt.com/packages/quick-insert
 * 
 */
export function quickInsertActive() {
    let moduleName = 'quick-insert';
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}

export function searchEngineAvailable() {
    const isSpotlightOmnisearchAvailable = spotlightOmnisearchActive();
    const isQuickInsertAvailable = quickInsertActive();

    return isSpotlightOmnisearchAvailable || isQuickInsertAvailable;
}

export function socketlibActive() {
    let moduleName = 'socketlib';
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}
