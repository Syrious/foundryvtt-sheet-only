let selectedElement = null;
let xOffset = 0;
let yOffset = 0;
let initialX, initialY;
let hasMoved = false;

let pressTimer;
let longPressDuration = 500;

export function initDragListener() {
    document.addEventListener('mousedown', handleStart, false);
    document.addEventListener('touchstart', handleStart, false);

    document.addEventListener('mousemove', dragMove, false);
    document.addEventListener('touchmove', dragMove, false);

    document.addEventListener('mouseup', dragEnd, false);
    document.addEventListener('touchend', dragEnd, false);
}

function handleStart(event) {
    hasMoved = false;

    let container = findAncestor(event.target, '.so-draggable');
    if (container) {
        // Initiate the press timer.
        pressTimer = window.setTimeout(() => dragStart(event, container), longPressDuration);
    }
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel)) ;
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

    let rect = selectedElement.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    xOffset = (event.clientX || event.touches[0].clientX) - initialX;
    yOffset = (event.clientY || event.touches[0].clientY) - initialY;
}

function dragMove(event) {
    if (selectedElement) {
        event.preventDefault();
        event.stopPropagation();

        let xPosition = (event.clientX || event.touches[0].clientX) - xOffset;
        let yPosition = (event.clientY || event.touches[0].clientY) - yOffset;

        selectedElement.style.left = `${xPosition}px`;
        selectedElement.style.top = `${yPosition}px`;
    }
}

function dragEnd(event) {
    clearTimeout(pressTimer);

    if (selectedElement) {
        event.preventDefault();
        event.stopPropagation();

        selectedElement.classList.remove('dragged');
        selectedElement = null;
    }
}