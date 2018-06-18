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
	
	function Camera() {
		updateProperties();
	}
	
	function addItem(item/*:Sprite3D*/)/*:void*/ {
		_itemsList.push(item);
		render();
	}
	
	function removeItem(item/*:Sprite3D*/)/*:void*/ {
		_itemsList.push(item);
		var index/*:int*/ = _itemsList.indexOf(item);
		if (index < 0) {
			return;
		}
		_itemsList.splice(index, 1);
		render();
	}
	
	function addCallBack(callback/*:Function*/)/*:void*/ {
		if (_callbacksList.indexOf(callback) < 0) {
			_callbacksList.push(callback);
		}
	}
	
	function removeCallBack(callback/*:Function*/)/*:void*/ {
		var index/*:int*/ = _callbacksList.indexOf(callback);
		if (index < 0) {
			return;
		}
		_callbacksList.splice(index, 1);
	}
	
	//----------------------------------------------
	// Desplazamiento de camera
	function getOffsetY()/*Number*/ {
		return _offsetY;
	}
	function setOffsetY(value/*Number*/)/*:void*/ {
		_offsetY = value;
		render();
	}
	function getOffsetX()/*Number*/ {
		return _offsetX;
	}
	function setOffsetX(value/*Number*/)/*:void*/ {
		_offsetX = value;
		render();
	}
	
	//----------------------------------------------
	function getCameraX()/*:Number*/{
		return _cameraX;
	}
	function setCameraX(value/*Number*/)/*:void*/ {
		_cameraX = value;
		render();
	}
	
	function getCameraY()/*:Number*/{
		return _cameraY;
	}
	function setCameraY(value/*Number*/)/*:void*/ {
		_cameraY = value;
		render();
	}
	
	function setCameraZ(value/*Number*/)/*:void*/ {
		if (isNaN(value)) {
			return;
		}
		_cameraZ = value
		render();
	}
	function getCameraZ()/*Number*/ {
		return _cameraZ;
	}
	
	function setAngle(value/*Number*/)/*:void*/ {
		radian = getRadianFromAngle(value);
		_angle = value; 
		render();
	}
	function getAngle()/*Number*/ {
		return _angle;
	}
	
	function setRadian(value/*Number*/)/*:void*/ {
		_radian = value;
		_angle  = getAngleFromRadian(_radian);
		render();
	}
	function getRadian()/*Number*/ {
		return _radian;
	}
	
	function getFocalLength()/*Number*/ {
		return _focalLength;
	}
	function setFocalLength(value/*Number*/)/*:void*/ {
		if (isNaN(value)) {
			return;
		}
		_focalLength = value;
		
		render();
	}
	
	//----------------------------------------------
	
	function getViewPortX()/*Number*/ {
		return _viewPortX;
	}
	function setViewPortX(value/*Number*/)/*:void*/ {
		_viewPortX = value;
		render();
	}
	
	function getViewPortY()/*Number*/ {
		return _viewPortY;
	}
	function setViewPortY(value/*Number*/)/*:void*/ {
		_viewPortY = value;
		render();
	}
	
	//----------------------------------------------
	// Render!!!
	function render()/*:void*/ {
		
		updateProperties();
		
		var dx/*Number*/;
		var dy/*Number*/;
		var x/*Number*/;
		var y/*Number*/;
		var z/*Number*/;
		var item/*:Sprite3D*/;
		var scaleFactor/*Number*/;
		var name/*:String*/
		var viewName/*:String*/;
		var isInRange/*:Boolean*/
		var index/*:uint*/  = 0;
		var length/*:uint*/ = _itemsList.length;
		
		while (index < length) {
			item                = _itemsList[index];
			var intersect/*:Point*/ =  getPointIntersection(item.x, item.z);
			
			isInRange = checkIsInRange(item.x, item.z);
			
			if (!isInRange) {
				item.visible = false;
				index++;
				continue;
			}
			
			dx = item.x - _cameraX;
			dy = item.z - _cameraZ;
			
			var itemRadian/*Number*/ = Math.atan2(dy,dx) + _radian;
			var radius/*Number*/     = getHipotenuse(dx, dy);
			
			z              = getPointDistance(item.x, item.z, _cameraX1, _cameraY1, _cameraX2, _cameraY2);
			scaleFactor    = _focalLength / (z);
			
			item.visible   = scaleFactor > 0 ;
			
			item.renderedX = (Math.cos(itemRadian) * radius * scaleFactor) + _offsetX;
			item.renderedY = ((item.y - _cameraY) * scaleFactor) + _offsetY;
			item.renderedZ = z;
			item.scale     = scaleFactor;
			
			index++
		}
		
		//_itemsList.sortOn("renderedZ", Array.DESCENDING | Array.NUMERIC);
		_itemsList.sort(function(a, b){return b.renderedZ-a.renderedZ});
		
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
				callback(item, index, index == lastIndex);
				indexCallback++
			}
			index++
		}
	}
	
	//----------------------------------------------
	// Helpers
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