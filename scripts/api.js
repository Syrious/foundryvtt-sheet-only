import { actorStorage } from "./actorStorage.js";
import {isSheetOnly} from "./main.js";
import { getSocket } from "./socketlib.js";
/* global game, Hooks*/


Hooks.once('setup', async () => {
    setupApi();
});

function setupApi() {
    game.modules.get('sheet-only').api = {
        // This sheet-only version is compatible with the following sheet-only-plus version
        plusCompatibility: "0.4.3",

        getCurrentActor: function () {
            return actorStorage.current;
        },

        isSheetOnly: function () {
            return isSheetOnly();
        }

        // ExampleClass: class {
        //     constructor(name) {
        //         this.name = name;
        //     }
        //
        //     myMethod() {
        //         //...the actual logic
        //     }
        // }
    }
}