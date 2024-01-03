let scaleFactor = 1;

export function addZoomButtons(sheetContainer) {
    const uiElement = $(`<div class="button-container"></div>`);

    uiElement.load("modules/sheet-only/templates/buttons.html", function () {
        const increaseButton = uiElement.find("#increase-font");
        const decreaseButton = uiElement.find("#decrease-font");
        const resetButton = uiElement.find("#reset-font");

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
    });

    sheetContainer.append(uiElement);
}

function setZoom(sheetContainer) {
    let sheet = sheetContainer.find('.sheet-only-sheet');
    sheet.css({
        'zoom': scaleFactor,
        'transform-origin': 'top left',
        'width': '100vw'
    });
}