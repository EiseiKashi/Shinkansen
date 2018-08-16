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
// SETTINGS
var worldWidth		= 800;
var worldHeight		= 420;
var totalEnemies	= 7;
var shootWidth		= 185;
var shootHeight		= 90;
var enemyWidth		= 95;
var enemyHeight		= 81;

var enemySpeed		= 2;
var shootSpeed		= 10;

///////////////////////////////
// CAMERA

var shinkansen;
var initializeCamera = function(){
	shinkansen = new Shinkansen();
	shinkansen.offsetX		= worldWidth/2;
	shinkansen.offsetY		= worldHeight/2;

	shinkansen.cameraX		= 0;
	shinkansen.cameraY		= 0;
	shinkansen.cameraZ		= 600;
	
	shinkansen.focalLength	= 300;
}

///////////////////////////////
// WORLD

var container;
var initializeWorld = function(){
	container					= document.getElementById("world");
	container.style.position	= "relative";
	container.style.width		= worldWidth	+ "px";
	container.style.height		= worldHeight	+ "px";
	container.style.overflow	= "hidden";
	container.style.borderRight	= "solid 1px grey";
	container.style.borderLeft	= "solid 1px grey";
}

///////////////////////////////
// ENEMIES
var Enemy = function(){
	_self = this;
	var _xyz	= {};
	var _html;
	var _style;
	var _view;
	var _view3D;

	this.getView = function(){
		return _view;
	}
	
	this.setView3D = function(view3D){
		_view3D = view3D;
	}
	
	this.setXYZ = function(x, y, z){
		_xyz.x = x;
		_xyz.y = y;
		_xyz.z = z;
	}

	this.getXYZ = function(){
		return _xyz;
	}

	this.getHTML = function(){
		return _html;
	}
	
	var rz;
	this.render = function(){
		rz				= _view3D.z;
		
		_style.display	= _view3D.visible ? "inline" : "none";
		_style.left   	= _view3D.x + "px";
		_style.top    	= _view3D.y + "px";
		
		_self.width		= (rz*enemyWidth);
		_self.height	= (rz*enemyHeight);
		_style.width  	= _self.width + "px";
		_style.height 	= _self.height + "px";

		_style.zIndex 	= _view3D.index;

		_style.position = "absolute";
		_style.float	= "left";
		//ENEMY
		_self.x 		= _view3D.x;
		_self.y 		= _view3D.y;
		_self.z 		= Math.round(rz*100);

		_xyz.z -= enemySpeed;

		if(rz < 0){
			_xyz.z = shinkansen.cameraZ+900;
		}
	}

	var onLoadEnemy = function (event){
		_view.setCycle(0,0, _view.width/6, _view.height);
		_view.isLoop = true;
		_view.play();
	}

	var initialize = function(){
		_html			= document.createElement("canvas");
		var canvate 	= new Canvate(_html);
		_view 			= canvate.addNewByURL("img/enemy.png");
		_view.addEventListener(_view.IMAGE_LOADED, onLoadEnemy);
		_style			= _html.style;
		_style.width  	= enemyWidth	+ "px";
		_style.height 	= enemyHeight	+ "px";
	}

	initialize();
}
var enemyList;
var enemyController;
var EnemyController = function(total){
	var _self   = this;
	var index	= 0;
	enemyList	= [];
	
	this.render = function(){
		var length = enemyList.length;
		var enemy;
		for(var index=0; index < length; index++){
			enemy = enemyList[index];
			enemy.render();
			//SHOOT
			if(enemy.isRemoveMe ){
				enemyList.splice(index, 1);
				world.removeChild(enemy.getHTML());
				length--;
				index--;
				addEnemy();
			}
		}
	}

	var addEnemy = function(){
		enemy = new Enemy();

		var x = Math.random()*worldWidth-shinkansen.offsetX;
		var y = Math.random()*worldHeight - shinkansen.offsetY;
		var z = shinkansen.cameraZ+900;
		enemy.setXYZ(x, y, z);

		var view3D = shinkansen.add(enemy.getXYZ(), enemy);
		enemy.setView3D(view3D.object3D);
		
		enemyList.push(enemy);
		world.appendChild(enemy.getHTML());
		
		index++;
		
		if(index < totalEnemies){
			setTimeout(addEnemy, Math.random()*2000+500);
		}
	}

	addEnemy();
}

