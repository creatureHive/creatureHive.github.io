
function startGame() {
    gameCanvas.start();
}

var gameCanvas = {
canvas: document.createElement("canvas"),
start: function() {
this.context = this.canvas.getContext("2d"); 
document.body.insertBefore(this.canvas, document.body.childNodes[0]);
}
}