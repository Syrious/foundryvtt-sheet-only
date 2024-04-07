export function hideCanvas(){
    checkDnd5e()
}

function checkDnd5e() {
    if(game.system ==='dnd5e' || document.getElementById('board')){
        // Hide the canvas
        document.getElementById('board').style.display = 'none';
    }
}
