let scaleFactor = 1;

export function addControlButtons(sheetContainer) {
    const uiElement = $(`<div class="button-container"></div>`);

    uiElement.load("modules/sheet-only/templates/buttons.html", function () {
        const collapseButton = uiElement.find("#collapse-actor-select")
        const increaseButton = uiElement.find("#increase-font");
        const decreaseButton = uiElement.find("#decrease-font");
        const resetButton    = uiElement.find("#reset-font");
        const logoutButton   = uiElement.find("#so-log-out");

        collapseButton.on("click", function () {
            $('#collapse-actor-select i').toggleClass('hidden');
            $('.sheet-only-actor-list').toggleClass('collapse');
            if($('.sheet-only-actor-list.collapse')){
                localStorage.setItem("collapsed-actor-select", "true");
            } else{
                localStorage.setItem("collapsed-actor-select", "false");
            }
        });
        increaseButton.on("click", function () {
            scaleFactor += 0.1;
            setZoom(sheetContainer);
        });
        decreaseButton.on("click", function () {
            scaleFactor = Math.max(scaleFactor - 0.1, 0.1);
            setZoom(sheetContainer);
        });

        resetButton.on("click", function () {
            scaleFactor = 1;
            setZoom(sheetContainer);
        });
        logoutButton.on("click", function(){
            ui.menu.items.logout.onClick();
        })
    });
    sheetContainer.append(uiElement);

    if(localStorage.getItem("collapsed-actor-select") === 'true'){
        $('#collapse-actor-select i').toggleClass('hidden');
        $('.sheet-only-actor-list').toggleClass('collapse');
    }

}

function setZoom(sheetContainer) {
    let sheet = sheetContainer.find('.sheet-only-sheet');
    sheet.css({
        'zoom': scaleFactor,
        'transform-origin': 'top left',
        'width': '100vw',
        'height': '100vh'
    });
}