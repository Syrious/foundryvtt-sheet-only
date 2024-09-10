import { actorStorage } from "./actorStorage.js";
import {isSheetOnly} from "./main.js";
/* global game, Hooks*/


Hooks.once('setup', async () => {
    setupApi();
});

function setupApi() {
    game.modules.get('sheet-only').api = {
        // This sheet-only version is compatible with the following sheet-only-plus version
        plusCompatibility: "0.5.0",

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