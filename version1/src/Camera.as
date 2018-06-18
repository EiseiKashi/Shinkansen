package  {
	import flash.display.Graphics;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.geom.Point;

	public class Camera {
		public static var PI2:Number = Math.PI * 2;
		
		private var _fixCamera:CameraAsset   = new CameraAsset();
		private var _rayContainer:MovieClip  = new MovieClip();
		private var _render:Function;
		
		private var _itemsList:Array      = new Array();
		private var _map:MovieClip        = new MovieClip();
		
		private var _radian:Number        = 0;
		private var _focalLength:Number   = 300;
		
		private var _offsetX:Number       = 0;
		private var _offsetY:Number       = 0;
		
		private var _cameraX:Number       = 0;
		private var _cameraY:Number       = 0;
		private var _cameraZ:Number       = 0;
		
		private var _cameraX1:Number      = -1;
		private var _cameraX2:Number      = 1;
		private var _cameraY1:Number      = 0;
		private var _cameraY2:Number      = 0;
		
		private var _viewPortX:Number;
		private var _viewPortY:Number;
		
		private var _focalLengthX:Number;
		private var _focalLengthY:Number;
		private var _visionRadian:Number;
		private var _pointLength:Point;
		private var _angle:Number;
		private var _deltaX:Number;
		private var _deltaY:Number;
		private var _slope:Number;
		private var _interceptorY:Number;
		
		public function Camera() {
			_render      = render1;
			updateProperties();
			_map.addChild(new GridAsset());
			_map.addChild(_rayContainer);
			_map.addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		}
		
		private function onAddedToStage(e:Event):void {
			_map.removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			updateProperties();
		}
		
		public function addItem(mc:MovieClip, x:Number, y:Number, z:Number):void {
			var item:Sprite3D = new Sprite3D(mc.name);
				item.x = x;
				item.y = y;
				item.z = z;
				item.view = mc;
			_itemsList.push(item);
			
			_itemsList.sortOn("z", Array.DESCENDING | Array.NUMERIC); 
			
			var point:PointAsset
			    point             = new PointAsset();
				point.name        = item.view.name;
				point.x           = item.x;
				point.y           = item.z;
				point.indexT.text = item.id;
				point.alpha       = 0.5;
			_map.addChild(point);
			
			    point             = new PointAsset();
				point.name        = item.view.name;
				point.x           = item.x;
				point.y           = item.z;
				point.indexT.text = item.id;
			_map.addChild(point);
			
			_render();
		}
		
		//----------------------------------------------
		// Desplazamiento de camera
		public function get offsetY():Number {
			return _offsetY;
		}
		public function set offsetY(value:Number):void {
			_offsetY = value;
			_render();
		}
		public function get offsetX():Number {
			return _offsetX;
		}
		public function set offsetX(value:Number):void {
			_offsetX = value;
			_render();
		}
		
		//----------------------------------------------
		public function get cameraX(): Number{
			return _cameraX;
		}
		public function set cameraX(value:Number):void {
			_cameraX = value;
			_render();
		}
		
		public function get cameraY(): Number{
			return _cameraY;
		}
		public function set cameraY(value:Number):void {
			_cameraY = value;
			_render();
		}
		
		public function set cameraZ(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			_cameraZ = value
			_render();
		}
		public function get cameraZ():Number {
			return _cameraZ;
		}
		
		public function set angle(value:Number):void {
			radian = getRadian(value);
			_angle = value; 
			_render();
		}
		public function get angle():Number {
			return _angle;
		}
		
		public function set radian(value:Number):void {
			_radian = value;
			_angle  = getAngle(_radian);
			_render();
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
			
			_render();
		}
		
		//----------------------------------------------
		
		public function get viewPortX():Number {
			return _viewPortX;
		}
		public function set viewPortX(value:Number):void {
			_viewPortX = value;
			_render();
		}
		
		public function get viewPortY():Number {
			return _viewPortY;
		}
		public function set viewPortY(value:Number):void {
			_viewPortY = value;
			_render();
		}
		
		//----------------------------------------------
		// Render!!!
		private function render1(showLog:Boolean=false):void {
			
			updateProperties();
			
			var view:MovieClip;
			var dx:Number;
			var dy:Number;
			var x:Number;
			var y:Number;
			var z:Number;
			var item:Sprite3D;
			var point:MovieClip;
			var scaleFactor:Number;
			var name:String
			var viewName:String;
			var isInRange:Boolean
			var index:uint  = 0;
			var length:uint = _itemsList.length;
			
			clearDraw(_map);
			while (0 < _rayContainer.numChildren) {
				_rayContainer.removeChildAt(0);
			}
			while (index < length) {
				item    = _itemsList[index];
				view    = item.view;
				name    = view.name;
				point   = MovieClip(_map.getChildByName(name));
				
				var intersection:Point =  getPointIntersection(item.x, item.z);
				var inter:Intersection = new Intersection();
				
				_rayContainer.addChild(inter);
				isInRange = checkIsInRange(point.x, point.y);
				if(isInRange){
					drawLine(_rayContainer, point.x, point.y, intersection.x, intersection.y, 0xFF00FF, 2);
				}
				
				dx      = item.x - _cameraX;
				dy      = item.z - _cameraZ;
				
				var itemRadian:Number = Math.atan2(dy,dx) + _radian;
				var radius:Number     = getHipotenuse(dx, dy);
				
				x = Math.cos(itemRadian) * radius;
				y = item.y - _cameraY;
				z = getPointDistance(item.x, item.z, _cameraX1, _cameraY1, _cameraX2, _cameraY2);
				inter.x = intersection.x;
				inter.y = intersection.y;
				
				item.cameraZ = z;
				scaleFactor  = _focalLength / (z);
				
				if(scaleFactor > 0) {
					view.visible = true;
					view.x       = (x * scaleFactor) + _offsetX;
					view.y       = (y * scaleFactor) + _offsetY;
					view.scaleX  = scaleFactor;
					view.scaleY  = scaleFactor;
					
					view.alpha   = isInRange ? scaleFactor + 0.5 : 0;
					view["scaleT"].text  = String(int(scaleFactor * 100));
				}else {
					view.visible = false;
				}
				
				index++
			}
			trace("------------");
			_itemsList.sortOn("cameraZ", Array.DESCENDING | Array.NUMERIC);
			
			index  = 0;
			length = _itemsList.length; 
			while (index < length) {
				item    = _itemsList[index];
				view    = item.view;
				view.parent.setChildIndex(view, index);
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
			
			_focalLengthX           = _pointLength.x;
			_focalLengthY           = _pointLength.y;
			
			_visionRadian           = getVectorsRadian(leftPoint.x, leftPoint.y, _pointLength.x, _pointLength.y);
			
			clearDraw(_rayContainer);
			_cameraX1 = leftPoint.x; 
			_cameraY1 = leftPoint.y;
			_cameraX2 = rigthPoint.x;
			_cameraY2 = rigthPoint.y;
			
			_deltaX   = _cameraX2 - _cameraX1;
			_deltaY   = _cameraY2 - _cameraY1;
			
			_slope = _deltaY / _deltaX;
			
			_interceptorY  = _cameraY1 - _slope * _cameraX1;
			
			drawLine(_rayContainer, _pointLength.x, _pointLength.y, _cameraX, _cameraZ, 0xFFFF00, 5);
			drawLine(_rayContainer, leftPoint.x,   leftPoint.y,     _cameraX, _cameraZ, 0x00CCFF, 5);
			drawLine(_rayContainer, rigthPoint.x,  rigthPoint.y,    _cameraX, _cameraZ, 0x00CCFF, 5);
			drawLine(_rayContainer, rigthPoint.x,  rigthPoint.y,   leftPoint.x,   leftPoint.y, 0xFF00FF, 10);
			
			_map.addChild(_fixCamera);
			_fixCamera.x            = _cameraX;
			_fixCamera.y            = _cameraZ;
			_fixCamera.rotation     = getAngle(_radian);
			
			_fixCamera.lens.width   = 0;
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
		
		//----------------------------------------------
		// Debugger
		public function get map():MovieClip {
			return _map;
		}
		
		private function drawLine(mc:MovieClip, originX:Number, originY:Number, destinyX:Number, destinyY:Number, color:Number=0xFF0000, thickness:Number=1, clear:Boolean=false):void {
			var graphics:Graphics = mc.graphics;
			if (clear) {
				graphics.clear();
			}
			graphics.lineStyle(thickness, color);
			graphics.moveTo(originX,      originY);
			graphics.lineTo(originX,      originY);
			graphics.lineTo(destinyX,     destinyY)
		}
		
		private function clearDraw(mc:MovieClip):void {
			mc.graphics.clear();
		}
		
		private function getPointDistance(itemX:Number, itemY:Number, 
										  x1:Number, y1:Number, x2:Number, y2:Number):Number {
			var denominator:Number = Math.abs((y2 - y1) * itemX - (x2 - x1) * itemY + x2 * y1 - y2 * x1);
			var divisor:Number     = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 -x1, 2));
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