///////////////////////////////
// SHOOT
var Shoot = function(){
	var _self	= this;
	var _xyz	= {};
	var _speed	= .5;
	var _html;
	var _style;
	var _view;
	var _view3D;

	this.getView = function(){
		return _view;
	}
	
	this.setView3D = function(view3D){
		_view3D = view3D;
	}
	
	this.setXYZ = function(x, y, z){
		_xyz.x = x;
		_xyz.y = y;
		_xyz.z = z;
	}

	this.getXYZ = function(){
		return _xyz;
	}

	this.getHTML = function(){
		return _html;
	}

	this.isRemoveMe;

	var rz;
	this.render = function(){
		rz				= _view3D.z;
		
		_style.display	= _view3D.visible ? "inline" : "none";
		_style.left   	= _view3D.x + "px";
		_style.top    	= _view3D.y + "px";
		
		_self.width		= (rz*shootWidth);
		_self.height	= (rz*shootHeight);
		_style.width  	= _self.width + "px";
		_style.height 	= _self.height + "px";

		_style.zIndex 	= _view3D.index;

		_style.position = "absolute";
		_style.float	= "left";
		//ENEMY
		_self.x 		= _view3D.x;
		_self.y 		= _view3D.y;
		_self.z 		= Math.round(rz*100);

		_xyz.z += shootSpeed;

		if(rz < 0.07){
			this.isRemoveMe = true;
		}
	}

	var onLoad = function (event){
		_view.setCycle(0,0, _view.width/4, _view.height);
		_view.isLoop = true;
		_view.play();
	}

	var initialize = function(){
		_html			= document.createElement("canvas");
		
		var canvate 	= new Canvate(_html);
		_view 			= canvate.addNewByURL("img/shoot.png");
		_view.addEventListener(_view.IMAGE_LOADED, onLoad);
		
		_style			= _html.style;
		_style.width  	= shootWidth	+ "px";
		_style.height 	= shootHeight	+ "px";
	}

	initialize();
}

var shootController;
var shootList;
var ShootController = function(total){
	shootList		= [];
	
	this.render = function(){
		var length = shootList.length;
		var shoot;
		for(var index=0; index < length; index++){
			shoot = shootList[index];
			shoot.render();
			//SHOOT
			if(shoot.isRemoveMe ){
				shootList.splice(index, 1);
				world.removeChild(shoot.getHTML());
				length--;
				index--;
			}
		}
	}

	var addShoot = function(x, y, z){
		var shoot = new Shoot();
		shoot.setXYZ(x, y, z);
		
		var view3D = shinkansen.add(shoot.getXYZ(), shoot);
		shoot.setView3D(view3D.object3D);
		
		shootList.push(shoot);
		world.appendChild(shoot.getHTML());
		shoot.setXYZ(x, y, shinkansen.cameraZ-shinkansen.focalLength)
	}

	var world	= document.getElementById("world");
	world.onclick = function(eventshing){
		var x = event.offsetX-shinkansen.offsetX;
		var y = (event.offsetY - (worldHeight/2));
		var z = shinkansen.cameraZ;
		addShoot(x, y, z);
	}
}

////////////////////////////////////////////////////
// GAME LOOP
var onRender = function(){
	enemyController.render();
	shootController.render();
	var removeEnemy = [];
	var removeShoot = [];
	shootLength = shootList.length;
	
	if(0 < shootLength){
		for(shootIndex = 0; shootIndex < shootLength; shootIndex++){
			shoot = shootList[shootIndex];
			enemyLength = enemyList.length;
			for(enemyIndex = 0; enemyIndex < enemyLength; enemyIndex++){
				enemy = enemyList[enemyIndex];
				
				var dif = enemy.z - shoot.z; 
				if(dif < 2 && dif > 0){
					if (enemy.x < shoot.x + shoot.width &&
						enemy.x + enemy.width > shoot.x &&
						enemy.y < shoot.y + shoot.height &&
						enemy.height + enemy.y > shoot.y) {
							shoot.isRemoveMe = true;
							enemy.isRemoveMe = true;
					 }
				}
			}
		}
	}
}

////////////////////////////////////////////////////
//  INITIALIZATION
var shootLength;
var shootIndex;
var enemyLength;
var enemyIndex;
var enemy;
var shoot;
var initialize = function(){
	initializeCamera();
	initializeWorld();
	enemyController	= new EnemyController();
	shootController = new ShootController();
	shinkansen.addEventListener("render", onRender);
}

var minOffset = 200;
var maxOffset = worldWidth/4

var onLeftDown = function(event){
	
	shinkansen.offsetX -= 2;
	console.log(shinkansen.offsetX)
}

var onRightDown = function(event){
	shinkansen.offsetX += 2;

	console.log(shinkansen.offsetX)
}


var keyHandler = Emitter.getKeyHandler(document);
	keyHandler.onDown("left", onLeftDown);
	keyHandler.onDown("right", onRightDown);

initialize();