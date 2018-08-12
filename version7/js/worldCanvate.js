///////////////////////////////
// SETTINGS
var Character = function(url, title, subtitle, description){
	this.url			= url;
	this.title			= title;
	this.subtitle		= subtitle;
	this.description	= description;
}

var _characterList = [
	 new Character(	  "img/alice.png"
					 ,"Alice"
					 ,"Guardian of Courage"
					 ,"She never backs down from a challenge and is always first to the front lines of battle.")
	,new Character(	 "img/fiona.png"
					,"Fiona"
					,"Guardian of Dragons"
					,"She was born in the wilds and raised by dragons. When dragons fly with her, they earn 2x XP!")
	,new Character(	 "img/sophia.png"
					,"Sophia"
					,"Guardian of Adventure"
					,"Renowned explorer, inventor, and scientist, she is 2x faster completing Quests")
	,new Character(	 "img/lily.png"
					,"Lily"
					,"Guardian of Fortune"
					,"A master Alchemist and Mage of the Third Order, she earns 2x Coins. Cha-ching! ")
	,new Character(	 "img/aurora.png"
					,"Aurora"
					,"Guardian of Nature"
					,"Caretaker of the forest, a true sister to Nature. Her enchanted super magnet attracts items!")
	,new Character(	 "img/lenore.png"
					,"Leonore"
					,"Guardian of Twilight"
					,"A mysterious loner, with a dark and haunting past, some say she acts as if she has 2 lives...")
	,new Character(	 "img/jade.png"
					,"Jade"
					,"Guardian of Shadows"
					,"As assassin who fears nothing! Attacks charge up her skill, which makes her invulnerable and deal double damage.")
	,new Character(	 "img/arcana.png"
					,"Arcana"
					,"Guardian of Magic"
					,"This sly illusionist has a few tricks up her sleeve. She can clone sidekicks after charging up.")
];

var CHANGE			= "change";
var CLICK			= "click";
var spin			= Math.PI*2/_characterList.length;
var spinRotation	= 360/_characterList.length;
var radius			= 190;
var cameraX 		= 0;
var cameraY 		= -92;
var cameraZ 		= 0;
var focalLength 	= 243;
var canvasWidth 	= 1000;
var canvasHeight	= 900;
var offsetX			= 450;
var offsetY			= 120;
var viewY			= -50;
var viewScale		= 0.19;
var carrouselSpeed	= 1.2;
var rightX			= 100;
var controlX		= 450;
var controlY		= 630;
var viewList		= [];

///////////////////////////////
// MAIN ENTITIES
var shinkansen;
var canvas;
var canvate;

var carrouselAnimator;
var titleAnimator;
var subtitleAnimator;
var descriptionAnimator;

var carrouselState;
var titleState;
var subtitleState;
var descriptionState;

var title;
var subTitle;
var description;

///////////////////////////////
// SHINKANSEN
var initializeShinkansen = function(){
	shinkansen = new Shinkansen();
	shinkansen.cameraX		= cameraX;
	shinkansen.cameraY		= cameraY;
	shinkansen.cameraZ		= cameraZ;

	shinkansen.focalLength	= focalLength;
	shinkansen.offsetX		= offsetX;
	shinkansen.offsetY		= offsetY;

	shinkansen.vertRotation = 5;

	shinkansen.addEventListener("render", onCameraUpdate);
}

var onCameraUpdate = function(){
	var length = viewList.length;
	var render;
	for(var index=0; index < length; index++){
		render = viewList[index];

		renderCharacter(render.object2D, render.object3D, render.view, render.data);
	}
}

///////////////////////////////
// CANVATE
var initializeCanvate = function(){
	canvas = document.querySelector("canvas");
	canvas.width		= canvasWidth;
	canvas.height		= canvasHeight;

	canvate = new Canvate("world");
}

///////////////////////////////
// CHARACTER RENDERING
var intializeCharacter = function(){
	var length = _characterList.length;
	var character;
	var img;
	for (index=0; index < length; index++){
		character	= _characterList[index];
		img			= canvate.addNewByURL(character.url);
		img.setPivot(.5, .5);
		var xyz		= {};
			xyz.x	= Math.cos(spin*index)*radius;
			xyz.y	= viewY;
			xyz.z	= Math.sin(spin*index)*radius;

		var view3D	= shinkansen.add(xyz, img, {x:xyz.x, y:xyz.y, z:xyz.z, index:index});
		viewList.push(view3D);
	}
}

