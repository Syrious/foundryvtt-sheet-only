/**
 * https://foundryvtt.com/packages/real-dice
 */
export function realDiceActive(){
    let moduleName = "real-dice";
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}