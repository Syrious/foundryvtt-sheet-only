import {actorStorage} from "./actorStorage.js";
import {isSheetOnly} from "./utils";

/* global game, Hooks*/
export function setupApi() {
    game.modules.get('sheet-only').api = {
        // This sheet-only version is compatible with the following sheet-only-plus version
        plusCompatibility: "1.2.2",

        getCurrentActor: function () {
            return actorStorage.current;
        },

        isSheetOnly: function () {
            return isSheetOnly();
        }
    }
}