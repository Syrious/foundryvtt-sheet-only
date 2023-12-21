function i18n(key) {
   return game.i18n.localize(key)
}

Hooks.on('init', () => {
    let moduleId = "sheet-only";

    game.settings.registerMenu(moduleId, "settingsMenu", {
        name: "Users",
        label: "Select",
        hint: "Choose users who only have access to their sheet",
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