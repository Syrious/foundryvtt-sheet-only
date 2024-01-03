export function addFontSizeButtons(sheetContainer) {
    const defaultFontSize = game.settings.settings.get('core.fontSize').default;
    const max = game.settings.settings.get('core.fontSize').range.max;
    const min = game.settings.settings.get('core.fontSize').range.min;

    const uiElement = $(`<div class="button-container"></div>`);

    uiElement.load("modules/sheet-only/templates/buttons.html", function () {
        const increaseButton = uiElement.find("#increase-font");
        const decreaseButton = uiElement.find("#decrease-font");
        const resetButton = uiElement.find("#reset-font");

        increaseButton.on("click", function () {
            changeFontSize(1);
        });

        decreaseButton.on("click", function () {
            changeFontSize(-1);
        });

        resetButton.on("click", function () {
            game.settings.set("core", "fontSize", defaultFontSize)
        });

        // Non-persisting but smaller steps
        function changeFontSizeAlternative(delta) {
            var htmlElement = $('html');
            var fontSizeValue = htmlElement.css('font-size');
            var fontSizeWithoutUnit = parseInt(fontSizeValue, 10);

            htmlElement.css('font-size', `${fontSizeWithoutUnit + delta}px`);
        }

        function changeFontSize(delta) {
            const currentFontSize = game.settings.get("core", "fontSize");
            let newFontSize = currentFontSize + delta;


            if (newFontSize > max) {
                newFontSize = max;
            } else {
                if (newFontSize < min) {
                    newFontSize = min;
                }
            }

            game.settings.set("core", "fontSize", newFontSize)
        }
    });

    sheetContainer.append(uiElement);
}