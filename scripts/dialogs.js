export function showPatreonDialog(titleSuffix) {
    let dialogContent = `<p>This is a Sheet-only-PLUS feature.</p> 
                <p>Please visit: <a href="https://www.patreon.com/SyriousWorkshop" target="_blank">Syrious' Workshop on Patreon</a></p>`;

    new Dialog({
        title: "Patreon Only Feature - " + titleSuffix,
        content: dialogContent,
        buttons: {
            ok: {
                icon: "<i class='fas fa-check'></i>",
                label: 'Ok'
            }
        }
    }).render(true);
}

export function wipDialog(titleSuffix, text) {
    let dialogContent = `<p>This feature is in the making</p> 
                <p>${text}</p>`;

    new Dialog({
        title: "Work in progess - " + titleSuffix,
        content: dialogContent,
        buttons: {
            ok: {
                icon: "<i class='fas fa-check'></i>",
                label: 'Ok'
            }
        }
    }).render(true);
}

export function enableCanvas() {
    let dialogContent = `<p>Sheet-Only is not active for you but your canvas is disabled.</p> 
                <p>Should the canvas be activated for you?</p>`;

    new Dialog({
        title: "Enable canvas?",
        content: dialogContent,
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: 'Yes',
                callback: () => {
                    game.settings.set("core", "noCanvas", false);
                    foundry.utils.debouncedReload();
                }
            },
            no: {
                icon: "<i class='fas fa-xmark'></i>",
                label: 'No'
            }
        }
    }).render(true);
}