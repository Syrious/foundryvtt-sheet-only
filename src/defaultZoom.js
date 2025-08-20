export function increaseZoom() {
    let sheet = $('.sheet-only-sheet');
    let scaleFactor = parseFloat(sheet.css('zoom'));

    scaleFactor += 0.1;

    sheet.css({ zoom: scaleFactor });
}

export function decreaseZoom() {
    let sheet = $('.sheet-only-sheet');
    let scaleFactor = parseFloat(sheet.css('zoom'));

    scaleFactor = Math.max(scaleFactor - 0.1, 0.1);

    sheet.css({ zoom: scaleFactor });
}

export function resetZoom() {
    let sheet = $('.sheet-only-sheet');

    sheet.css({ zoom: 1 });
}