var shinkansen;
shinkansen = new Shinkansen();
		
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
/*
while (rowIndex < totalRows) {
	columnIndex = 0;
	while(columnIndex < totalColumns) {
		node	= document.getElementById("imagen" + index);
		x		= columnIndex*_size;
		y		= rowIndex*_size;
		item	= shinkansen.add(node, x, 0, y, onRender, this);
		clip3DList.push(item);
		index++
		columnIndex ++;
	}
	rowIndex++;
}
*/
node	= document.getElementById("imagen" + 6);
x		= 200;
y		= 70;
item	= shinkansen.add(node, x, 0, y, onRender, this);
clip3DList.push(item);

function drawLine (x, y, x1, y1, color){
	map.beginPath();
	map.moveTo(x, y);
	map.lineTo(x1, y1);
	map.strokeStyle = color;
	map.stroke();
}

function onRender(clip) {
    var view    = clip.view;
    var x       = clip.x;
    var y       = clip.y;
    var scale   = clip.scale;
    var visible = clip.visible;
	var index   = clip.depth;
	
	var li = document.getElementById(view.id+"D");
	var item = "<p>"+x+"</p><p>"+y+"</p><p>"+scale+"</p><p>"+visible+"</p><p>"+index+"</p>";
	li.innerHTML = item;
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