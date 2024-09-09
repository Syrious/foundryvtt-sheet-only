import {actorStorage} from "./actorStorage.js";
import {
    quickInsertActive,
    searchEngineAvailable,
    spotlightOmnisearchActive
} from "./compatibility.js";
import {wasDragged} from "./drag.js";
import {getSocket} from "./socketlib.js";

export function displayMorphSearchButton() {
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

    if (searchEngineAvailable() && game.settings.get('sheet-only', 'morph-on-mobile')) {
        morphSearchButton.show();
    } else {
        morphSearchButton.hide();
    }

    const isMorphed = actorIsMorphed();
    const morphFontawesome = $('#so-morph-search .fa-pastafarianism');
    const unmorphFontawesome = $('#so-morph-search .fa-ban');
    if (isMorphed) {
        morphFontawesome.addClass('fa-stack-1x');
        morphFontawesome.removeClass('fa-stack-2x');
        unmorphFontawesome.show();
    } else {
        morphFontawesome.addClass('fa-stack-2x');
        morphFontawesome.removeClass('fa-stack-1x');
        unmorphFontawesome.hide();
    }

    return morphSearchButton;
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

    await callOnDropActor({uuid: shapeUuid});
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
            await callOnDropActor(item.dragData);
        }
    });
}

async function callOnDropActor(data) {
    await actorStorage.current?.sheet._onDropActor(undefined, data);
}