var currentProperty;

function onDown (event){
	if(null == currentProperty){
		//Early return
		return;
	}
}

function onUp (event){
	if(null == currentProperty){
		//Early return
		return;
	}
}

var keyHandler = new KeyHandler(document);
	keyHandler.onDown("down", onDown);
	keyHandler.onUp("up", onUp);
	keyHandler.onDown("r", function(){currentProperty="rotation"});
	keyHandler.onDown("f", function(){currentProperty="focalLength"});
	keyHandler.onDown("x", function(){currentProperty="cameraX"});
	keyHandler.onDown("y", function(){currentProperty="cameraY"});
	keyHandler.onDown("z", function(){currentProperty="cameraZ"});
///////////////////////////////

function onRender(render){
	var view = render.data;
		//view.style.display = visible ? "inline" : "none";
		view.style.left    = render.x + "px";
		view.style.top     = render.y + "px";
		var scale = render.z;
		view.style.width   = (scale*99) + "px";
		view.style.height  = (scale*99) + "px";
		view.style.zIndex  = render.index;
}

///////////////////////////////
var dir = -1;
var speed = 20;
function onTick(){
	shinkansen.cameraZ += speed*dir;
	if (shinkansen.cameraZ > 500){
		shinkansen.cameraZ = 500;
		dir = -1;
	}else if (shinkansen.cameraZ < 0){
		shinkansen.cameraZ = 0;
		dir = 1;
	}
}

var id = setInterval(onTick, 20);

///////////////////////////////

var shinkansen = new Shinkansen();
	shinkansen.offsetX = 150;
	shinkansen.offsetY = 150;
	shinkansen.cameraZ = 500;
	shinkansen.focalLength = 300;

	var image = document.getElementById("imagen9");

	var figureA = shinkansen.add(onRender, image);
		figureA.x = 0;
		figureA.y = 0;
		figureA.z = 500;

/*
var shinkansen;
shinkansen = new Shinkansen();
var viewPort = 300;
shinkansen.setViewPortX (viewPort);
shinkansen.setViewPortY (viewPort);
shinkansen.setOffsetX   (viewPort / 2);
shinkansen.setOffsetY   (viewPort/3);
shinkansen.cameraX = 60;
shinkansen.cameraY = 0;
shinkansen.cameraZ = 30;
		
var camera = 0;

shinkansen.rotation = 0;

var intervalId = setInterval(function(){
	shinkansen.rotation +=10;
	camera -= 1;
	if(camera < 0){
		camera = 570;
	}
}, 500);

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
		item	= shinkansen.addNew(onRender, node);
		index++
		columnIndex ++;
	}
	rowIndex++;
}
		
function onRender(render) {
	var view	=
	var index	= 
	var x		= item.renderX;
	var y		= item.renderY;
	var z		= item.renderZ;
	var scale	= item.scale;
	var visible	= item.visible;

	var x
	var y
	var z
	var data
	var renderX
	var renderY
	var renderZ
	var scale
	var visible
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

///////////////////////////////////////////////////////

var mapCanvas = document.getElementById("cameraMap");
var map = mapCanvas.getContext("2d");
mapCanvas.width = 600;
mapCanvas.height = 200;

function CanvateWorld(totalColumns, totalRows, size){
	'use strict'
	var canvas;
	var canvate;

	var canvas 		  = document.getElementById("map");
		canvas.width  = 600;
		canvas.height = 150;

	canvate = new Canvate(canvas);

	var addToCanvate = function(node, x, y){
		var img = canvate.addNew(node);
			img.setSize(5, 5);
			img.setPivot(.5, .5);
			img.x = x;
			img.y = y;
	}

	function display(totalColumns, totalRows, size){
		var node;
		var item;
		var rowIndex		= 0;
		var columnIndex		= 0;
		var index			= 0;
		var x;
		var y;
		while (rowIndex < totalRows) {
			columnIndex = 0;
			while(columnIndex < totalColumns) {
				node	= document.getElementById("imagen" + index);
				x		= columnIndex*size;
				y		= rowIndex*size;
				
				addToCanvate(node, x, y);
	
				index++
				columnIndex ++;
			}
			rowIndex++;
		}
	}
	display(totalColumns, totalRows, size);
	cameraIcon = canvate.addNewByURL("img/camera.png");

	canvate.addNewById("cameraMap");
}

var _size = 60;
var totalColumns = 5;
var totalRows = 2;

function onDraging(){
	clearInterval(intervalId);
	if(shinkansen){
		shinkansen.cameraX = cameraIcon.x;
		shinkansen.cameraZ = cameraIcon.y;
	}
};

var canvateWorld;
var cameraIcon;

function init(){
	canvateWorld = new CanvateWorld (totalColumns, totalRows, _size);
	cameraIcon.setScale(0.1, 0.1);
	//cameraIcon.setPivot(.56, .5);
	//cameraIcon.setPosition(200, 75);
	cameraIcon.startDrag();
	cameraIcon.addEventListener("draging", onDraging);
}

setTimeout(init, 2000);
*/