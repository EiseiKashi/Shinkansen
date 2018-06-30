
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
}

function ShinkansenWorld (totalColumns, totalRows, size){

	var addToShinkasen = function(node, x, y, z){
		shinkansen.addNew(node, x, y, z);
	}

	var onRender = function(view, index, x, y, z, scale, visible) {
		view.style.display = visible ? "inline" : "none";
		view.style.left    = x + "px";
		view.style.top     = y + "px";
		view.style.width   = (scale*_size) + "px";
		view.style.height  = (scale*_size) + "px";
		view.style.zIndex  = index;
	}

	var display = function(totalColumns, totalRows, size){
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
				
				addToShinkasen(node, x, 0, y);
	
				index++
				columnIndex ++;
			}
			rowIndex++;
		}
	}

	shinkansen = new Shinkansen();
	shinkansen.setViewPortX (600);
	shinkansen.setViewPortY (600);
	shinkansen.setOffsetX   (600 / 2);
	shinkansen.setOffsetY   (600 / 2);
	shinkansen.addCallback(onRender);

	//display(totalColumns, totalRows, size);
}

var _size = 60;
var totalColumns = 5;
var totalRows = 2;

var cameraIcon;
var shinkansen;

var canvateWorld = new CanvateWorld (totalColumns, totalRows, _size);
//var shinkansenWorld = new ShinkansenWorld (totalColumns, totalRows, _size);

function onDraging(){
	if(shinkansen){
		shinkansen.cameraX = cameraIcon.x;
		shinkansen.cameraZ = cameraIcon.y;
	}
};

if(cameraIcon){
	cameraIcon.setScale(0.1, 0.1);
	//cameraIcon.setPivot(.56, .5);
	//cameraIcon.setPosition(200, 75);
	cameraIcon.startDrag();
	cameraIcon.addEventListener("draging", onDraging);
}

if(shinkansen){
	shinkansen.cameraX = cameraIcon.x;
	shinkansen.cameraY = 0;
	shinkansen.cameraZ = cameraIcon.y;
	shinkansen.rotation = 90;
}
