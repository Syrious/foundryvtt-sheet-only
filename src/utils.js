export function i18n(key) {
    return game.i18n.localize(key)
}

export function getUserData() {
    let playerdata = game.settings.get("sheet-only", 'playerdata');
    return playerdata[game.user.id];
}

export function isSheetOnly() {
    let userData = getUserData();

    if (userData) {
        const useSheetOnly = userData.display;

        if (useSheetOnly) {
            const sheetOnlyScreenWidthLimit = userData.screenwidth;
            const activateInPortraitOnly = userData.activateOnPortrait;
            const screenIsPortrait = window.matchMedia("(orientation: portrait)").matches;

            const orientationAllowsSheetOnly = !activateInPortraitOnly || screenIsPortrait;
            const screenWidthAllowsSheetOnly = sheetOnlyScreenWidthLimit <= 0 || screen.width < sheetOnlyScreenWidthLimit;

            if (orientationAllowsSheetOnly && screenWidthAllowsSheetOnly) {
                return true;
            }
        }
    }

    return false;
}