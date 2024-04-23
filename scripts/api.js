import {isSheetOnly, currentActor} from "./main.js";
/* global game, Hooks*/


Hooks.once('setup', async () => {
    setupApi();
});

function setupApi() {
    game.modules.get('sheet-only').api = {
        // Compatibility with plus version
        plusCompatibility: "0.1.0",

        getActor: function () {
            return currentActor;
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