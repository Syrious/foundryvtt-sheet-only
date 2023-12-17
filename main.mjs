Hooks.once('ready', async function () {
    console.log("Sheet-Only Ready")
    let playerdata = game.settings.get("sheet-only", 'playerdata');
    let user = getUser();

    if (playerdata[user.id] && playerdata[user.id].display) {
        hideCanvas();
        popupSheet(user);
    }
});


function getUser() {
    const userId = game.userId;
    return game.users.get(userId);
}

function hideCanvas() {
    let body = $('body');
    body.toggleClass('sheet-only', true)
}

function popupSheet(user) {
    const actor = user.character;

    if (actor) {
        let sheet = actor.sheet;

        sheet.render(true, {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            classes: [
                ...sheet.options.classes,
                "sheet-only"
            ]
        });


    } else {
        console.log(`No actor for user found.`);
    }

}