import '../styles/style.scss'
import {onInit} from "./initHook";
import {onSetup} from "./setupHook";
import {onReady} from "./readyHook";
import {onTransformActor} from "./system-specific/dnd5e/dnd5e";
import {onRenderActorSheetV2, onRenderContainerSheet} from "./sheetHook";
import {onCreateActor, onDeleteActor} from "./actorHook";
import {onCloseUserConfig, onRenderSettingsConfig} from "./configHook";
import integrateLame from "./third-party-modules/lame";
import {onRenderJournalDirectory} from "./journal";

/* global Hooks */
// CONFIG.debug.hooks = true;
Hooks.on('init', async () => {
    onInit();
});

Hooks.on('setup', async () => {
    await onSetup();
});

Hooks.on("renderChatLog", async (_app, htmlPassed, _data_ChatInput) => {
    if (game.modules.get("lame-messenger")?.active) {
        integrateLame(htmlPassed)
    }
});


Hooks.once('ready', async function () {
    await onReady();
});

/* Wildshape, Polymorph etc */
Hooks.on('dnd5e.transformActor', async (fromActor, toActor) => {
    onTransformActor(fromActor, toActor);
});

Hooks.on('renderActorSheetV2', async (app, _sheet, {actor}) => {
    await onRenderActorSheetV2(app, _sheet, actor);
});

Hooks.on('renderActorSheet', async (app, _sheet, {actor}) => {
    await onRenderActorSheetV2(app, _sheet, actor);
});

Hooks.on('createActor', async function (actor) {
    await onCreateActor(actor);
});

Hooks.on('deleteActor', async function (actor) {
    await onDeleteActor(actor);
});

Hooks.on('renderContainerSheet', async (app, html) => {
    await onRenderContainerSheet(app, html);
});

Hooks.once('closeUserConfig', async () => {
    await onCloseUserConfig();
});

Hooks.on('renderSettingsConfig', async (app, element, settings) => {
    await onRenderSettingsConfig(app, element, settings);
})

Hooks.on('renderJournalDirectory', async (app, html, data) => {
    onRenderJournalDirectory(app, html);
});