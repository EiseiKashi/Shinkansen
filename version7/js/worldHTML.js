///////////////////////////////
// CAMERA
var shinkansen = new Shinkansen();
	shinkansen.offsetX		= 150;
	shinkansen.offsetY		= 150;

	shinkansen.cameraX		= 0;
	shinkansen.cameraY		= 40;
	shinkansen.cameraZ		= 0;

	shinkansen.focalLength	= 500;

///////////////////////////////
// CONTAINER
var container = document.createElement("section");
	container.style.position = "relative";
	container.style.width = "300px";
	container.style.height = "300px";
	container.style.overflow = "hidden";

document.body.appendChild(container);

///////////////////////////////
// RENDER LIST
var carList	 = [];
var tireList = [];

///////////////////////////////
// CARS
var carSize = 20;
renderCar = function(xyz, render, view){
	
	//view.visible = render.visible;
	
	var rx		= render.x;
	var ry		= render.y;
	var rz		= render.z;
	var visible	= render.visible;
	var index   = render.index;

	var style			= view.style; 
		style.display	= "inline";
		style.left   	= rx + "px";
		style.top    	= ry + "px";
		style.width  	= (rz*99) + "px";
		style.height 	= (rz*99) + "px";
		style.zIndex 	= index;
};
/*
////////////////////////////////
// TIRES
renderTire = function(xyz, render, view){
	view.visible = render.visible;
	var rx		= render.x;
	var ry		= render.y;
	var rz		= render.z;
	var visible	= render.visible;
	
	if (rz < 0){
		xyz.z += 3000;
	}
	view.x		 = rx;
	view.y		 = ry;
	view.setScale(rz, rz);
	view.setDepth(view, render.index);
	view.visible = visible;
};

// TIRES
for (index=0; index<20; index++){
	var tire = world.addNewByURL("img/tire.jpg");
	
	var xyz = {};
	if (index < 10){
		xyz.x = -250;
		xyz.z = index*300;
	}else{
		xyz.x = 250;
		xyz.z = 150 + (index-10)*300;
	}
	
	xyz.y = 0;
	
	var tire3D = shinkansen.add(xyz, tire);
		tireList.push(tire3D);
}


*/
var spin = Math.PI*2/5;
// CARS
for (index=0; index<5; index++){
	var img = document.createElement("img");
		img.src = "img/fuji_go_ko.jpg";
		img.style.width = "30px";
		img.style.height = "30px";
		img.style.display = "inline"
		img.style.position = "absolute";
		img.style.float = "left";
	
	container.appendChild(img);

	var xyz = {};
		xyz.x = Math.cos(spin*index)*200;
		xyz.y = -50;
		xyz.z = Math.sin(spin*index)*200;

	var car3D = shinkansen.add(xyz, img);
		carList.push(car3D);
}

///////////////////////////////
// User Handler
var isUp	= false;
var isDown	= false;
var isLeft	= false;
var isRight	= false;

function onDownDown (event){
	isDown = true;
}
function onDownUp (event){
	isDown = false;
}

function onUpDown(event){
	isUp = true;
}
function onUpUp(event){
	isUp = false;
}

function onLeftDown(event){
	isLeft	= true;
}
function onLeftUp(event){
	isLeft	= false;
}

function onRightDown(event){
	isRight	= true;
}
function onRightUp(event){
	isRight	= false;
}

var keyHandler = new KeyHandler(document);

	keyHandler.onDown("down", onDownDown);
	keyHandler.onUp("down", onDownUp);

	keyHandler.onDown("up", onUpDown);
	keyHandler.onUp("up", onUpUp);

	keyHandler.onDown("left", onLeftDown);
	keyHandler.onUp("left", onLeftUp);

	keyHandler.onDown("right", onRightDown);
	keyHandler.onUp("right", onRightUp);

////////////////////////////////////////////////////
// CAMERA HANDLER
var velocity = 30;
function checkKeys(){
	if (isUp){
	}

	if (isDown){
	}

	if (isLeft){
	}
	
	if (isRight) {
	}

	//shinkansen.cameraZ += velocity;
};

shinkansen.addEventListener("render", function(){
	checkKeys();/*
	var length = tireList.length;
	var render;
	for(var index=0; index < length; index++){
		render = tireList[index];
		renderTire(render.object2D, render.object3D, render.view);
	}*/
	var length = carList.length;
	var render;
	for(var index=0; index < length; index++){
		render = carList[index];
		renderCar(render.object2D, render.object3D, render.view);
	}
	shinkansen.rotation += 0.5;
});

var section = document.createElement("section");
	section.style.color = "white";
	var x = document.createElement("h3");
	var y = document.createElement("h3");
document.body.appendChild(section);
section.appendChild(x);
section.appendChild(y);

this.onmousemove = function(event){/*
	x.innerHTML = "x: " + event.clientX;
	y.innerHTML = "y: " + event.clientY;
	shinkansen.rotation = (event.clientX/300)*360;
	shinkansen.vertRotation = (event.offsetY/300)*360;*/
}