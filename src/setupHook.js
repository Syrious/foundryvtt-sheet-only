import {isSheetOnly} from "./util";
import {setupApi} from "./api";
import {hideCanvas} from "./canvasHider";

export async function onSetup() {
    if (!isSheetOnly()) {
        return;
    }

    await setupClient();
    setupApi();
}

async function setupClient() {
    controlCanvas()
}

function controlCanvas() {
    const setting = game.settings.get("sheet-only", "canvas-option");
    const coreIsDisabled = game.settings.get("core", "noCanvas");

    if (setting === 'Disabled' && !coreIsDisabled) {
        game.settings.set("core", "noCanvas", true);
        foundry.utils.debouncedReload();
    } else if (setting === 'Hidden') {
        hideCanvas();

        if (coreIsDisabled) {
            game.settings.set("core", "noCanvas", false);
            foundry.utils.debouncedReload();
        }
    }
}
