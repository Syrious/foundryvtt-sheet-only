import {addControlButtons, toggleActorList} from "./addControlButtons.js";
import * as FirefoxZoom from "./firefoxZoom.js";
import * as DefaultZoom from "./defaultZoom.js";
import {setupCompatibility} from "./compatibility.js";
import {hideCanvas} from "./canvasHider.js";

/* global game, canvas, Hooks, CONFIG, foundry */

CONFIG.debug.hooks = false;

let currentSheet = null; // Track the currently open sheet
export let currentActor; // The currently selected actor

async function setupClient() {
    let shouldReload = false;

    let isCanvasDisabled = await game.settings.get("core", "noCanvas");

    if (isCanvasDisabled) {
        await game.settings.set('core', 'noCanvas', false)
        shouldReload = true;
    }

    if (shouldReload) {
        foundry.utils.debouncedReload();
    }
}

Hooks.on('setup', async () => {

    if (isSheetOnly()) {
        await setupClient();
    }

    setupCompatibility();
});

Hooks.once('ready', async function () {
    if (isSheetOnly()) {
        setupContainer();
        setupChatPanel();
        hideUnusedElements();
        popupSheet(game.user);
    }

    libWrapper.register("sheet-only", "CONFIG.Item.documentClass.prototype.use", doItemUse, "MIXED");
});

Hooks.on('renderActorSheet', async (app) => {

    if (isSheetOnly()) {
        app.setPosition({
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        });

        app.element.addClass('sheet-only-sheet');

        const shouldMoveDOM = false
        if (shouldMoveDOM) {
            const parent = $('.sheet-only-container');
            parent.append(app.element);
        }

        $(".window-resizable-handle").hide();

        getTokenizerImage();
    }
})

Hooks.on('createActor', async function (actor) {
    rebuildActorList();

    if (isActorOwnedByUser(actor)) {
        actor.sheet.render(true);
    }
});

Hooks.on('deleteActor', async function () {
    rebuildActorList();
    popupSheet(game.user)
});

Hooks.on('renderContainerSheet', async (app, html) => {
    app.setPosition({
        left: window.innerWidth,
        top: 0,
        width: 1, // It will adjust to its minimum width
        height: window.innerHeight // It will adjust to its minimum height
    })
    html.css('z-index', '99999');
});

Hooks.once('closeUserConfig', async () => {
    // Popup sheet after user selected their character
    popupSheet(game.user)
});

function isActorOwnedByUser(actor) {
    return actor.ownership[game.user.id] === 3;

}

function setupContainer() {
    const sheetContainer = $('<div>').addClass('sheet-only-container');

    $('body').append(sheetContainer);
    sheetContainer.append($('<div>').addClass('sheet-only-actor-list'));

    rebuildActorList()

    // Add control buttons depending on browser
    if (navigator.userAgent.indexOf("Firefox") !== -1) {
        console.log("Adding font-size buttons for firefox");
        addControlButtons(sheetContainer, FirefoxZoom.increaseZoom, FirefoxZoom.decreaseZoom, FirefoxZoom.resetZoom);
    } else {
        console.log("Adding zoom buttons");
        addControlButtons(sheetContainer, DefaultZoom.increaseZoom, DefaultZoom.decreaseZoom, DefaultZoom.resetZoom);
    }
}

function rebuildActorList() {
    let actorList = $('.sheet-only-actor-list');

    actorList.empty();
    let actorElements = getActorElements();
    if (actorElements.length > 1) {

        actorList.show();
        actorElements.forEach(elem => actorList.append(elem));
    } else {
        actorList.hide();
    }
}

function getOwnedActors() {
    return game.actors.filter(actor => isActorOwnedByUser(actor));
}

function getActorElements() {
    let actors = getOwnedActors();
    return actors.map(actor => {
            return $('<div>')
                //.text(actor.name)
                .append($('<img>').attr('src', actor.img))
                .click(() => {
                    if (currentActor === actor) {
                        // We clicked the same actor. Do nothing here
                        toggleActorList();
                        return;
                    }

                    if (currentSheet) {
                        currentSheet.close();
                    }

                    currentSheet = actor.sheet.render(true);
                    currentActor = actor;

                    setCurrentActorTokenAsControlled();
                    toggleActorList();
                });
        }
    );
}

