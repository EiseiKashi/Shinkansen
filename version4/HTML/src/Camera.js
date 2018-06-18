(function J3 (){
	var PI2/*Number*/     = Math.PI * 2;
	
	var _itemsList/*:Array*/     = new Array();
	var _callbacksList/*:Array*/ = new Array();
	
	var _radian/*Number*/       = 0;
	var _focalLength/*Number*/  = 300;
	
	var _offsetX/*Number*/      = 0;
	var _offsetY/*Number*/      = 0;
	
	var _cameraX/*Number*/      = 0;
	var _cameraY/*Number*/      = 0;
	var _cameraZ/*Number*/      = 0;
	
	var _cameraX1/*Number*/     = -1;
	var _cameraX2/*Number*/     = 1;
	var _cameraY1/*Number*/     = 0;
	var _cameraY2/*Number*/     = 0;
	
	var _viewPortX/*Number*/;
	var _viewPortY/*Number*/;
	
	var _visionRadian/*Number*/;
	var _pointLength/*:Point*/;
	var _angle/*Number*/;
	var _slope/*Number*/;
	var _interceptorY/*Number*/;
	
	//----------------------------------------------
	// INTERFACE
	//----------------------------------------------
	
	this.getViewPortX = function ()/*Number*/ {return _viewPortX;}
	this.setViewPortX = function (value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_viewPortX = value;
			render();
		}
		return _viewPortX;
	}
	
	this.getViewPortY = function ()/*Number*/ {return _viewPortY;}
	this.setViewPortY = function (value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_viewPortY = value;
			render();
		}
		return _viewPortY;
	}
	
	this.addCallback = function (callback/*:Function*/)/*:void*/ {
		if (_callbacksList.indexOf(callback) < 0) {
			_callbacksList.push(callback);
		}
	}
	
	this.removeCallBack = function(callback/*:Function*/)/*:void*/ {
		var index/*:int*/ = _callbacksList.indexOf(callback);
		if (index < 0) {
			return;
		}
		_callbacksList.splice(index, 1);
	}
	
	this.addItem = function(item/*:Sprite3D*/)/*:void*/ {
		_itemsList.push(item);
		render();
	}
	
	this.removeItem = function (item/*:Sprite3D*/)/*:void*/ {
		_itemsList.push(item);
		var index/*:int*/ = _itemsList.indexOf(item);
		if (index < 0) {
			return;
		}
		_itemsList.splice(index, 1);
		render();
	}
	
	//----------------------------------------------
	// Desplazamiento de camera
	this.getOffsetY = function ()/*Number*/ {return _offsetY;}
	this.setOffsetY = function (value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_offsetY = value;
			render();
		}
		return _offsetY;
	}
	
	this.getOffsetX = function ()/*Number*/ {return _offsetX;}
	this.setOffsetX = function (value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_offsetX = value;
			render();
		}
		return _offsetX;
	}
	
	this.getCameraX = function()/*:Number*/{return _cameraX;}
	this.setCameraX = function(value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_cameraX = value;
			render();
		}
		return _cameraX;
	}
	
	this.getCameraY = function()/*:Number*/{return _cameraY;}
	this.setCameraY = function(value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_cameraY = value;
			render();
		}
		return _cameraY;
	}
	
	this.getCameraZ = function()/*Number*/ {return _cameraZ;}
	this.setCameraZ = function(value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_cameraZ = value
			render();
		}
		return _cameraZ;
	}
	
	this.getAngle = function()/*Number*/ {return _angle;}
	this.setAngle = function(value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			setRadian(getRadianFromAngle(value));
			_angle = value; 
			render();
		}
		return _angle;
	}
	
	this.getRadian = function()/*Number*/ {return _radian;}
	this.setRadian = function(value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_radian = value;
			_angle  = getAngleFromRadian(_radian);
			render();
		}
		return _radian;
	}
	
	this.getFocalLength = function()/*Number*/ {return _focalLength;}
	this.setFocalLength = function(value/*Number*/)/*:void*/ {
		if(!isNaN(value)){
			_focalLength = value;
			render();
		}
		return _focalLength;
	}
	
	//----------------------------------------------
	// Helpers
	//----------------------------------------------
	
	//----------------------------------------------
	// Render!!!
	function render()/*:void*/ {
		var length/*:uint*/ = _itemsList.length;
		if(0 == length){
			// Early return
			return;
		}
		
		updateProperties();
		
		var dx/*Number*/;
		var dy/*Number*/;
		var z/*Number*/;
		var item/*:Sprite3D*/;
		var itemX/*:Number*/;
		var itemY/*:Number*/;
		var scaleFactor/*Number*/;
		var name/*:String*/
		var viewName/*:String*/;
		var isInRange/*:Boolean*/
		var index/*:uint*/  = 0;
		
		while (index < length) {
			item                    = _itemsList[index];
			itemX                   = item.getX()
			itemY                   = item.getZ()
			
 			var intersect/*:Point*/ =  getPointIntersection(itemX, itemY);
			
			isInRange = checkIsInRange(itemX, itemY);
			
			if (!isInRange) {
				item.setVisible(false);
				item.setScale(0);
				index++;
				continue;
			}
			
			dx = itemX - _cameraX;
			dy = itemY - _cameraZ;
			
			var itemRadian/*Number*/ = Math.atan2(dy,dx) + _radian;
			var radius/*Number*/     = getHipotenuse(dx, dy);
			
			z              = getPointDistance(itemX, itemY, 
			                                  _cameraX1, _cameraY1,
                                              _cameraX2, _cameraY2);
			
			scaleFactor    = _focalLength / (z);
			
			item.visible   = scaleFactor > 0 ;
			
			var renderedX = (Math.cos(itemRadian) * radius * scaleFactor) + _offsetX;
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
		var callback/*:Function*/;
		var indexCallback/*:uint*/ = 0;
		var callbacksLenght/*:uint*/ = _callbacksList.length;
		var lastIndex/*:int*/ = length-1;
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
	
	function getHipotenuse(dx/*Number*/, dy/*Number*/)/*Number*/ {
		var hypotenuse/*Number*/ =  Math.sqrt(dx * dx + dy * dy);
		return hypotenuse;
	}
	
	function getRadianFromAngle (degree/*Number*/)/*Number*/{
		return degree * (PI2/360);
	}
	
	function getAngleFromRadian(radian/*Number*/)/*Number*/ {
		return radian * (360/PI2);
	}
	
	function updateProperties()/*:void*/ {
		var halfViewPort/*Number*/ = _viewPortX / 2;
		var visionLength/*Number*/ = getHipotenuse(halfViewPort, _focalLength);
		
		var leftRadian/*Number*/   = Math.atan2(0, halfViewPort) + _radian;
		var rigthRadian/*Number*/  = Math.atan2(0, -halfViewPort)+ _radian;
		
		_pointLength            = getRotatedPoint(0, _focalLength,  _radian,     _cameraX, _cameraZ);
		var leftPoint/*:Point*/     = getRotatedPoint(visionLength, 0,  leftRadian,  _cameraX, _cameraZ);
		var rigthPoint/*:Point*/    = getRotatedPoint(visionLength, 0,  rigthRadian, _cameraX, _cameraZ);
		
		_visionRadian           = getVectorsRadian(leftPoint.x, leftPoint.y, _pointLength.x, _pointLength.y);
		
		_cameraX1 = leftPoint.x; 
		_cameraY1 = leftPoint.y;
		_cameraX2 = rigthPoint.x;
		_cameraY2 = rigthPoint.y;
		
		_slope = (_cameraY2 - _cameraY1) / (_cameraX2 - _cameraX1);
		
		_interceptorY  = _cameraY1 - _slope * _cameraX1;
	}
	
	function getRotatedPoint(x/*Number*/, y/*Number*/, radian/*Number*/, originX/*Number=0*/, originY/*Number=0*/)/*:Point*/ {
		originX = getDefaultValue(originX, 0);
		originY = getDefaultValue(originY, 0);
		
		var finalX/*Number*/ = x * Math.cos(radian) - y * Math.sin(radian) + originX;
		var finalY/*Number*/ = x * Math.sin(radian) + y * Math.cos(radian) + originY;
		var point/*:Point*/ = new Point(finalX, finalY);
		return point;
	}
	
	function checkIsInRange(x/*Number*/, y/*Number*/)/*:Boolean*/ {
		var radian/*Number*/ = getVectorsRadian(_pointLength.x, _pointLength.y, x, y);
		return _visionRadian > radian;
	}
	
	function getVectorsRadian(point1X/*Number*/, point1Y/*Number*/,
									  point2X/*Number*/, point2Y/*Number*/ )/*Number*/ {
		point1X -= _cameraX;
		point1Y -= _cameraZ;
		
		point2X -= _cameraX;
		point2Y -= _cameraZ;
		
		var scalar/*Number*/ =  point1X * point2X + point1Y * point2Y;
		var mod1/*Number*/   = getHipotenuse(point1X, point1Y);
		var mod2/*Number*/   = getHipotenuse(point2X, point2Y);
		var mods/*Number*/   = (mod1 * mod2); 
		
		var radianToCalculate/*:Number*/ = mods == 0 ? 0 : scalar / mods;
		var radian/*:Number*/= Math.acos(radianToCalculate);
		if(isNaN(radian)){
			return;
		}
		
		while (isNaN(radian)) {
			radian = Math.acos(int(radianToCalculate * 10) / 10);
		}
		return radian;
	}
	
	function getPointDistance(itemX/*Number*/, itemY/*Number*/, 
									  x1/*Number*/, y1/*Number*/, x2/*Number*/, y2/*Number*/)/*Number*/ {
		var denominator/*Number*/ = Math.abs((y2 - y1) * itemX - (x2 - x1) * itemY + x2 * y1 - y2 * x1);
		var divisor/*Number*/     = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 -x1, 2));
		return denominator / divisor;
		/*
		
		d = 	|A·Mx + B·My + C|
					√A2 + B2
					
		https://www.youtube.com/watch?v=bfZ57ESvFok
		
		*/
	}
	
	function getPointIntersection(itemX/*Number*/, itemY/*Number*/)/*:Point*/ {
		var m2/*Number*/ = -(1 / _slope);
		var b2/*Number*/  = itemY - m2 * itemX;
		var x2/*Number*/  = (b2-_interceptorY)/(_slope-m2);
		var y2/*Number*/  = (m2 * x2 + b2);
		return new Point(x2, y2);
	}
	
	function Point(x/*:Number*/, y/*:Number*/) {
		this.x = x;
		this.y = y;
	}
	
	function getDefaultValue(value, defaultValue)/*:void*/ {
		var finalValue = typeof(value) === "undefined" ? defaultValue : value;
		return finalValue;
	}
	
	window.Camera = this;

})()


