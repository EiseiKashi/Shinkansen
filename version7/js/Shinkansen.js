/*
	Version 0.0.15
	# Change alghoritm 5 Fix Offeset
*/

var version = 15;
document.title = version + " Shinkansen";

// ::: EMITTER ::: //
var MOUSE_OVER      = "mouseOver";
var MOUSE_OUT       = "mouseOut";
var MOUSE_UP        = "mouseUp";
var MOUSE_DOWN      = "mouseDown";
var MOUSE_LEAVE     = "mouseLeave";
var CLICK           = "click";
var DROP            = "drop";
var DRAG            = "drag";
var DRAGING         = "draging";
var FUNCTION        = "function";
var OBJECT          = "object";

function Shinkansen (){
	'use strict'

	var isString = typeof element === "string";
    if(isString){
        element = document.getElementById(element);
        if(null == element){
            throw "There is no element with the 'id': " + element;
        }
    }
    
    window.check = true;
    var lastTime = 0;
    var vendors  = ['ms', 'moz', 'webkit', 'o'];
    
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[x]+'CancelAnimationFrame'] 
                                     || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime   = Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id         = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime       = currTime + timeToCall;
            return id;
        };
    }
    
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        }
    }
	
	var isNumber = function(number){
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
	
	var _orderCounter = 0;

	var Clip3D = function (object2D, object3D, view, callback, context) {
		'use strict';

		this.order		 = _orderCounter++;

		this.object2D	 = object2D;
		this.object3D	 = object3D;
		
		object3D.x 		 = 0;
		object3D.y 		 = 0;
		object3D.z 		 = 0;
		object3D.scale	 = 1;
		object3D.visible = true;
		
		this.view		 = view;
		this.callback	 = callback;
		this.context	 = context;
	}

	var Shinkansen = function() {
		'use strict';
		
		this.cameraX;
		this.cameraY;
		this.cameraZ;
		this.focalLength;
		this.rotation;

		var _self			= this;
		this.offsetX		= 0;
		this.offsetY		= 0;
		var _cameraX		= 0;
		var _cameraY		= 0;
		var _cameraZ		= 0;
		var _focalLength	= 300;
		var _rotation		= 0;
		
		var _emitter		= new Emitter(this);
		
		var PI2				= Math.PI * 2;
		
		var _clipList		= new Array();
		
		var _offsetX		= 0;
		var _offsetY		= 0;

		var clip; var x; var y; var z; var radius; var angle;
		var scale; var xyz; var visible;
		
		//----------------------------------------------
		// INTERFACE
		//----------------------------------------------
		this.add = function(object2D, view, callback, context){
			if(typeof object2D != 'object'){
				object2D = {};
			}

			object2D.x		= isNumber(object2D.x) ? object2D.x : 0;
			object2D.y		= isNumber(object2D.y) ? object2D.y : 0;
			object2D.z		= isNumber(object2D.z) ? object2D.z : 0;

			var object3D	= {}
				object3D.x	= 0;
				object3D.y	= 0;
				object3D.z	= 0;
			
			var clip = new Clip3D(object2D, object3D, view, callback, context);
			_clipList.push(clip);

			emitEvent(Shinkansen.ADD, clip);

			return {object2D:object2D, object3D:object3D, view:view};
		}

		this.remove = function (clip) {
			var object3D = clip.object3D;
			var length	= _clipList.length;
			var clip;
			for(var index=0; index < length; index++){
				clip = _clipList[index];
				if(clip.object3D == object3D){
					_clipList.splice(index, 1);
				}
			}
			emitEvent(Shinkansen.REMOVE, clip);
		}

		this.debuger = {};
		this.onDebug = function(){
		}

		this.doRender = function() {
			var length = _clipList.length;
			if(0 == length){
				// Early return
				return;
			}
			
			if(_cameraX != _self.cameraX){
				if(isNumber(_self.cameraX)){
					_cameraX = _self.cameraX;
				}else{
					_self.cameraX = _cameraX;
				}
			}

			if(_cameraY != _self.cameraY){
				if(isNumber(_self.cameraY)){
					_cameraY = _self.cameraY;
				}else{
					_self.cameraY = _cameraY;
				}
			}

			if(_cameraZ != _self.cameraZ){
				if(isNumber(_self.cameraZ)){
					_cameraZ = _self.cameraZ;
				}else{
					_self.cameraZ = _cameraZ;
				}
			}

			if(_focalLength != _self.focalLength){
				if(isNumber(_self.focalLength)){
					_focalLength = _self.focalLength;
				}else{
					_self.focalLength = _focalLength;
				}
			}

			if(_offsetX != _self.offsetX){
				if(isNumber(_self.offsetX)){
					_offsetX = _self.offsetX;
				}else{
					_self.offsetX = _offsetX;
				}
			}

			if(_offsetY != _self.offsetY){
				if(isNumber(_self.offsetY)){
					_offsetY = _self.offsetY;
				}else{
					_self.offsetY = _offsetY;
				}
			}

			if(isNumber(_self.rotation) && _self.rotation != _rotation){
				_rotation = _self.rotation;
			}else{
				_self.rotation = _rotation;
			}

			_rotation	= ((_rotation%360)+360)%360;
			var radian  = _rotation * (PI2/360);
			
			var object2D;
			var object3D;
			for(var index=0; index < length; index++){
				clip			= _clipList[index];
				object2D		= clip.object2D;
				object3D		= clip.object3D;
				x				= (object2D.x - _cameraX);
				y				= (object2D.y - _cameraY);
				z				= (object2D.z - _cameraZ);
				z 				= _focalLength/(_focalLength + z);
				object3D.x 		= _offsetX + x * z;
				object3D.y		= _offsetY + y * z;
				object3D.z		= z;
				object3D.visible= z < _focalLength;
			}
			
			_clipList.sort(sortList);

			for(var index=0; index < length; index++){
				clip = _clipList[index];
				clip.callback.call(clip.context, clip.object2D, clip.object3D, clip.view);
			}

			emitEvent(RENDER);
		}

		// Add listener
        this.addEventListener = function (type, listener, context){
            _emitter.addEventListener(type, listener, context);
        }
        
        // Remove Listener
        this.removeEventListener = function (type, listener, context){
            _emitter.removeEventListener(type, listener, context);
		}
		
		var emitEvent = function(type, data){
            _emitter.emit(type, data);
		}

		//----------------------------------------------
		// Helpers
		//----------------------------------------------
		var sortList = function(clipA, clipB){
			var az; var bz; var a3d; var b3d;
			a3d = clipA.object3D;
			b3d = clipB.object3D;
			az  = a3d.z;
			bz  = b3d.z;
			if(az == bz){
				if(a3d.order < b3d.order){
					return -1;
				}
				
				if(a3d.order > b3d.order){
					return 1;
				};
			}

			if(az < bz){
				return -1;
			}
			
			if(az > bz){
				return 1;
			}
		}

		var update = function(){
			requestAnimationFrame(update);
			_self.doRender.apply(_self);
		}
		requestAnimationFrame(update);
	}

	return new Shinkansen();
}