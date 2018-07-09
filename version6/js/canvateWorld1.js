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
	cameraIcon.setPivot(0, .5);
	cameraIcon.startDrag();
	cameraIcon.addEventListener("draging", onDraging);
}

function onKeyDown(event){
	var code = event.keyCode;
	if(38){
		shinkansen.rotation += 1;	
	}

	if(40){
		shinkansen.rotation -= 1;
	}
}

this.addEventListener("keydown", onKeyDown);

setTimeout(init, 2000);