window.Sprite3D = function (view/*:MovieClip=null*/, 
						    x/*:Number=0*/, 
							y/*:Number=0*/, 
							z/*:Number=0*/) {

	var _view = null != view ? view : null;
	var _x    = isNaN(x) ? 0 : x;
	var _y    = isNaN(y) ? 0 : y;
	var _z    = isNaN(z) ? 0 : z;
	
	var _renderedX/*:Number*/ = 0;
	var _renderedY/*:Number*/ = 0;
	var _renderedZ/*:Number*/ = 0;
	
	var _visible/*:Boolean*/  = true;
	
	var _scale/*:Number*/     = 0;
	
	this.getId = function()/*:String*/ {
		return _view != null ? _view.name : null;
	}
	
	this.getView = function()/*:MovieClip*/ {return _view;}
	this.setView = function(value/*:MovieClip*/)/*:void*/ {
		if (null != value) {
			_view = value;
		}
		return _view;
	}
	
	this.getX = function()/*:Number*/ {return _x;}
	this.setX = function(value/*:Number*/)/*:void*/ {
		if (!isNaN(value)) {
			_x = value;
		}
		return _x;
	}
	
	this.getY = function()/*:Number*/ {return _y;}
	this.setY = function(value/*:Number*/)/*:void*/ {
		if (!isNaN(value)) {
			_y = value;
		}
		return _y;
	}
	
	this.getZ = function()/*:Number*/ {return _z;}
	this.setZ = function(value/*:Number*/)/*:void*/ {
		if (!isNaN(value)) {
			_z = value;
		}
		return _z;
	}
	
	this.getRenderedX = function()/*:Number*/ {return _renderedX;}
	this.setRenderedX = function(value/*:Number*/)/*:void*/ {
		if (!isNaN(value)) {
			_renderedX = value;
		}
		return _renderedX;
	}
	
	this.getRenderedY = function()/*:Number*/ {return _renderedY;}
	this.setRenderedY = function(value/*:Number*/)/*:void*/ {
		if (!isNaN(value)) {
			_renderedY = value;
		}
		return _renderedY;
	}
	
	this.getRenderedZ = function()/*:Number*/ {return _renderedZ;}
	this.setRenderedZ = function(value/*:Number*/)/*:void*/ {
		if (!isNaN(value)) {
			_renderedZ = value;
		}
		return _renderedZ;
	}
	
	this.getScale = function()/*:Number*/ {return _scale;}
	this.setScale = function(value/*:Number*/)/*:void*/ {
		if(!isNaN(value)){
			_scale = value;
		}
		return _scale;
	}
	
	this.getVisible = function()/*:Boolean*/ {return _visible;}
	this.setVisible = function(value/*:Boolean*/)/*:void*/ {
		_visible = value;
	}
}