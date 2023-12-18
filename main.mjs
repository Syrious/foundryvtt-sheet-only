function isSheetOnly() {
    let playerdata = game.settings.get("sheet-only", 'playerdata');
    let user = getUser();

    return playerdata[user.id] && playerdata[user.id].display;
}

function startCleanup() {
    setInterval(() => {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(child => {

            const styles = window.getComputedStyle(child);
            if (styles.getPropertyValue('display') === 'none') {
                          child.remove();
            }
        });
    }, 30000);
}

Hooks.once('ready', async function () {
    console.log("Sheet-Only Ready")

    if (isSheetOnly()) {
        hideCanvas();
        popupSheet(getUser());
        startCleanup();
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



