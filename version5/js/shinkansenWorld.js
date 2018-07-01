var shinkansen;
shinkansen = new Shinkansen();
var viewPort = 300;
shinkansen.setViewPortX (viewPort);
shinkansen.setViewPortY (viewPort);
shinkansen.setOffsetX   (viewPort / 2);
shinkansen.setOffsetY   (viewPort/3);
		
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
		index++
		columnIndex ++;
	}
	rowIndex++;
}
		
shinkansen.cameraX = 60;
shinkansen.cameraY = 0;
shinkansen.cameraZ = 30;
		
var camera = 0;

shinkansen.addCallback(onRender);
shinkansen.rotation = 0;

var intervalId = setInterval(function(){
	shinkansen.rotation +=10;
	camera -= 1;
	if(camera < 0){
		camera = 570;
	}
}, 500);
	
function onRender(view, index, x, y, z, scale, visible) {
	view.style.display = visible ? "inline" : "none";
	view.style.left    = x + "px";
	view.style.top     = y + "px";
	view.style.width   = (scale*99) + "px";
	view.style.height  = (scale*99) + "px";
	view.style.zIndex  = index;



	mapCanvas.width  = mapCanvas.width;
	mapCanvas.height = mapCanvas.height;
	var x  = shinkansen.debuger.x;
	var y  = shinkansen.debuger.y;
	var x1 = shinkansen.debuger.x1;
	var y1 = shinkansen.debuger.y2;
	map.beginPath();
	map.moveTo(x, y);
	map.lineTo(x1, y1);
	map.strokeStyle = '#0000FF';
	map.stroke();

	var x  = shinkansen.debuger.hx;
	var y  = shinkansen.debuger.hy;
	var x1 = shinkansen.debuger.hx1;
	var y1 = shinkansen.debuger.hy2;
	map.beginPath();
	map.moveTo(x, y);
	map.lineTo(x1, y1);
	map.strokeStyle = '#FF0000';
	map.stroke();

	var x  = shinkansen.debuger.mx;
	var y  = shinkansen.debuger.my;
	var x1 = shinkansen.debuger.mx1;
	var y1 = shinkansen.debuger.my2;
	map.beginPath();
	map.moveTo(x, y);
	map.lineTo(x1, y1);
	map.strokeStyle = '#00FF00';
	map.stroke();
}

var mapCanvas = document.getElementById("cameraMap");
var map = mapCanvas.getContext("2d");
mapCanvas.width = 600;
mapCanvas.height = 200;




