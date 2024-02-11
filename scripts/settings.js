import {i18n} from "./utils.js";

Hooks.on('init', () => {
    let moduleId = "sheet-only";

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
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });

    game.settings.register(moduleId, "disable-canvas", {
        name: i18n("Sheet-Only.disable-canvas.name"),
        hint: i18n("Sheet-Only.disable-canvas.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: true
    });

    game.settings.register(moduleId, "playerdata", {
        scope: "world",
        config: false,
        default: {},
        type: Object,
    });
})

class PlayerSelectionMenu extends FormApplication {
    constructor(options = {}) {
        super(options);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "sheet-only",
            title: "Sheet-Only",
            template: "./modules/sheet-only/templates/controller.html",
            width: 400,
            height: "auto",
            popOut: true
        });
    }

    getData(options) {
        let playerdata = game.settings.get("sheet-only", 'playerdata');

        let players = game.users.filter(u => !u.isGM)
            .map(u => {
                let data = playerdata[u.id] || {};
                return mergeObject({
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
            data.screenwidth = $('.screenwidth', this).val();

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