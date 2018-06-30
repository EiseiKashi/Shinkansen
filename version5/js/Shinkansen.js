/*
	Version 0.0.1
	# Properties polishing
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
	var Event = function(type, data){
		this.type = type;
		this.data = data;
	}

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
	var Clip3D = function (view, x, y, z) {
		'use strict';
		var _id			= clipIdCounter;
		clipIdCounter++;

		var _view		= null != view ? view : null;
		var _x			= isNumber(x) ? x : 0;
		var _y			= isNumber(y) ? y : 0;
		var _z			= isNumber(z) ? z : 0;
		
		var _renderedX	= 0;
		var _renderedY	= 0;
		var _renderedZ	= 0;
		
		var _visible	= true;
		
		var _scale		= 0;
		
		this.getId = function() {
			return _view != null ? _view.name : null;
		}
		
		this.getView = function() {return _view;}
		this.setView = function(value) {
			if (null != value) {
				_view = value;
			}
			return _view;
		}
		
		this.getX = function() {return _x;}
		this.setX = function(value) {
			if (isNumber(value)) {
				_x = value;
			}
			return _x;
		}
		
		this.getY = function() {return _y;}
		this.setY = function(value) {
			if (isNumber(value)) {
				_y = value;
			}
			return _y;
		}
		
		this.getZ = function() {return _z;}
		this.setZ = function(value) {
			if (isNumber(value)) {
				_z = value;
			}
			return _z;
		}
		
		this.getRenderedX = function() {return _renderedX;}
		this.setRenderedX = function(value) {
			if (isNumber(value)) {
				_renderedX = value;
			}
			return _renderedX;
		}
		
		this.getRenderedY = function() {return _renderedY;}
		this.setRenderedY = function(value) {
			if (isNumber(value)) {
				_renderedY = value;
			}
			return _renderedY;
		}
		
		this.getRenderedZ = function() {return _renderedZ;}
		this.setRenderedZ = function(value) {
			if (isNumber(value)) {
				_renderedZ = value;
			}
			return _renderedZ;
		}
		
		this.getScale = function() {return _scale;}
		this.setScale = function(value) {
			if(isNumber(value)){
				_scale = value;
			}
			return _scale;
		}
		
		this.getVisible = function() {return _visible;}
		this.setVisible = function(value) {
			_visible = value;
		}

		this.addEventListener = function(type, listener, context){
            _emitter.addEventListener(type, listener, context);
        }
        
        this.removeEventListener = function(type, listener, context){
			_emitter.removeEventListener(type, listener, context);
		}
		
		var emit =function(type, data){
			_emitter.emit(type, data); 
		}
	}

	var Point3D = function (view, x, y, z) {
		'use strict';
		var _id			= clipIdCounter;
		clipIdCounter++;

		var _emitter    = new Emitter(this);

		var _view		= null != view ? view : null;
		var _x			= isNumber(x) ? x : 0;
		var _y			= isNumber(y) ? y : 0;
		var _z			= isNumber(z) ? z : 0;
		
		var _renderedX	= 0;
		var _renderedY	= 0;
		var _renderedZ	= 0;
		
		var _visible	= true;
		
		var _scale		= 0;
		
		this.getId = function() {
			return _view != null ? _view.name : null;
		}
		
		this.getView = function() {return _view;}
		this.setView = function(value) {
			if (null != value) {
				_view = value;
			}
			return _view;
		}
		
		this.getX = function() {return _x;}
		this.setX = function(value) {
			if (isNumber(value)) {
				_x = value;
			}
			return _x;
		}
		
		this.getY = function() {return _y;}
		this.setY = function(value) {
			if (isNumber(value)) {
				_y = value;
			}
			return _y;
		}
		
		this.getZ = function() {return _z;}
		this.setZ = function(value) {
			if (isNumber(value)) {
				_z = value;
			}
			return _z;
		}
		
		this.getRenderedX = function() {return _renderedX;}
		this.setRenderedX = function(value) {
			if (isNumber(value)) {
				_renderedX = value;
			}
			return _renderedX;
		}
		
		this.getRenderedY = function() {return _renderedY;}
		this.setRenderedY = function(value) {
			if (isNumber(value)) {
				_renderedY = value;
			}
			return _renderedY;
		}
		
		this.getRenderedZ = function() {return _renderedZ;}
		this.setRenderedZ = function(value) {
			if (isNumber(value)) {
				_renderedZ = value;
			}
			return _renderedZ;
		}
		
		this.getScale = function() {return _scale;}
		this.setScale = function(value) {
			if(isNumber(value)){
				_scale = value;
			}
			return _scale;
		}
		
		this.getVisible = function() {return _visible;}
		this.setVisible = function(value) {
			_visible = value;
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
		
		var _cameraX		= 0;
		var _cameraY		= 0;
		var _cameraZ		= 0;
		var _focalLength	= 300;
		var _rotation;
		
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
		
		this.addNew = function(view, x, y, z){
			var item = new Clip3D(view, x, y, z);
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
			var name;
			var viewName;
			var isInRange
			var index  = 0;
			
			while (index < length) {
				item	= _itemsList[index];
				itemX	= item.getX()
				itemY	= item.getZ()
				
				 var intersect	=  getPointIntersection(itemX, itemY);
				isInRange		= checkIsInRange(itemX, itemY);
				
				if (!isInRange) {
					item.setVisible(false);
					item.setScale(0);
					index++;
					continue;
				}
				
				dx = itemX - _cameraX;
				dy = itemY - _cameraZ;
				
				var itemRadian	= Math.atan2(dy,dx) + _radian;
				var radius		= getHipotenuse(dx, dy);
				z				= getPointDistance(	itemX, itemY,
													_cameraX1, _cameraY1,
													_cameraX2, _cameraY2);
				scaleFactor		= _focalLength / (z);
				item.visible	= scaleFactor > 0 ;
				
				var renderedX	= (Math.cos(itemRadian) * radius * scaleFactor) + _offsetX;
				var renderedY = ((item.getY() - _cameraY) * scaleFactor) + _offsetY;
				var renderedZ = z;
				var scale     = scaleFactor;
				
				item.setRenderedX(renderedX);
				item.setRenderedY(renderedY);
				item.setRenderedZ(renderedZ);
				item.setScale(scaleFactor);
				
				index++
			}
			
			//_itemsList.sortOn("renderedZ", Array.DESCENDING | Array.NUMERIC);
			_itemsList.sort(function(a, b){
				if(a.getRenderedZ() == b.getRenderedZ()){
					return a.getRenderedX() < b.getRenderedX()
				}
				return a.getRenderedZ() < b.getRenderedZ()
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
					callback(item.getView(), 
							 index, 
							 item.getRenderedX(),
							 item.getRenderedY(),
							 item.getRenderedZ(),
							 item.getScale(),
							 index == 0,
							 index == lastIndex);
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
		
		var getRadianFromRotation  = function(degree){
			return degree * (PI2/360);
		}
		
		var getRotationFromRadian  = function(radian) {
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

			if(isNumber(_self.rotation) && _self.rotation != _rotation){
				var radian = getRadianFromRotation(_self.rotation);
				if(isNumber(radian)){
					_radian = radian;
					_rotation  = getRotationFromRadian(radian);
				}
			}
			
			var halfViewPort	= _viewPortX / 2;
			var visionLength	= getHipotenuse(halfViewPort, _focalLength);
			var leftRadian		= Math.atan2(0, halfViewPort) + _radian;
			var rigthRadian		= Math.atan2(0, -halfViewPort)+ _radian;
			
			_pointLength		= getRotatedPoint(0, _focalLength,  _radian,     _cameraX, _cameraZ);
			var leftPoint		= getRotatedPoint(visionLength, 0,  leftRadian,  _cameraX, _cameraZ);
			var rigthPoint		= getRotatedPoint(visionLength, 0,  rigthRadian, _cameraX, _cameraZ);
			_visionRadian		= getVectorsRadian(leftPoint.x, leftPoint.y, _pointLength.x, _pointLength.y);
			
			_cameraX1 			= leftPoint.x; 
			_cameraY1 			= leftPoint.y;
			_cameraX2 			= rigthPoint.x;
			_cameraY2 			= rigthPoint.y;
			
			_slope				= (_cameraY2 - _cameraY1) / (_cameraX2 - _cameraX1);
			_interceptorY		= _cameraY1 - _slope * _cameraX1;
		}
		
		var getRotatedPoint  = function(x, y, radian, originX, originY) {
			originX		= getDefaultValue(originX, 0);
			originY		= getDefaultValue(originY, 0);
			
			var finalX	= x * Math.cos(radian) - y * Math.sin(radian) + originX;
			var finalY	= x * Math.sin(radian) + y * Math.cos(radian) + originY;
			var point	= new Point(finalX, finalY);
			return point;
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