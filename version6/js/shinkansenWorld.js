var shinkansen;
shinkansen = new Shinkansen();
var viewPort = 300;
shinkansen.setViewPortX (viewPort);
shinkansen.setViewPortY (viewPort);
shinkansen.setOffsetX   (viewPort / 2);
shinkansen.setOffsetY   (viewPort/3);
		
var node;
var item;

var _size			= 60;
var fracc			= 60;
var totalColumns	= 5;
var totalRows    	= 2;
var yPostion		= 0;
var rowIndex		= 0;
var columnIndex		= 0;
var indexX			= 1;
var index			= 0;
var x;
var y;
var clip3DList = [];
while (rowIndex < totalRows) {
	columnIndex = 0;
	while(columnIndex < totalColumns) {
		node	= document.getElementById("imagen" + index);
		x		= columnIndex*_size;
		y		= rowIndex*_size;
		item	= shinkansen.addNew(node, x, 0, y);
		clip3DList.push(item);
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
shinkansen.rotation = 180;

setTimeout(rotate, 500);

var index = 0;

function rotate(){
	shinkansen.rotation +=10;
	index = 0;
	showClip();
}

function drawLine (x, y, x1, y1, color){
	map.beginPath();
	map.moveTo(x, y);
	map.lineTo(x1, y1);
	map.strokeStyle = color;
	map.stroke();
}

function showClip(){
	var clip = clip3DList[index];
	index++;

	mapCanvas.width  = mapCanvas.width;
	mapCanvas.height = mapCanvas.height;
	
	shinkansen.getRenderByItem(clip);

	var debuger = shinkansen.debuger;

	drawLine(	 debuger.x
				,debuger.y
				,debuger.x1
				,debuger.y2
				,'#0000FF');

	drawLine(	 debuger.hx
				,debuger.hy
				,debuger.hx1
				,debuger.hy2
				,'#00FFFF');

	drawLine(	 debuger.mx
				,debuger.my
				,debuger.mx1
				,debuger.my2
				,'#00FFFF');

	drawLine(	 debuger.cx
				,debuger.cy
				,debuger.cx1
				,debuger.cy1
				,debuger.color);

	console.log( debuger.min + " |  " + debuger.angle + " |  " + debuger.max + 
				 " => " + debuger.rot);
	
	var callback = rotate;
	if(index < clip3DList.length){
		callback = showClip;	
	}

	setTimeout(callback, 2000);
}

function onRender(view, index, x, y, z, scale, visible) {
	view.style.display = visible ? "inline" : "none";
	view.style.left    = x + "px";
	view.style.top     = y + "px";
	view.style.width   = (scale*99) + "px";
	view.style.height  = (scale*99) + "px";
	view.style.zIndex  = index;
}

var mapCanvas = document.getElementById("cameraMap");
var map = mapCanvas.getContext("2d");
mapCanvas.width = 600;
mapCanvas.height = 200;




