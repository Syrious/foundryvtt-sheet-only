Hooks.on('setup', async()=>{
    if (isSheetOnly() && !game.settings.get("core", "noCanvas")) { 
        await game.settings.set('core','noCanvas',true)
        ui.notifications.info("Disabling your canvas and reloading Foundry");
        foundry.utils.debouncedReload();
    }
});

Hooks.once('ready', async function () {
    if (isSheetOnly()) {
        popupSheet(getUser());
        startCleanup();
    }
});

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

function getUser() {
    return game.users.get(game.userId);
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



