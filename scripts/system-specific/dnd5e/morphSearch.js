import {actorStorage} from "../../actorStorage.js";
import {
    allMorphRequirementsMet,
    quickInsertActive,
    spotlightOmnisearchActive
} from "../../compatibility.js";
import {wasDragged} from "../../drag.js";
import {getSocket} from "../../socketlib.js";

export function displayMorphSearchButton() {
    if (!allMorphRequirementsMet()) {
        return;
    }

    const morphSearchButton = updateMorphSearchButton();

    morphSearchButton.on('click', function () {

        if (wasDragged()) return;

        if (actorIsMorphed()) {
            actorToOriginal();
        } else {
            performActorSearch();
        }
    });
}


export function updateMorphSearchButton() {
    const morphSearchButton = $('#so-morph-search');

    const morphIsEnabled = game.settings.get('sheet-only', 'morph-on-mobile');

    if (!allMorphRequirementsMet() || !morphIsEnabled) {
        morphSearchButton.hide();
        return morphSearchButton;
    }

    const isMorphed = actorIsMorphed();
    const unmorphFontawesome = $('#so-morph-search .fa-ban');
    if (isMorphed) {
        unmorphFontawesome.show();
    } else {
        unmorphFontawesome.hide();
    }

    morphSearchButton.show();
    return morphSearchButton;
}

export async function transformInto(actorId, targetActorData, settings) {
    const actor = game.actors.get(actorId);

    const cls = getDocumentClass("Actor");
    const targetActor = await cls.fromDropData(targetActorData);

    return await actor?.transformInto(targetActor, settings, {renderSheet: false});
}

export async function revertOriginalForm(tokenId) {
    const actor = await fromUuid(tokenId)
    actor?.revertOriginalForm();
}

function actorIsMorphed() {
    return (actorStorage.current?.getFlag('dnd5e', 'previousActorIds') ?? []).length > 0;
}

async function actorToOriginal() {
    const id = actorStorage.current.uuid;

    await getSocket()?.executeAsGM("revertOriginalForm", id);
}

async function performActorSearch() {
    const spotlightSuccess = await performSpotlightSearch();
    if (spotlightSuccess) {
        return;
    }

    performQuickInsertSearch();
}

async function performSpotlightSearch() {
    if (!spotlightOmnisearchActive()) {
        return false;
    }

    const shape = await CONFIG.SpotlightOmniseach.prompt({query: "!actor "});
    const shapeUuid = shape?.data?.uuid;

    if (!shapeUuid) {
        return false;
    }

    await openMorphDialog({uuid: shapeUuid});
    return true;
}

function performQuickInsertSearch() {
    if (!quickInsertActive()) {
        return;
    }

    QuickInsert.open({
        classes: ['sheet-only-mobile-morph'],
        allowMultiple: false,     // Unless set to `false`, the user can submit multiple times using the shift key
        restrictTypes: ["Actor"], // Restrict the output to these document types only
        mode: 1, // 1 aka "Insert"
        onSubmit: async (item) => {
            await openMorphDialog(item.dragData);
        }
    });
}

async function openMorphDialog(data) {
    const actor = actorStorage.current;

    /* 
        Copied from https://github.com/foundryvtt/dnd5e/blob/5e0edf959a4c0ac62ee7cb5afb4b0233df7ead5b/module/applications/actor/base-sheet.mjs#L843
        Sadly the dialog is not in its own function then it could have been less copied code.
    */
    const canPolymorph = game.user.isGM || (actor.isOwner && game.settings.get("dnd5e", "allowPolymorphing"));
    if (!canPolymorph) return false;

    // Get the target actor
    const cls = getDocumentClass("Actor");
    const sourceActor = await cls.fromDropData(data);
    if (!sourceActor) return;

    // Define a function to record polymorph settings for future use
    const rememberOptions = html => {
        const options = {};
        html.find("input").each((i, el) => {
            options[el.name] = el.checked;
        });
        const settings = foundry.utils.mergeObject(game.settings.get("dnd5e", "polymorphSettings") ?? {}, options);
        game.settings.set("dnd5e", "polymorphSettings", settings);
        return settings;
    };

    // Create and render the Dialog
    return new Dialog({
        title: game.i18n.localize("DND5E.PolymorphPromptTitle"),
        content: {
            options: game.settings.get("dnd5e", "polymorphSettings"),
            settings: CONFIG.DND5E.polymorphSettings,
            effectSettings: CONFIG.DND5E.polymorphEffectSettings,
            isToken: actor.isToken
        },
        default: "accept",
        buttons: {
            accept: {
                icon: '<i class="fas fa-check"></i>',
                label: game.i18n.localize("DND5E.PolymorphAcceptSettings"),
                callback: html => getSocket()?.executeAsGM("transformInto", actor.id, data, rememberOptions(html))
            },
            wildshape: {
                icon: CONFIG.DND5E.transformationPresets.wildshape.icon,
                label: CONFIG.DND5E.transformationPresets.wildshape.label,
                callback: html => getSocket()?.executeAsGM("transformInto", actor.id, data, foundry.utils.mergeObject(
                    CONFIG.DND5E.transformationPresets.wildshape.options,
                    {transformTokens: rememberOptions(html).transformTokens}
                ))
            },
            polymorph: {
                icon: CONFIG.DND5E.transformationPresets.polymorph.icon,
                label: CONFIG.DND5E.transformationPresets.polymorph.label,
                callback: html => getSocket()?.executeAsGM("transformInto", actor.id, data, foundry.utils.mergeObject(
                    CONFIG.DND5E.transformationPresets.polymorph.options,
                    {transformTokens: rememberOptions(html).transformTokens}
                ))
            },
            self: {
                icon: CONFIG.DND5E.transformationPresets.polymorphSelf.icon,
                label: CONFIG.DND5E.transformationPresets.polymorphSelf.label,
                callback: html => getSocket()?.executeAsGM("transformInto", actor.id, data, foundry.utils.mergeObject(
                    CONFIG.DND5E.transformationPresets.polymorphSelf.options,
                    {transformTokens: rememberOptions(html).transformTokens}
                ))
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("Cancel")
            }
        }
    }, {
        classes: ["dialog", "dnd5e", "polymorph"],
        width: 900,
        template: "systems/dnd5e/templates/apps/polymorph-prompt.hbs"
    }).render(true);
}