var canvas 		  = document.getElementById("map");
	canvas.width  = 600;
	canvas.height = 150;

var canvate = new Canvate(canvas);
//var cameraIcon = canvate.addNewByURL("img/camera.png");

var rate = .5;

function addToCanvate(node){
	var img = canvate.addNew(node);
		img.setScale(rate/5, rate/5);
		img.x = x*rate;
		img.y = y*rate;
}

var shinkansen;
	shinkansen = new Shinkansen();
	shinkansen.setViewPortX (200);
	shinkansen.setViewPortY (200);
	shinkansen.setOffsetX   (200 / 2);
	shinkansen.setOffsetY   (200 / 2);

var node;
var item;
	
var _size			= 120;
var fracc			= 120;
var totalColumns	= 5;
var totalRows    	= 2;
var yPostion		= 0;
var rowIndex		= 0;
var columnIndex		= 0;
var indexX			= 1;
var index			= 0;
var x;
var y;
while (rowIndex < totalRows) {
	columnIndex = 0;
	while(columnIndex < totalColumns) {
		node	= document.getElementById("imagen" + index);
		x		= columnIndex*_size;
		y		= rowIndex*_size;
		item	= shinkansen.addNew(node, x, 0, y);
		
		addToCanvate(node);

		index++
		columnIndex ++;
	}
	rowIndex++;
}

shinkansen.cameraX = 570;
shinkansen.cameraY = 0;
shinkansen.cameraZ = 15;

var camera = 570;

shinkansen.addCallback(onRender);
shinkansen.rotation = 90;

setInterval(function(){
	shinkansen.cameraX = camera;
	camera -= 1;
}, 30);

function onRender(view, index, x, y, z, scale, visible) {
	view.style.display = visible ? "inline" : "none";
	view.style.left    = x + "px";
	view.style.top     = y + "px";
	view.style.width   = (scale*99) + "px";
	view.style.height  = (scale*99) + "px";
	view.style.zIndex  = index;
}