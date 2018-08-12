window.isNumber = function(number){
	var isNull   = null == number;
	var isNotN   = isNaN(number);
	var isString;
	if(!isNull){
		isString = number.length != undefined;
	}
	var isNotAnumber = isNull || isNotN  ||  isString;
	if( isNotAnumber){
		return false;
	}
	return true;
}

window.isNotNumber = function(number){
	return !isNumber(number);
}
///////////////////////////////
// CAMERA
var shinkansen = new Shinkansen();
	shinkansen.offsetX		= 250;
	shinkansen.offsetY		= 50;

	shinkansen.cameraX		= 0;
	shinkansen.cameraY		= -70;
	shinkansen.cameraZ		= 0;

	shinkansen.focalLength	= 500;

///////////////////////////////
// CONTAINER
var container = document.getElementById("world");
	container.style.position	= "relative";
	container.style.width		= "1200px";
	container.style.height		= "1200px";
	container.style.overflow	= "hidden";
	container.style.borderRight	= "solid 1px grey";
	container.style.borderLeft	= "solid 1px grey";

document.body.appendChild(container);

///////////////////////////////
// RENDER LIST
var viewList	 = [];
var tireList = [];

///////////////////////////////
// VIEW
renderView = function(xyz, render, view){
	var rx		= render.x;
	var ry		= render.y;
	var rz		= render.z;
	var visible	= render.visible;
	var index   = render.index;

	var style			= view.style; 
		style.display	= visible ? "inline" : "none";
		style.left   	= rx + "px";
		style.top    	= ry + "px";
		style.width  	= (rz*120) + "px";
		style.height 	= (rz*100) + "px";
		style.zIndex 	= index;

		style.position = "absolute";
		style.float = "left";
};

var imageList = [
					 "img/alice.png"
					,"img/arcana.png"
					,"img/aurora.png"
					,"img/fiona.png"
					,"img/jade.png"
					,"img/lenore.png"
					,"img/sophia.png"
				];

var spin = Math.PI*2/imageList.length;

for (index=0; index < imageList.length; index++){
	var img = document.createElement("img");
		img.src = imageList[index];
		
	
	container.appendChild(img);

	var xyz = {};
		xyz.x = Math.cos(spin*index)*200;
		xyz.y = -50;
		xyz.z = Math.sin(spin*index)*200;

	var view3D = shinkansen.add(xyz, img);
		viewList.push(view3D);
}

////////////////////////////////////////////////////
// CAMERA HANDLER
var velocity = 30;

var angularRotation = 0.5;
var onRender = function(){
	var length = viewList.length;
	var render;
	for(var index=0; index < length; index++){
		render = viewList[index];
		renderView(render.object2D, render.object3D, render.view);
	}
	shinkansen.rotation += angularRotation;

}

var onCameraXComplete = function(){
	var focalLength = Math.random()*500 + 50;
	var cameraX = Math.random() * 500;
	cameraState.focalLength = focalLength;
	cameraState.cameraX = cameraX;

	cameraAnimator.play(3, 3);
}
cameraState    	= {
					 cameraX:100
					,focalLength:350
				}

shinkansen.addEventListener("render", onRender);

cameraAnimator	= new Yasashiku();
cameraAnimator.add(shinkansen, cameraState);
cameraAnimator.addEventListener("complete", onCameraXComplete);
cameraAnimator.play(3, 3);
