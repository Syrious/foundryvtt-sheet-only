export function dnd5eReadyHook() {
    if (!isDnd5e()) {
        return
    }

    document.body.addEventListener("click", onActivate, true);
}

export function isDnd5e() {
    return game.system.id === 'dnd5e';
}

/**
 * Moves the edit slider for the new dnd sheet from header to sheet
 */
export function dnd5eEditSlider() {
    if (!isDnd5e()) {
        return
    }

    const slider = $('.mode-slider');
    if (slider) {
        slider.css({position: 'absolute', top: '10px', left: '10px'});
        const parent = $('.sheet-only-sheet');
        parent.append(slider);
    }
}

/**
 * Opens a tooltip
 * @param event
 */
function onActivate(event) {
    if (event.target.hasAttribute('data-tooltip-class')) {
        game.tooltip.activate(event.target)
    }
}