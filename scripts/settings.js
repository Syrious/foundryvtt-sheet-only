import {i18n} from "./utils.js";
import {allMorphRequirementsMet, realDiceActive} from "./compatibility.js";
import {updateChatFullscreen} from "./chat.js";
import {updateMorphSearchButton} from "./system-specific/dnd5e/morphSearch.js";
import {isDnd5e} from "./system-specific/dnd5e/dnd5e.js";

export const moduleId = "sheet-only";

Hooks.on('init', () => {
    game.settings.registerMenu(moduleId, "settingsMenu", {
        name: i18n("Sheet-Only.settingsMenu.name"),
        label: i18n("Sheet-Only.settingsMenu.label"),
        hint: i18n("Sheet-Only.settingsMenu.hint"),
        icon: "fas fa-users",
        type: PlayerSelectionMenu,
        restricted: true
    });

    game.settings.register(moduleId, "display-notifications", {
        name: i18n("Sheet-Only.display-notifications.name"),
        hint: i18n("Sheet-Only.display-notifications.hint"),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });

    game.settings.register(moduleId, "chat-fullscreen", {
        name: i18n("Sheet-Only.chat-full-width.name"),
        hint: i18n("Sheet-Only.chat-full-width.hint"),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: false,
        onChange: value => {
            updateChatFullscreen(value)
        }
    });

    game.settings.register(moduleId, "open-chat-on-item-use", {
        name: i18n("Sheet-Only.open-chat-on-item-use.name"),
        hint: i18n("Sheet-Only.open-chat-on-item-use.hint"),
        scope: "client",
        config: isDnd5e(),
        default: true,
        type: Boolean,
        requiresReload: false
    });

    game.settings.register(moduleId, "canvas-option", {
        name: i18n("Sheet-Only.canvas-option.name"),
        hint: i18n("Sheet-Only.canvas-option.hint"),
        scope: "client",
        config: true,
        type: String,
        choices: {
            "No-Control": "No Control",
            "Hidden": "Hide",
            "Disabled": "Disable"
        },
        default: "Disabled",
        requiresReload: true
    });

    game.settings.register(moduleId, "real-dice", {
        name: i18n("Sheet-Only.real-dice.name"),
        hint: i18n("Sheet-Only.real-dice.hint"),
        scope: "client",
        config: realDiceActive(),
        default: false,
        type: Boolean,
        requiresReload: false,
        onChange: value => {
            game.settings.set("real-dice", "manualRollMode", value)
        }
    });

    game.settings.register(moduleId, "morph-on-mobile", {
        name: i18n("Sheet-Only.morph-on-mobile.name"),
        hint: i18n("Sheet-Only.morph-on-mobile.hint"),
        scope: "world",
        config: allMorphRequirementsMet(),
        type: Boolean,
        default: false,
        requiresReload: false,
        onChange: value => {
            updateMorphSearchButton();
        }
    });

    game.settings.register(moduleId, "dragDuration", {
        name: i18n("Sheet-Only.drag.name"),
        hint: i18n("Sheet-Only.drag.hint"),
        scope: "client",
        config: true,
        type: Number,
        requiresReload: true,
        default: 500,
    });

    game.settings.register(moduleId, "lastActorId", {
        scope: "client",
        config: false,
        type: String,
        default: "",
    });

    game.settings.register(moduleId, "neverAskCanvas", {
        scope: "client",
        config: false,
        type: Boolean,
        default: false,
    });

    game.settings.register(moduleId, "playerdata", {
        scope: "world",
        config: false,
        default: {},
        type: Object,
    });

    game.settings.register(moduleId, "show-bottom-bar", {
        name: i18n("Sheet-Only.show-bottom-bar.name"),
        hint: i18n("Sheet-Only.show-bottom-bar.hint"),
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: true
    });

    volumeSettings(moduleId);
})

function volumeSettings() {
    game.settings.register(moduleId, "volume_playlist", {
        name: i18n("Sheet-Only.volume.playlist.name"),
        scope: "client",
        config: true,
        range: {min: 0, max: 1.0, step: .1},
        type: Number,
        default: 0.8,
        onChange: value => {
            game.settings.set("core", "globalPlaylistVolume", value)
        }
    });

    game.settings.register(moduleId, "volume_ambience", {
        name: i18n("Sheet-Only.volume.ambience.name"),
        scope: "client",
        config: true,
        range: {min: 0, max: 1.0, step: .1},
        type: Number,
        default: 0.8,
        onChange: value => {
            game.settings.set("core", "globalAmbientVolume", value)
        }
    });

    game.settings.register(moduleId, "volume_interface", {
        name: i18n("Sheet-Only.volume.interface.name"),
        scope: "client",
        config: true,
        range: {min: 0, max: 1.0, step: .1},
        type: Number,
        default: 0.8,
        onChange: value => {
            game.settings.set("core", "globalInterfaceVolume", value)
        }
    });
}

class PlayerSelectionMenu extends FormApplication {
    constructor(options = {}) {
        super(options);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "sheet-only",
            title: "Sheet-Only",
            template: "./modules/sheet-only/templates/controller.html",
            width: 500,
            height: "auto",
            popOut: true
        });
    }

    getData(options) {
        let playerdata = game.settings.get("sheet-only", 'playerdata');

        let players = game.users.filter(u => !u.isGM)
            .map(u => {
                let data = playerdata[u.id] || {};
                return foundry.utils.mergeObject({
                    id: u.id,
                    name: u.name,
                    img: u.avatar,
                    display: false,
                    mobile: false,
                    screenwidth: 0,
                    mirror: false,
                    selection: false
                }, data);
            });

        return {
            players: players
        };
    }

    saveData() {
        let playerdata = game.settings.get("sheet-only", 'playerdata');

        $('.item-list .item', this.element).each(function () {
            let id = this.dataset.itemId;
            let data = playerdata[id] || {};

            data.display = $('.display', this).is(':checked');
            data.mobile = $('.mobile', this).is(':checked');
            data.screenwidth = $('.screenwidth', this).val() || 0;

            playerdata[id] = data;
        });

        game.settings.set('sheet-only', 'playerdata', playerdata);

        this.close();
    }

    activateListeners(html) {
        super.activateListeners(html);
        var that = this;

        $('.dialog-buttons.save', html).click($.proxy(this.saveData, this));
    };


}