var renderCharacter = function(xyz, render, view, id){
	var rx			= render.x;
	var ry			= render.y;
	var rz			= render.z;
	var visible		= render.visible;
	var index   	= render.index;
	
	view.visible	= visible;
	view.x    	    = rx;
	view.y    		= ry;
	view.scaleX  	= rz*viewScale;
	view.scaleY 	= rz*viewScale;
	//view.alpha	= shinkansen.rotation
	view.setDepth(index);
	view.alpha 		= rz;
};

///////////////////////////////
// INITIALIZATIONS

var initializeScene = function(){
	var background		= canvate.addNewByURL("img/3dbackground.png");
		background.setPosition(150, 50);

	var guardians		= canvate.addNewByURL("img/guardians7.png");
	guardians.addEventListener("imageLoaded", function(){
		guardians.x = (canvasWidth-guardians.width)/2;
	})
	
	guardians.y			= 30;

}

var initializeContent = function(){
	content = canvate.addNew();
	content.setPosition(650, 400);

	title				= content.addNew();
	title.width			= 340;
	
	subtitle			= content.addNew();
	subtitle.width		= 380;
	subtitle.y			= 40;
	
	description			= content.addNew();
	description.width	= 340;
	description.height	= 1200;
	description.y		= 80;
	
	title.setText("", 40, 'Soup of Justice', "#2b2b2b")
	subtitle.setText("", 26, 'Soup of Justice', "#c02f16");
	description.setText("", 21, 'Lora', "#2b2b2b");
}

var initializeControls = function(){
	var controlsContainer	= canvate.addNew();
	var left				= controlsContainer.addNewByURL("img/left.png");
	var right				= controlsContainer.addNewByURL("img/right.png");
	
	controlsContainer.setPosition(controlX, controlY);

		left.setPivot(.5, .5);
		right.setPivot(.5, .5);

		right.setPosition(rightX, 0);

		left.addEventListener(CLICK, function(){
			carrouselState.rotation = shinkansen.rotation + spinRotation;
			carrouselAnimator.play(carrouselSpeed, .7);
			
			hideContent();
		});

		right.addEventListener(CLICK, function(){
			carrouselState.rotation = shinkansen.rotation - spinRotation;
			carrouselAnimator.play(carrouselSpeed, .7);

			hideContent();
		});
}

///////////////////////////////
// INITIALIZE ALL
var initialize = function(){
	initializeShinkansen();
	initializeCanvate();

	initializeScene();
	initializeContent();
	intializeCharacter();
	initializeControls();

	initializeAnimators();
}

///////////////////////////////
// CONTROL ANIMATION
var initializeAnimators = function(){
	carrouselAnimator	= new Yasashiku();
	titleAnimator		= new Yasashiku();
	subtitleAnimator	= new Yasashiku();
	descriptionAnimator	= new Yasashiku();

	carrouselState 		= {rotation:0};
	titleState			= {alpha:0};
	subtitleState		= {alpha:0};
	descriptionState	= {alpha:0};
	
	carrouselAnimator.add(shinkansen, carrouselState);
	titleAnimator.add(title, titleState);
	subtitleAnimator.add(subtitle, subtitleState);
	descriptionAnimator.add(description, descriptionState);

	carrouselAnimator.addEventListener("complete", function(){
		var length = viewList.length;
		var render;
		var maxZ = -1;
		var maxIndex = 0;
		for(var index=0; index < length; index++){
			render = viewList[index];
			if(render.object3D.z > maxZ){
				maxIndex = index;
				maxZ = render.object3D.z
			}
		}

		displayContentByIndex(maxIndex);
	})
}

var hideContent = function(){
	var data = _characterList[index];
	titleState.alpha	= 0;
	titleState.x		= 50;
	titleAnimator.play(.5);
	
	subtitleState.alpha	= 0;
	subtitleState.x		= 50;
	subtitleAnimator.play(.5, .2);

	descriptionState.alpha	= 0;
	descriptionState.x		= 50;
	descriptionAnimator.play(.5, .4);
}

var displayContentByIndex = function(index){
	var data = _characterList[index];
	title.setText(data.title);
	titleState.alpha	= 1;
	titleState.x		= 0;
	titleAnimator.play(.5, .2);

	subtitle.setText(data.subtitle);
	subtitleState.alpha	= 1;
	subtitleState.x		= 0;
	subtitleAnimator.play(.5, .4);

	description.setText(data.description);
	descriptionState.alpha	= 1;
	descriptionState.x		= 0;
	descriptionAnimator.play(.5, .6);
}

initialize();

shinkansen.rotation = 270;
displayContentByIndex(0);