function getTokenizerImage() {
    let actors = getOwnedActors();
    actors.map(actor => {
        let actorImg = actor.img;
        let sheet = $('#ActorSheet5eCharacter-Actor-' + actor._id)[0];
        if (sheet !== undefined) {
            if (actorImg.includes('tokenizer')
                && actorImg.includes('Avatar')) {
                actorImg = actorImg.replace('Avatar', 'Token');
                $('.sheet-only-container .sheet-header img.profile')[0].src = actorImg;
            }
        }
    });
}

function hideUnusedElements() {
    $("#interface").addClass("sheet-only-hide");
    $("#pause").addClass("sheet-only-hide");

    $("#tooltip").addClass("sheet-only-hide");

    if (!game.settings.get("sheet-only", "display-notifications")) {
        $("#notifications").addClass("sheet-only-hide");
    }

    if (game.settings.get("sheet-only", "hide-canvas")) {
        hideCanvas();
    }
}

function setupChatPanel() {
    var chatElement = $('#chat'); // Get the chat element

    var newParentElement = $('.sheet-only-container'); // Get the new parent

    if (chatElement.length && newParentElement.length) {
        // Create a new div and wrap the chat element inside it
        chatElement.wrap('<div id="chat-wrapper"></div>');

        // Get the wrapper we just created along with its child
        var chatElementWrapper = $('#chat-wrapper');
        chatElementWrapper.addClass("sheet-only-chat");
        chatElementWrapper.addClass('collapse');

        chatElementWrapper.detach(); // Remove the wrapped chatElement (along with its wrapper) from the DOM
        newParentElement.append(chatElementWrapper); // Append the wrapped chatElement (with its wrapper) to the new parent
    } else {
        console.log("Could not find chat panel")
    }
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

function popupSheet(user) {
    const actor = user.character;
    currentActor = actor;

    if (actor) {
        currentSheet = actor.sheet;
        currentSheet.render(true);
        setCurrentActorTokenAsControlled();
    } else {
        console.log(`No actor for user found.`);
    }
}

// Take control of the token of this actor (for targeting)
function setCurrentActorTokenAsControlled() {
    const activeTokens = currentActor.getActiveTokens();
    if (activeTokens.length > 0) {
        activeTokens[0].control({releaseOthers: true})
    }
}

let test;
Hooks.on("drawMeasuredTemplate", async (abilityTemplate) => {

    console.log(abilityTemplate)

    if (abilityTemplate.isPreview) {
        test = abilityTemplate
        document.getElementById('board').style.display = 'block';

        // TODO only for debugging
        game.modules.get('sheet-only').api = {
            getTemplate: function () {
                return abilityTemplate;
            }
        }
    }
});

export async function doItemUse(wrapped, ...args) {
    let result = wrapped(...args);

    const item = this;
    const autoplace = item && item.hasAreaTarget && ["self"].includes(item.system.range?.units) && ["radius", "squareRadius"].includes(item.system.target.type);

    console.warn("has Target are", item.hasAreaTarget)
    console.warn("is range self",["self"].includes(item.system.range?.units))
    console.warn("is radius or square",["radius", "squareRadius"].includes(item.system.target.type))
    console.warn("",item.system.target.type)
    console.warn(item.system.range)
    console.warn(item.system.range?.units)

    console.warn(item.system.target) // eg. 20ft sphere


    console.warn(autoplace)


    // ... do things ...

    return result;
}

Hooks.on("fuck", async (data) => {
    console.warn(data)
})

window.addEventListener('keydown', function (event) {
    if (event.key === 'u') {
        test.setTransform(test.transform.position.x + 10, test.transform.position.y + 10);
    }

    if (event.key === 'i') {

        Hooks.call("midi-qol.RollComplete", test.document, {undo: false} ,game.user, );

        let document = {
            ...test.document,
            x: test.transform.position.x,
            y: test.transform.position.y
        }

        console.log(document)
        canvas?.scene?.createEmbeddedDocuments("MeasuredTemplate", [document])

        // // That actually works
        // // get the DOM element
        // let element = document.querySelector('.vtt.game');
        //
        // console.warn(element)
        // // create a right-click event
        // let clickEvent = new MouseEvent('mousedown', {
        //     bubbles: true,
        //     button: 2, // Right button
        //     cancelable: true
        // });
        //
        // // dispatch the event
        // element.dispatchEvent(clickEvent);
    }
});