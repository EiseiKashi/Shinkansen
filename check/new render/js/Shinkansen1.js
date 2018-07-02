/*
	Version 0.0.1
	# Remove Viewport
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
		
		var _cameraX1		= -1;
		var _cameraX2		= 1;
		var _cameraY1		= 0;
		var _cameraY2		= 0;
		
		var _viewPortX;
		var _viewPortY;
		
		var _visionRadian;
		var _pointLength;
		var _slope;
		var _interceptorY;
		
		//----------------------------------------------
		// INTERFACE
		//----------------------------------------------
		
		this.getViewPortX = function () {return _viewPortX;}
		this.setViewPortX = function (value) {
			if(isNumber(value)){
				_viewPortX = value;
			}
			return _viewPortX;
		}
		
		this.getViewPortY = function () {return _viewPortY;}
		this.setViewPortY = function (value) {
			if(isNumber(value)){
				_viewPortY = value;
			}
			return _viewPortY;
		}
		
		this.addCallback = function (callback) {
			if (_callbacksList.indexOf(callback) < 0) {
				_callbacksList.push(callback);
			}
		}
		
		this.removeCallBack = function(callback) {
			var index = _callbacksList.indexOf(callback);
			if (index < 0) {
				return;
			}
			_callbacksList.splice(index, 1);
		}
		
		this.addNew = function(data, x, y, z){
			var item = new Clip3D(data, x, y, z);
			_self.add(item);
			return item;
		}

		this.add = function(item) {
			if(null == item){
				throw new Error("Can not add a null item");
			}
			_itemsList.push(item);
			emitEvent(Shinkansen.ADD, item);
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
		
		//----------------------------------------------
		// Desplazamiento de camera
		this.getOffsetY = function () {return _offsetY;}
		this.setOffsetY = function (value) {
			if(isNumber(value)){
				_offsetY = value;
			}
			return _offsetY;
		}
		
		this.getOffsetX = function () {return _offsetX;}
		this.setOffsetX = function (value) {
			if(isNumber(value)){
				_offsetX = value;
			}
			return _offsetX;
		}

		this.debuger = {};
		this.onDebug = function(){}

		this.newRender = function() {
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
					_radian = toRadian(_self.rotation);
					_rotation  = _self.rotation%360;
				}else{
					_self.rotation = _rotation%360;
				}
			}
			
			if(_self.angular != _angular){
				if(isNumber(_self.angular) ){
					_angular = _self.angular;
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
				radian		= Math.atan2(y, x);
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

			//////////////////////////////////////////////////////////////////////
			/*
			var test 		 = getRotatedPoint(1, 0,  _radian, _cameraX, _cameraZ);
			_self.debuger.x  = _cameraX;
			_self.debuger.y  = _cameraZ;
			_self.debuger.x1 =  test.x;
			_self.debuger.y2 =  test.y;
			
			var radian        = toRadian(toDegree(_radian) -_angular);
			var test 		  = getRotatedPoint(1, 0,  radian, _cameraX, _cameraZ);
			_self.debuger.hx  = _cameraX;
			_self.debuger.hy  = _cameraZ;
			_self.debuger.hx1 =  test.x;
			_self.debuger.hy2 =  test.y;
			
			var radian        = toRadian(toDegree(_radian)+ _angular);
			var test 		  = getRotatedPoint(1, 0,  radian, _cameraX, _cameraZ);
			_self.debuger.mx  = _cameraX;
			_self.debuger.my  = _cameraZ;
			_self.debuger.mx1 =  test.x;
			_self.debuger.my2 =  test.y;

			var color;
			var angle  	= rectRotation(item.x, item.z);
			var max		= _rotation + _angular;
			var min		= _rotation - _angular;

			if(angle <= max && angle >= min){
				color = "#00FF00";
			}else{
				color = "#FF0000";
			}
			
			_self.debuger.color = color;
			_self.debuger.cx  	= _cameraX;
			_self.debuger.cy  	= _cameraZ;
			_self.debuger.cx1 	= item.x;
			_self.debuger.cy1 	= item.z;
			_self.debuger.angle = angle;
			_self.debuger.max 	= max;
			_self.debuger.min 	= min;
			_self.debuger.rot 	= _rotation;
			*/
		}

		this.doRender = function() {
			var length = _itemsList.length;
			if(0 == length){
				// Early return
				return;
			}
			
			updateProperties();
			
			var dx;
			var dy;
			var z;
			var item;
			var itemX;
			var itemY;
			var scaleFactor;
			var isInRange
			var index  = 0;
			
			while (index < length) {
				item	= _itemsList[index];
				item.updateProperties();

				itemX	= item.x;
				itemY	= item.z;
				
				isInRange		= checkIsInRange(itemX, itemY);
				
				if (!isInRange) {
					item.visible = false;
					item.scale   = 0;
					index++;
					continue;
				}
				
				dx = itemX - _cameraX;
				dy = itemY - _cameraZ;
				
				var itemRadian	= Math.atan2(dy,dx) + _radian;
				var radius		= Math.sqrt(dx * dx + dy * dy);
				scaleFactor		= _focalLength / (radius);
				item.visible	= scaleFactor > 0 ;
				
				var renderX	= (Math.cos(itemRadian) * radius * scaleFactor) + _offsetX;
				var renderY = ((item.y - _cameraY) * scaleFactor) + _offsetY;
				var renderZ = z;
				var scale    = scaleFactor;
				
				item.renderX = renderX;
				item.renderY = renderY;
				item.render  = renderZ;
				item.scale	 = scaleFactor;
				
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
			
			index = 0;
			var callback;
			var indexCallback	= 0;
			var callbacksLenght	= _callbacksList.length;
			var lastIndex		= length-1;
			while (index < length) {
				item = _itemsList[index];
				indexCallback = 0;
				while (indexCallback < callbacksLenght) {
					callback = _callbacksList[indexCallback];
					callback(item.data, 
							 index, 
							 item.renderX,
							 item.renderY,
							 item.renderZ,
							 item.scale,
							 item.visible);
					indexCallback++
				}
				index++
			}

			emitEvent(Shinkansen.RENDER);
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
		
		var getHipotenuse  = function(dx, dy) {
			var hypotenuse =  Math.sqrt(dx * dx + dy * dy);
			return hypotenuse;
		}
		
		var toRadian  = function(degree){
			return degree * (PI2/360);
		}
		
		var toDegree  = function(radian) {
			return radian * (360/PI2);
		}
		
		var updateProperties  = function() {
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
					_radian = toRadian(_self.rotation);
					_rotation  = _self.rotation%360;
				}else{
					_self.rotation = _rotation%360;
				}
			}

			if(_self.angular != _angular){
				if(isNumber(_self.angular) ){
					_angular = _self.angular;
				}else{
					_self.angular = _angular;
				}
			}
			
			var halfViewPort	= _viewPortX / 2;
			var visionLength	= getHipotenuse(halfViewPort, _focalLength);
			var leftRadian		= Math.atan2(0, halfViewPort) + _radian;
			var rigthRadian		= Math.atan2(0, -halfViewPort)+ _radian;
			
			_pointLength		= getRotatedPoint(0, _focalLength,  _radian, _cameraX, _cameraZ);

			var leftPoint		= getRotatedPoint(visionLength, 0,  leftRadian,  _cameraX, _cameraZ);
			var rigthPoint		= getRotatedPoint(visionLength, 0,  rigthRadian, _cameraX, _cameraZ);
			
			_visionRadian		= getVectorsRadian(leftPoint.x, leftPoint.y, _pointLength.x, _pointLength.y);
			
			_cameraX1 			= leftPoint.x; 
			_cameraY1 			= leftPoint.y;
			_cameraX2 			= rigthPoint.x;
			_cameraY2 			= rigthPoint.y;
			/*
			_slope				= (_cameraY2 - _cameraY1) / (_cameraX2 - _cameraX1);
			_interceptorY		= _cameraY1 - _slope * _cameraX1;*/
		}
		
		var getRotatedPoint  = function(x, y, radian, originX, originY) {
			originX		= getDefaultValue(originX, 0);
			originY		= getDefaultValue(originY, 0);
			
			var finalX	= x * Math.cos(radian) - y * Math.sin(radian) + originX;
			var finalY	= x * Math.sin(radian) + y * Math.cos(radian) + originY;
			var point	= new Point(finalX, finalY);
			return point;
		}

		var anglePoint = function(x, y, radian){

		}

		var rectRotation = function(x, y){
			x = x - _cameraX;
			y = y - _cameraZ;
			var degree = Math.atan2(y, x) * (360/PI2); 
			return (degree+360)%360;
		}
		
		var checkIsInRange  = function(x, y) {
			var radian = getVectorsRadian(_pointLength.x, _pointLength.y, x, y);
			return _visionRadian > radian;
		}
		
		var getVectorsRadian  = function(point1X, point1Y, point2X, point2Y ) {
			point1X		-= _cameraX;
			point1Y		-= _cameraZ;
			
			point2X		-= _cameraX;
			point2Y		-= _cameraZ;
			
			var scalar	=  point1X * point2X + point1Y * point2Y;
			var mod1	= getHipotenuse(point1X, point1Y);
			var mod2	= getHipotenuse(point2X, point2Y);
			var mods	= (mod1 * mod2); 
			
			var radianToCalculate = mods == 0 ? 0 : scalar / mods;
			var radian= Math.acos(radianToCalculate);
			if(isNaN(radian)){
				return;
			}
			
			while (isNaN(radian)) {
				radian = Math.acos(int(radianToCalculate * 10) / 10);
			}
			return radian;
		}
		
		var getPointDistance  = function(itemX, itemY, 
										  x1, y1, x2, y2) {
			var denominator = Math.abs((y2 - y1) * itemX - (x2 - x1) * itemY + x2 * y1 - y2 * x1);
			var divisor     = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 -x1, 2));
			return denominator / divisor;
			
			// d = 	|A·Mx + B·My + C|
			//			√A2 + B2		
			//https://www.youtube.com/watch?v=bfZ57ESvFok
		}
		
		var getPointIntersection  = function(itemX, itemY) {
			var m2 = -(1 / _slope);
			var b2  = itemY - m2 * itemX;
			var x2  = (b2-_interceptorY)/(_slope-m2);
			var y2  = (m2 * x2 + b2);
			return new Point(x2, y2);
		}
		
		var Point  = function(x, y) {
			this.x = x;
			this.y = y;
		}
		
		var getDefaultValue = function(value, defaultValue) {
			var finalValue = typeof(value) === "undefined" ? defaultValue : value;
			return finalValue;
		}

		var update = function(){
			_requestAnimationFrame(update);
			_self.doRender.apply(_self);
		}
		_requestAnimationFrame(update);
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