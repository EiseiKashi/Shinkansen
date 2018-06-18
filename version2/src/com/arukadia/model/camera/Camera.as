package com.arukadia.model.camera {
	import flash.geom.Point;

	public class Camera {
		public static var PI2:Number     = Math.PI * 2;
		
		private var _itemsList:Array     = new Array();
		private var _callbacksList:Array = new Array();
		
		private var _radian:Number       = 0;
		private var _focalLength:Number  = 300;
		
		private var _offsetX:Number      = 0;
		private var _offsetY:Number      = 0;
		
		private var _cameraX:Number      = 0;
		private var _cameraY:Number      = 0;
		private var _cameraZ:Number      = 0;
		
		private var _cameraX1:Number     = -1;
		private var _cameraX2:Number     = 1;
		private var _cameraY1:Number     = 0;
		private var _cameraY2:Number     = 0;
		
		private var _viewPortX:Number;
		private var _viewPortY:Number;
		
		private var _visionRadian:Number;
		private var _pointLength:Point;
		private var _angle:Number;
		private var _slope:Number;
		private var _interceptorY:Number;
		
		public function Camera() {
			updateProperties();
		}
		
		public function addItem(item:Sprite3D):void {
			_itemsList.push(item);
			render();
		}
		
		public function removeItem(item:Sprite3D):void {
			_itemsList.push(item);
			var index:int = _itemsList.indexOf(item);
			if (index < 0) {
				return;
			}
			_itemsList.splice(index, 1);
			render();
		}
		
		public function addCallBack(callback:Function):void {
			if (_callbacksList.indexOf(callback) < 0) {
				_callbacksList.push(callback);
			}
		}
		
		public function removeCallBack(callback:Function):void {
			var index:int = _callbacksList.indexOf(callback);
			if (index < 0) {
				return;
			}
			_callbacksList.splice(index, 1);
		}
		
		//----------------------------------------------
		// Desplazamiento de camera
		public function get offsetY():Number {
			return _offsetY;
		}
		public function set offsetY(value:Number):void {
			_offsetY = value;
			render();
		}
		public function get offsetX():Number {
			return _offsetX;
		}
		public function set offsetX(value:Number):void {
			_offsetX = value;
			render();
		}
		
		//----------------------------------------------
		public function get cameraX(): Number{
			return _cameraX;
		}
		public function set cameraX(value:Number):void {
			_cameraX = value;
			render();
		}
		
		public function get cameraY(): Number{
			return _cameraY;
		}
		public function set cameraY(value:Number):void {
			_cameraY = value;
			render();
		}
		
		public function set cameraZ(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			_cameraZ = value
			render();
		}
		public function get cameraZ():Number {
			return _cameraZ;
		}
		
		public function set angle(value:Number):void {
			radian = getRadian(value);
			_angle = value; 
			render();
		}
		public function get angle():Number {
			return _angle;
		}
		
		public function set radian(value:Number):void {
			_radian = value;
			_angle  = getAngle(_radian);
			render();
		}
		public function get radian():Number {
			return _radian;
		}
		
		public function get focalLength():Number {
			return _focalLength;
		}
		public function set focalLength(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			_focalLength = value;
			
			render();
		}
		
		//----------------------------------------------
		
		public function get viewPortX():Number {
			return _viewPortX;
		}
		public function set viewPortX(value:Number):void {
			_viewPortX = value;
			render();
		}
		
		public function get viewPortY():Number {
			return _viewPortY;
		}
		public function set viewPortY(value:Number):void {
			_viewPortY = value;
			render();
		}
		
		//----------------------------------------------
		// Render!!!
		public function render():void {
			
			updateProperties();
			
			var dx:Number;
			var dy:Number;
			var x:Number;
			var y:Number;
			var z:Number;
			var item:Sprite3D;
			var scaleFactor:Number;
			var name:String
			var viewName:String;
			var isInRange:Boolean
			var index:uint  = 0;
			var length:uint = _itemsList.length;
			
			while (index < length) {
				item                = _itemsList[index];
				var intersect:Point =  getPointIntersection(item.x, item.z);
				
				isInRange = checkIsInRange(item.x, item.z);
				
				if (!isInRange) {
					item.visible = false;
					index++;
					continue;
				}
				
				dx = item.x - _cameraX;
				dy = item.z - _cameraZ;
				
				var itemRadian:Number = Math.atan2(dy,dx) + _radian;
				var radius:Number     = getHipotenuse(dx, dy);
				
				z              = getPointDistance(item.x, item.z, _cameraX1, _cameraY1, _cameraX2, _cameraY2);
				scaleFactor    = _focalLength / (z);
				
				item.visible   = scaleFactor > 0 ;
				
				item.renderedX = (Math.cos(itemRadian) * radius * scaleFactor) + _offsetX;
				item.renderedY = ((item.y - _cameraY) * scaleFactor) + _offsetY;
				item.renderedZ = z;
				item.scale     = scaleFactor;
				
				index++
			}
			
			_itemsList.sortOn("renderedZ", Array.DESCENDING | Array.NUMERIC);
			
			index = 0;
			var callback:Function;
			var indexCallback:uint = 0;
			var callbacksLenght:uint = _callbacksList.length;
			var lastIndex:int = length-1;
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
		private function getHipotenuse(dx:Number, dy:Number):Number {
			var hypotenuse:Number =  Math.sqrt(dx * dx + dy * dy);
			return hypotenuse;
		}
		
		private function getRadian (degree:Number):Number{
			return degree * (PI2/360);
		}
		
		private function getAngle(radian:Number):Number {
			return radian * (360/PI2);
		}
		
		private function updateProperties():void {
			var halfViewPort:Number = _viewPortX / 2;
			var visionLength:Number = getHipotenuse(halfViewPort, _focalLength);
			
			var leftRadian:Number   = Math.atan2(0, halfViewPort) + _radian;
			var rigthRadian:Number  = Math.atan2(0, -halfViewPort)+ _radian;
			
			_pointLength            = getRotatedPoint(0, _focalLength,  _radian,     _cameraX, _cameraZ);
			var leftPoint:Point     = getRotatedPoint(visionLength, 0,  leftRadian,  _cameraX, _cameraZ);
			var rigthPoint:Point    = getRotatedPoint(visionLength, 0,  rigthRadian, _cameraX, _cameraZ);
			
			_visionRadian           = getVectorsRadian(leftPoint.x, leftPoint.y, _pointLength.x, _pointLength.y);
			
			_cameraX1 = leftPoint.x; 
			_cameraY1 = leftPoint.y;
			_cameraX2 = rigthPoint.x;
			_cameraY2 = rigthPoint.y;
			
			_slope = (_cameraY2 - _cameraY1) / (_cameraX2 - _cameraX1);
			
			_interceptorY  = _cameraY1 - _slope * _cameraX1;
		}
		
		private function getRotatedPoint(x:Number, y:Number, radian:Number, originX:Number = 0, originY:Number = 0):Point {
			var finalX:Number = x * Math.cos(radian) - y * Math.sin(radian) + originX;
			var finalY:Number = x * Math.sin(radian) + y * Math.cos(radian) + originY;
			var point:Point = new Point(finalX, finalY);
			return point;
		}
		
		private function checkIsInRange(x:Number, y:Number):Boolean {
			var radian:Number = getVectorsRadian(_pointLength.x, _pointLength.y, x, y);
			return _visionRadian > radian;
		}
		
		private function getVectorsRadian(point1X:Number, point1Y:Number,
										  point2X:Number, point2Y:Number ):Number {
			point1X -= _cameraX;
			point1Y -= _cameraZ;
			
			point2X -= _cameraX;
			point2Y -= _cameraZ;
			
			var scalar:Number =  point1X * point2X + point1Y * point2Y;
			var mod1:Number   = getHipotenuse(point1X, point1Y);
			var mod2:Number   = getHipotenuse(point2X, point2Y);
			var mods:Number   = (mod1 * mod2); 
			
			var radianToCalculate:Number = scalar / mods;
			var radian:Number = Math.acos(radianToCalculate);
			
			while (isNaN(radian)) {
				radian = Math.acos(int(radianToCalculate * 10) / 10);
			}
			return radian;
		}
		
		private function getPointDistance(itemX:Number, itemY:Number, 
										  x1:Number, y1:Number, x2:Number, y2:Number):Number {
			var denominator:Number = Math.abs((y2 - y1) * itemX - (x2 - x1) * itemY + x2 * y1 - y2 * x1);
			var divisor:Number     = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 -x1, 2));
			trace("denominator: ", denominator);
			trace("divisor:", divisor )
			var distance:Number = 
			return denominator / divisor;
			/*
			
			d = 	|A·Mx + B·My + C|
						√A2 + B2
						
			https://www.youtube.com/watch?v=bfZ57ESvFok
			
			*/
		}
		
		private function getPointIntersection(itemX:Number, itemY:Number):Point {
			var m2:Number = -(1 / _slope);
			var b2:Number  = itemY - m2 * itemX;
			var x2:Number  = (b2-_interceptorY)/(_slope-m2);
			var y2:Number  = (m2 * x2 + b2);
			return new Point(x2, y2);
		}
		
	}
}