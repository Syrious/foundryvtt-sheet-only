let selectedElement = null;
let xOffset = 0;
let yOffset = 0;
let initialX, initialY;
let hasMoved = false;
let threshold = 10; // set the amount of movement to initiate dragging.

export function initDragListener(){
    document.addEventListener('mousedown', dragStart, false);
    document.addEventListener('touchstart', dragStart, false);

    document.addEventListener('mousemove', dragMove, false);
    document.addEventListener('touchmove', dragMove, false);

    document.addEventListener('mouseup', checkDrag, false);
    document.addEventListener('touchend', checkDrag, false);

  //  document.getElementById('mydiv').addEventListener('click', toggleColor, false);
}

function dragStart(event) {
    let container = findAncestor(event.target, '.so-button-container');
    console.log(container)
    if(container) {
        console.log("Start Dragging")
        event.preventDefault();
        selectedElement = container;
        let rect = selectedElement.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        xOffset = (event.clientX || event.touches[0].clientX) - initialX;
        yOffset = (event.clientY || event.touches[0].clientY) - initialY;
        hasMoved = false;
    }
}

function findAncestor (el, sel) {
    while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
    return el;
}

function dragMove(event) {
    if(selectedElement) {
        console.log("Moving")
        let xPosition = (event.clientX || event.touches[0].clientX) - xOffset;
        let yPosition = (event.clientY || event.touches[0].clientY) - yOffset;
        if (Math.abs(initialX - xPosition) > threshold || Math.abs(initialY - yPosition) > threshold) {
            selectedElement.style.left = `${xPosition}px`;
            selectedElement.style.top = `${yPosition}px`;
            hasMoved = true;
        }
    }
}

function checkDrag() {
    selectedElement = null;
}

function toggleColor(event) {
    if (!hasMoved) {
        event.target.style.backgroundColor = event.target.style.backgroundColor === 'rgb(0, 128, 0)' ? '#f00' : '#008000';
    }
}