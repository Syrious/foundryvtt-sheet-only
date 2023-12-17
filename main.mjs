

Hooks.once('ready', async function () {
    if(!game.user.isGM){
        console.log("Sheet-Only Ready")
        hideCanvas();
        popupSheet(getUser());
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

/**
 * Opens the sheet of the user's actor
 */
function popupSheet(user) {
    const actor = user.character;

    if (actor) {
        let sheet = actor.sheet;

        sheet.render(true, {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            classes:[
                ...sheet.options.classes,
                "sheet-only"
            ]
        });




    } else {
        console.log(`No actor for user found.`);
    }

}