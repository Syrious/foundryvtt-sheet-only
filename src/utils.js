export function i18n(key) {
    return game.i18n.localize(key)
}

export function isSheetOnly() {

    let playerdata = game.settings.get("sheet-only", 'playerdata');
    let user = game.user;
    let userData = playerdata[user.id];

    if (userData) {
        const useSheetOnly = userData.display;

        if (useSheetOnly) {
            const screenWidthToIgnoreSheetOnly = userData.screenwidth;

            if (screenWidthToIgnoreSheetOnly <= 0) {
                // We ignore screen size
                return true;
            }

            if (screen.width < screenWidthToIgnoreSheetOnly) {
                // If the mobile value is set, the screen width must be smaller than the set value to get sheet-only activated
                return true;
            }
        }
    }

    return false;
}