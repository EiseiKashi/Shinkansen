/*
	Version 0.0.1
	# New render
*/

var version = 10;
document.title = version + " Shinkansen";

function Shinkansen (){
	'use strict'

	var _requestAnimationFrame = window.requestAnimationFrame;
	if(null == _requestAnimationFrame){
		var vendors  = ['ms', 'moz', 'webkit', 'o'];
		
		for(var x = 0; x < vendors.length && !_requestAnimationFrame; ++x) {
			_requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		}
		
		if (!_requestAnimationFrame){
			_requestAnimationFrame = function(callback) {
				setTimeout(callback, 10);
			};
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
	// ::: EMITTER ::: //
    var Emitter = function(target){
        'use strict';
        var _typeCounter   = 0;
        var _hasMouse      = false;
                           
        var CONTEXT        = 0;
        var LISTENER       = 1;
        var _target        = target;
        
        var _listenerTypes = {};
        var _listenerList;
        
        var listener;
        
        this.addEventListener = function(type, listener, context){
            if(null == type || type == "" || typeof listener !== FUNCTION ){
                return;
            }
            _listenerList = _listenerTypes[type];
            if(null == _listenerList){
                _listenerList = _listenerTypes[type] = [];
            }
            
            var length = _listenerList.length;
            for(var index=0; index < length; index++){
                if(listener[LISTENER] == listener && 
                   listener[CONTEXT]  == context){
                    return;
                }
            }
            _listenerTypes[type].push([context, listener]);
            switch(type){
                case CLICK : 
                case MOUSE_OVER :
                case MOUSE_OUT :
                case MOUSE_DOWN : 
                case MOUSE_UP :
                case MOUSE_LEAVE : 
                case MOUSE_LEAVE : 
                case DRAG :
                case DROP :
                _typeCounter++;
                break;
            }
            
            _hasMouse = true;
            return _hasMouse;
        }
        
        this.removeEventListener = function(type, listener, context){
            if(null == type || type == "" || typeof listener !== FUNCTION ){
                return;
            }
            
            _listenerList = _listenerTypes[type];
            if(null == _listenerList){
                return
            }
            
            var length = _listenerList.length;
            for(var index=0; index < length; index++){
                listener = _listenerList[index];
                if(listener[LISTENER] == listener && 
                   listener[CONTEXT]  == context){
                    _listenerTypes[type].splice(index, 1);
                    switch(type){
                        case CLICK : 
                        case MOUSE_OVER :
                        case MOUSE_OUT :
                        case MOUSE_DOWN : 
                        case MOUSE_UP :
                        case MOUSE_LEAVE : 
                        case MOUSE_LEAVE : 
                        case DRAG :
                        case DROP :
                        _typeCounter--;
                        break;
                    }
                    _typeCounter = Math.min(_typeCounter, 0);
                    _hasMouse = _typeCounter > 0;
                    return true;
                }
            }
        }
        
        this.emit = function(type, data){
            if(null == type || type == ""){
                return;
            }
            _listenerList = _listenerTypes[type];
            if(null == _listenerList){
                return
            }
            data        = null == data || typeof data != OBJECT ? {} : data;
            data.type   = type;
            data.target = _target;
            var length  = _listenerList.length;
            for(var index=0; index < length; index++){
                listener = _listenerList[index];
            listener[LISTENER].apply(listener[CONTEXT], [data]);
            }
        }
        
        this.hasMouse = function(){
            return _hasMouse;
        }
	}
	
	var clipIdCounter = 0;
	var Clip3D = function (view, x, y, z, callback, context) {
		'use strict';

		var _id		= clipIdCounter;
		this.getId	= function() {
			return _id;
		}
		clipIdCounter++;
		
		var _x;
		var _y;
		var _z;

		this.x			= x;
		this.y			= y;
		this.z			= z;
		this.view		= view;
		this.callback	= callback;
		this.context	= context;

		this.renderX;
		this.renderY;
		this.renderZ;
		this.scale;
		this.visible;
		this.depth;

		this.updateProperties = function(){
			if(_x != this.x){
				if(isNumber(this.x)){
					_x = this.x;
				}else{
					this.x = _x
				}
			}

			if(_y != this.y){
				if(isNumber(this.y)){
					_y = this.y;
				}else{
					this.y = _y
				}
			}

			if(_z != this.z){
				if(isNumber(this.z)){
					_z = this.z;
				}else{
					this.z = _z
				}
			}
		}

		this.setRender = function(x, y, z, scale, visible, depth){
			this.renderX = x;
			this.renderY = y;
			this.renderZ = z;
			this.scale	 = scale;
			this.visible = visible;
			this.depth   = depth;
		}

		this.emit = function(){
			this.callback(this.context, [this]);
		}
	}

	var Shinkansen = function() {
		'use strict';
		var _self			= this;
		
		this.cameraX;
		this.cameraY;
		this.cameraZ;
		this.focalLength;
		this.rotation;
		this.angular;
		
		var _cameraX		= 0;
		var _cameraY		= 0;
		var _cameraZ		= 0;
		var _focalLength	= 300;
		var _rotation;
		var _angular        = 30;
		
		var _emitter		= new Emitter(this);
		
		var PI2				= Math.PI * 2;
		
		var _itemsList		= new Array();
		var _callbacksList	= new Array();
		
		var _radian			= 0;
		
		var _offsetX		= 0;
		var _offsetY		= 0;
		
		var _viewPortX;
		var _viewPortY;
		
		var _visionRadian;
		var _pointLength;
		var _slope;
		var _interceptorY;
		
		//----------------------------------------------
		// INTERFACE
		//----------------------------------------------
		this.add = function(data, x, y, z, callback, context){
			var item = new Clip3D(data, x, y, z, callback, context);
			_itemsList.push(item);
			emitEvent(Shinkansen.ADD, item);
			return item;
		}
		
		this.remove = function (item) {
			_itemsList.push(item);
			var index = _itemsList.indexOf(item);
			if (index < 0) {
				return;
			}
			_itemsList.splice(index, 1);
			emitEvent(Shinkansen.REMOVE, item);
		}

		// Add listener
        this.addEventListener = function (type, listener, context){
            _emitter.addEventListener(type, listener, context);
        }
        
        // Remove Listener
        this.removeEventListener = function (type, listener, context){
            _emitter.removeEventListener(type, listener, context);
		}
		
		//----------------------------------------------
		// Helpers
		//----------------------------------------------
		var render = function() {
			var length = _itemsList.length;
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

			if(_self.rotation != _rotation){
				if(isNumber(_self.rotation)){
					_rotation	= ((_self.rotation%360)+360)%360;
					_radian		= _rotation * (PI2/360);
				}else{
					_self.rotation = _rotation;
				}
			}
			
			if(_self.angular != _angular){
				if(isNumber(_self.angular) ){
					_angular = ((_self.angular%360)+360)%360;
				}else{
					_self.angular = _angular;
				}
			}
			
			var dx;
			var dy;
			var item;
			var itemX;
			var itemY;
			var scaleFactor;
			var radian;
			var angle;
			var isInRange;
			var max;
			var min;
			var radius;
			var renderX;
			var renderY;
			var renderZ;
			var index  = 0;
			var length = _itemsList.length;
			for (var index=0; index < length; index++) {
				item		= _itemsList[index];
				item.updateProperties();
				
				itemX		= item.x;
				itemY		= item.z;

				dx			= itemX - _cameraX;
				dy			= itemY - _cameraZ;
				radian		= Math.atan2(dy, dx);
				angle		= radian * (360/PI2); 
				angle   	= (angle+360)%360;
				
				max 		= _rotation + _angular;
				min 		= _rotation - _angular;
				isInRange	= angle <= max && angle >= min;
				
				if (!isInRange) {
					item.visible = false;
					item.scale   = 0;
					index++;
					continue;
				}
				
				radius			= Math.sqrt(dx * dx + dy * dy);
				scaleFactor		= _focalLength / radius;
				item.visible	= scaleFactor > 0 ;
				
				renderX			= (Math.cos(radian) * radius * scaleFactor);
				renderY 		= ((item.y - _cameraY) * scaleFactor);
				renderZ 		= scaleFactor;
				
				item.renderX 	= renderX;
				item.renderY 	= renderY;
				item.render  	= renderZ;
				item.scale	 	= scaleFactor;

				index++;
			}
			
			//_itemsList.sortOn("renderZ", Array.DESCENDING | Array.NUMERIC);
			_itemsList.sort(function(a, b){
				if(a.scale == b.scale){
					return 0;
				}else if(a.scale < b.scale){
					return -1;
				}else if(a.scale > b.scale){
					return 1;
				}
			});

			var length = _itemsList.length;
			for (var index=0; index < length; index++) {
				item = _itemsList[index];
				item.emit();
			}
			
			emitEvent(Shinkansen.RENDER);
		}
		
		var emitEvent = function(type, data){
            _emitter.emit(type, data);
		}

		var update = function(){
			_requestAnimationFrame(update);
			render.apply();
		}
		_requestAnimationFrame(update);

		//-------------------------------------------------
		// Trigonometry
		//-------------------------------------------------
		/*
			radian =  degree * (PI2/360);
			degree =  radian * (360/PI2);
		*/
		var pointByRadian  = function(x, y, radian, offsetX, offsetY) {
			if(!isNumber(x) && !isNumber(y) && !isNumber(radian)){
				throw new Error("To get a rotated point, the arguments [ x, y, angle ] must be a Number.");
			}
			offsetX		= isNumber(offsetX) ? offsetX : 0;
			offsetY		= isNumber(offsetY) ? offsetY : 0;
			var finalX	= x * Math.cos(radian) - y * Math.sin(radian) + offsetX;
			var finalY	= x * Math.sin(radian) + y * Math.cos(radian) + offsetY;
			var point	= new Point(finalX, finalY);
			return point;
		}

		var pointByDegree  = function(x, y, degree, offsetX, offsetY) {
			var radian = ((degree%360)+360)%360 * (PI2/360);
			return pointByRadian(x, y, radian, offsetX, offsetY);
		}

		var pointByRadiusRadian = function(radius, radian, offsetX, offsetY){
			return pointByRadian(radius, 0, radian, offsetX, offsetY);
		}

		var pointByRadiusDegree = function(radius, degree){
			return pointByDegree(radius, 0, radian, offsetX, offsetY);
		}
	}

	Shinkansen.ADD			= "add";
	Shinkansen.REMOVE		= "remove";
	Shinkansen.CAMERA_X		= "cameraX";
	Shinkansen.CAMERA_Y		= "cameraY";
	Shinkansen.CAMERA_Z		= "cameraZ";
	Shinkansen.ROTATION		= "Rotation";
	Shinkansen.RADIAN		= "radian";
	Shinkansen.FOCAL_LENGTH	= "focalLength";
	Shinkansen.RENDER		= "render";

	return new Shinkansen();
}