let selectedElement = null;
let xOffset = 0;
let yOffset = 0;
let hasMoved = false;

let pressTimer;
let longPressDuration;

const scaleUpTo = 1.08;

export function initDragListener() {
    document.addEventListener('mousedown', handleStart, false);
    document.addEventListener('touchstart', handleStart, false);

    document.addEventListener('mousemove', dragMove, false);
    document.addEventListener('touchmove', dragMove, false);

    document.addEventListener('mouseup', dragEnd, false);
    document.addEventListener('touchend', dragEnd, false);

    longPressDuration = getDuration();
}

function getDuration() {
    return game.settings.get("sheet-only", "dragDuration");
}

function handleStart(event) {
    if (longPressDuration <= 0) return;

    hasMoved = false;

    let container = findAncestor(event.target, '.so-draggable');
    if (container) {
        // Initiate the press timer.
        pressTimer = window.setTimeout(() => dragStart(event, container), longPressDuration);
    }
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
    return el;
}

export function wasDragged() {
    return hasMoved;
}

function dragStart(event, container) {
    event.preventDefault();
    event.stopPropagation();

    selectedElement = container;
    selectedElement.classList.add('dragged');
    hasMoved = true;

    let { x, y } = getPosition();

    xOffset = (event.clientX || event.touches[0].clientX) - x;
    yOffset = (event.clientY || event.touches[0].clientY) - y;

    selectedElement.style.transform = `translate(${x}px, ${y}px) scale(${scaleUpTo})`;

}

function dragMove(event) {
    if (selectedElement) {
        event.stopPropagation();

        let xPosition = (event.clientX || event.touches[0].clientX) - xOffset;
        let yPosition = (event.clientY || event.touches[0].clientY) - yOffset;

        // Apply transform using translate for positional adjustments and keep the scale constant
        selectedElement.style.transform = `translate(${xPosition}px, ${yPosition}px) scale(${scaleUpTo})`;
    }
}

function dragEnd(event) {
    clearTimeout(pressTimer);

    if (selectedElement) {
        event.stopPropagation();

        let { x, y } = getPosition();

        // Reset the scale to 1.0 and maintain the final position using translate
        selectedElement.style.transform = `translate(${x}px, ${y}px) scale(1)`;

        selectedElement.classList.remove('dragged');

        applyTransformation(selectedElement);

        selectedElement = null;
    }
}

function getPosition() {
    const elementStyle = window.getComputedStyle(selectedElement);
    const transform = elementStyle.transform;
    let xPosition = 0;
    let yPosition = 0;

    if (transform && transform !== 'none') {
        const matrix = new WebKitCSSMatrix(transform);
        xPosition = matrix.m41;
        yPosition = matrix.m42;
    }

    return { x: xPosition, y: yPosition };
}

/**
 * Applies the transformation to left and top so that if foundry triggers a new render, the window won't jump
 * to its original position
 * @param element The dragged element
 */
function applyTransformation(element) {
    const computedStyle = getComputedStyle(element);

    // Extract transformation values
    const transform = computedStyle.transform;

    if (transform !== 'none') {
        // Parse the transform matrix
        const matrix = transform.match(/matrix\(([^)]+)\)/)[1].split(', ').map(parseFloat);

        // Translate values from the matrix
        const translateX = matrix[4];
        const translateY = matrix[5];

        // Calculate the new top and left positions
        const translatedLeft = parseFloat(computedStyle.left) + translateX;
        const translatedTop = parseFloat(computedStyle.top) + translateY;

        // Apply the calculated position and reset transformation
        element.style.transform = 'none';
        element.style.left =  `${translatedLeft}px`;
        element.style.top = `${translatedTop}px`;
    }
}