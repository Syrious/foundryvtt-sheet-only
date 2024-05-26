import {isSheetOnly, currentActor} from "./main.js";
/* global game, Hooks*/


Hooks.once('setup', async () => {
    setupApi();
});

function setupApi() {
    game.modules.get('sheet-only').api = {
        // This sheet-only version is compatible with the following sheet-only-plus version
        plusCompatibility: "0.2.0",

        getCurrentActor: function () {
            return currentActor;
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