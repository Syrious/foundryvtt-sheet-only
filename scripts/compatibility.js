export function setupCompatibility() {
    realDice();
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
    const shouldBeEnabled = await game.settings.get('sheet-only', 'real-dice');

    if (isRealDiceActive) {
        console.log("Enabling Real Dice for Sheet-Only ", shouldBeEnabled)
        game.settings.set("real-dice", "manualRollMode", shouldBeEnabled ? 1 : 0)
    }
}