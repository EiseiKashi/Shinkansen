function Shinkansen (){
	var _self			= this;
	var PI2				= Math.PI * 2;
	
	var _itemsList		= new Array();
	var _callbacksList	= new Array();
	
	var _radian			= 0;
	var _focalLength	= 300;
	
	var _offsetX		= 0;
	var _offsetY		= 0;
	
	var _cameraX		= 0;
	var _cameraY		= 0;
	var _cameraZ		= 0;
	
	var _cameraX1		= -1;
	var _cameraX2		= 1;
	var _cameraY1		= 0;
	var _cameraY2		= 0;
	
	var _viewPortX;
	var _viewPortY;
	
	var _visionRadian;
	var _pointLength;
	var _angle;
	var _slope;
	var _interceptorY;
	
	//----------------------------------------------
	// INTERFACE
	//----------------------------------------------
	
	this.getViewPortX = function () {return _viewPortX;}
	this.setViewPortX = function (value) {
		if(!isNaN(value)){
			_viewPortX = value;
			_self.render();
		}
		return _viewPortX;
	}
	
	this.getViewPortY = function () {return _viewPortY;}
	this.setViewPortY = function (value) {
		if(!isNaN(value)){
			_viewPortY = value;
			_self.render();
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
	
	this.addItem = function(item) {
		_itemsList.push(item);
		_self.render();
	}
	
	this.removeItem = function (item) {
		_itemsList.push(item);
		var index = _itemsList.indexOf(item);
		if (index < 0) {
			return;
		}
		_itemsList.splice(index, 1);
		_self.render();
	}
	
	//----------------------------------------------
	// Desplazamiento de camera
	this.getOffsetY = function () {return _offsetY;}
	this.setOffsetY = function (value) {
		if(!isNaN(value)){
			_offsetY = value;
			_self.render();
		}
		return _offsetY;
	}
	
	this.getOffsetX = function () {return _offsetX;}
	this.setOffsetX = function (value) {
		if(!isNaN(value)){
			_offsetX = value;
			_self.render();
		}
		return _offsetX;
	}
	
	this.getCameraX = function(){return _cameraX;}
	this.setCameraX = function(value) {
		if(!isNaN(value)){
			_cameraX = value;
			_self.render();
		}
		return _cameraX;
	}
	
	this.getCameraY = function(){return _cameraY;}
	this.setCameraY = function(value) {
		if(!isNaN(value)){
			_cameraY = value;
			_self.render();
		}
		return _cameraY;
	}
	
	this.getCameraZ = function() {return _cameraZ;}
	this.setCameraZ = function(value) {
		if(!isNaN(value)){
			_cameraZ = value
			_self.render();
		}
		return _cameraZ;
	}
	
	this.getAngle = function() {return _angle;}
	this.setAngle = function(value) {
		if(!isNaN(value)){
			_self.setRadian(getRadianFromAngle(value));
			_angle = value; 
			_self.render();
		}
		return _angle;
	}
	
	this.getRadian = function() {return _radian;}
	this.setRadian = function(value) {
		if(!isNaN(value)){
			_radian = value;
			_angle  = getAngleFromRadian(_radian);
			_self.render();
		}
		return _radian;
	}
	
	this.getFocalLength = function() {return _focalLength;}
	this.setFocalLength = function(value) {
		if(!isNaN(value)){
			_focalLength = value;
			_self.render();
		}
		return _focalLength;
	}
	
	this.render = function() {
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
	}
	//----------------------------------------------
	// Helpers
	//----------------------------------------------
	
	var getHipotenuse  = function(dx, dy) {
		var hypotenuse =  Math.sqrt(dx * dx + dy * dy);
		return hypotenuse;
	}
	
	var getRadianFromAngle  = function(degree){
		return degree * (PI2/360);
	}
	
	var getAngleFromRadian  = function(radian) {
		return radian * (360/PI2);
	}
	
	var updateProperties  = function() {
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
}


window.Sprite3D = function (view, x, y, z) {
	var _view		= null != view ? view : null;
	var _x			= isNaN(x) ? 0 : x;
	var _y			= isNaN(y) ? 0 : y;
	var _z			= isNaN(z) ? 0 : z;
	
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
		if (!isNaN(value)) {
			_x = value;
		}
		return _x;
	}
	
	this.getY = function() {return _y;}
	this.setY = function(value) {
		if (!isNaN(value)) {
			_y = value;
		}
		return _y;
	}
	
	this.getZ = function() {return _z;}
	this.setZ = function(value) {
		if (!isNaN(value)) {
			_z = value;
		}
		return _z;
	}
	
	this.getRenderedX = function() {return _renderedX;}
	this.setRenderedX = function(value) {
		if (!isNaN(value)) {
			_renderedX = value;
		}
		return _renderedX;
	}
	
	this.getRenderedY = function() {return _renderedY;}
	this.setRenderedY = function(value) {
		if (!isNaN(value)) {
			_renderedY = value;
		}
		return _renderedY;
	}
	
	this.getRenderedZ = function() {return _renderedZ;}
	this.setRenderedZ = function(value) {
		if (!isNaN(value)) {
			_renderedZ = value;
		}
		return _renderedZ;
	}
	
	this.getScale = function() {return _scale;}
	this.setScale = function(value) {
		if(!isNaN(value)){
			_scale = value;
		}
		return _scale;
	}
	
	this.getVisible = function() {return _visible;}
	this.setVisible = function(value) {
		_visible = value;
	}
}