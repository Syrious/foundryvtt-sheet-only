export function showPatreonDialog(titleSuffix) {
    let dialogContent = `<p>This is a Patreon-only feature.</p> 
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