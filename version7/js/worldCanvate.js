///////////////////////////////
// CAMERA
var shinkansen = new Shinkansen();
	shinkansen.offsetX		= 150;
	shinkansen.offsetY		= 150;

	shinkansen.cameraX		= 0;
	shinkansen.cameraY		= -100;
	shinkansen.cameraZ		= 0;

	shinkansen.focalLength	= 300;

///////////////////////////////
// CONTAINER
var canvas			= document.getElementById("world");
	canvas.width	= 300;
	canvas.height	= 300;

var world = new Canvate(canvas);

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
	
	if (rz < 4000){
		if (rz < 0){
			xyz.z += 3000;
			xyz.x = 200-Math.random()*400;
		}
		xyz.z += xyz.velocity;
	}

	view.style.display = visible ? "inline" : "none";
	view.style.left    = rx + "px";
	view.style.top     = ry + "px";
	view.style.width   = (rz*99) + "px";
	view.style.height  = (rz*99) + "px";
	view.style.zIndex  = index;

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
// CARS
for (index=0; index<3; index++){
	
	var car = world.addNewByURL("img/fuji_go_ko.jpg");

	var xyz = {};
		xyz.x = 200 - Math.random()*400;
		xyz.y = 0;
		xyz.z = 500+Math.random()*1000;
		xyz.velocity = 20 + index*5;

	var car3D = shinkansen.add(xyz, car);
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
var velocity = 0;
function checkKeys(){
	if (isUp){
		velocity += 2;
	}else{
		velocity *= .95;
	}

	if (isDown){
		velocity -= 2;
	}

	if (velocity < 0) {
		velocity = 0;
	}else if (velocity > 80){
		velocity = 80;
	}

	shinkansen.cameraZ += velocity;

	if (isLeft){
		shinkansen.cameraX -= velocity/5;
	}

	if (isRight) {
		shinkansen.cameraX += velocity/5;
	}

	if (shinkansen.cameraX < -200) {
		shinkansen.cameraX = -200;
	}else if (shinkansen.cameraX > 200) {
		shinkansen.cameraX = 200;
	}
};

world.addEventListener("render", function(){
	checkKeys();
	var length = tireList.length;
	var render;
	for(var index=0; index < length; index++){
		render = tireList[index];
		renderTire(render.object2D, render.object3D, render.view);
	}
	var length = carList.length;
	var render;
	for(var index=0; index < length; index++){
		render = carList[index];
		renderCar(render.object2D, render.object3D, render.view);
	}	
});