export function increaseZoom() {
    let sheet = $('.sheet-only-sheet');
    let scaleFactor = parseFloat(sheet.css('zoom'));

    scaleFactor += 0.1;

    sheet.css({
        'zoom': scaleFactor,
        'transform-origin': 'top left',
        'width': '100vw',
        'height': '100vh'
    });
}

export function decreaseZoom() {
    let sheet = $('.sheet-only-sheet');
    let scaleFactor = parseFloat(sheet.css('zoom'));

    scaleFactor = Math.max(scaleFactor - 0.1, 0.1);

    sheet.css({
        'zoom': scaleFactor,
        'transform-origin': 'top left',
        'width': '100vw',
        'height': '100vh'
    });
}

export function resetZoom() {
    let sheet = $('.sheet-only-sheet');

    sheet.css({
        'zoom': 1,
        'transform-origin': 'top left',
        'width': '100vw',
        'height': '100vh'
    });
}