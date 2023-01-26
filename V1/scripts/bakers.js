var canvasWidth=800;
var canvasHeight=500;

var kitchen=document.getElementById("canvas");

function startGame() {
    gameCanvas.start();

    player= new createKitchen(30,30,10)

}

var gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
    this.canvas.width=canvasWidth;
    this.canvas.height=canvasHeight;
    this.context = this.canvas.getContext("2d"); 
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}