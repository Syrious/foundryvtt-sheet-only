export function sheetOnlyPlusActive() {
    let moduleName = "sheet-only-plus";
    return game.modules.has(moduleName) && game.modules.get(moduleName).active;
}


