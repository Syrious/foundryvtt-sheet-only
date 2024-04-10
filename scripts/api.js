import {isSheetOnly, currentActor} from "./main.js";
/* global game, Hooks*/


Hooks.on('setup', async () => {
    setupApi();
});
function setupApi() {

    game.modules.get('sheet-only').api = {
        // Compatibility with plus version
        plusCompatibility: "0.1.0",

        isSheetOnly: function () {
            return isSheetOnly();
        },

        getActor: function () {
            return currentActor;
        }

        // exampleVariable: "Custom Module Variable",
        //
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