/*
	Version 0.0.1
	# Change alghoritm 1
*/

var version = 10;
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

	var Clip3D = function (xyz, data, callback, context) {
		'use strict';

		this.order		= _orderCounter++;
		
		this.xyz		= xyz;
		this.data		= data;
		this.callback	= callback;
		this.context	= context;
		this.x 			= 0;
		this.y 			= 0;
		this.z 			= 0;
		this.scale		= 1;
		this.visible	= true;
	}

	var Shinkansen = function() {
		'use strict';
		var _self			= this;
		
		this.cameraX;
		this.cameraY;
		this.cameraZ;
		this.focalLength;
		this.rotation;
		
		var _cameraX		= 0;
		var _cameraY		= 0;
		var _cameraZ		= 0;
		var _focalLength	= 300;
		var _rotation		= 0;
		
		var _emitter		= new Emitter(this);
		
		var PI2				= Math.PI * 2;
		
		var _itemList		= new Array();
		
		var _offsetX		= 0;
		var _offsetY		= 0;

		var item; var x; var y; var z; var radius; var angle;
		var scale; var xyz; var visible;
		
		//----------------------------------------------
		// INTERFACE
		//----------------------------------------------
		this.add = function(callback, data, context){
			if(typeof callback != 'function'){
				throw new Error("First argument 'callback' must be a Function");
			}
			var xyz	 = {x:0, y:0, z:0};
			
			var item = new Clip3D(xyz, data, callback, context);
			_itemList.push(item);

			emitEvent(Shinkansen.ADD, xyz);
			
			return xyz;
		}

		this.remove = function (xyz) {
			var index = _itemList.indexOf(xyz);
			if (index < 0) {
				return;
			}
			_itemList.splice(index, 1);

			emitEvent(Shinkansen.REMOVE, item);
		}

		this.debuger = {};
		this.onDebug = function(){

		}

		this.doRender = function() {RENDER
			var length = _itemList.length;
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

			if(_offsetX != _self._offsetX){
				if(isNumber(_self._offsetX)){
					_offsetX = _self._offsetX;
				}else{
					_self._offsetX = _offsetX;
				}
			}

			if(_offsetY != _self._offsetY){
				if(isNumber(_self._offsetY)){
					_offsetY = _self._offsetY;
				}else{
					_self._offsetY = _offsetY;
				}
			}

			if(isNumber(_self.rotation) && _self.rotation != _rotation){
				_rotation = _self.rotation;
			}else{
				_self.rotation = _rotation;
			}

			_rotation	= ((_rotation%360)+360)%360;
			var radian  = _rotation * (PI2/360);

			for(var index=0; index < length; index++){
				item	= _itemList[index];
				xyz		= item.xyz;

				x = (xyz.x - _cameraX);
				y = (xyz.y - _cameraY);
				z = (xyz.z - _cameraZ);

				z = _focalLength/(_focalLength + z);
				
				item.x 	= _offsetX + x * z;
				item.y	= _offsetY + y * z;
				item.z	= z;

				item.visible = z < -_focalLength;
			}
			
			_itemList.sort(sortList);

			for(var index=0; index < length; index++){
				item 	= _itemList[index];

				var render	= {
								x			: item.x
								,y			: item.y
								,z			: item.z
								,xyz		: item.xyz
								,data		: item.data
								,index      : index
								,visible	: item.visible
							}
				
				item.callback.call(item.context, render);
			}

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
		var sortList = function(itemA, itemB){
			if(itemA.z == itemB.z){
				if(itemA.order < itemB.order){
					return -1;
				}
				
				if(itemA.order > itemB.order){
					return 1;
				};
			}

			if(itemA.z < itemB.z){
				return -1;
			}
			
			if(itemA.z > itemB.z){
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