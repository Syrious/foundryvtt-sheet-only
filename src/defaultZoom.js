export function increaseZoom() {
    let sheet = $('.sheet-only-sheet');
    let scaleFactor = parseFloat(sheet.css('--zoom-level')) || 1;

    scaleFactor += 0.1;

    sheet.css({ '--zoom-level': scaleFactor });
}

export function decreaseZoom() {
    let sheet = $('.sheet-only-sheet');
    let scaleFactor = parseFloat(sheet.css('--zoom-level')) || 1;

    scaleFactor = Math.max(scaleFactor - 0.1, 0.1);

    sheet.css({ '--zoom-level': scaleFactor });
}

export function resetZoom() {
    let sheet = $('.sheet-only-sheet');

    sheet.css({ '--zoom-level': 1 });
}
