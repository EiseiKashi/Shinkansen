package  {
	import flash.display.Graphics;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.geom.Point;

	public class Camera1 {
		public static var PI2:Number = Math.PI * 2;
		
		private var _cameraAsset:CameraAsset = new CameraAsset();
		private var _fixCamera:CameraAsset   = new CameraAsset();
		private var _rayContainer:MovieClip  = new MovieClip();
		private var _render:Function;
		
		private var _itemsList:Array      = new Array();
		private var _map:MovieClip        = new MovieClip();
		private var _debugger:Debugger    = new Debugger();
		
		private var _depth:Number         = 0;
		private var _radian:Number        = 0;
		private var _radianFraction:Number;
		private var _focalLength:Number   = 300;
		
		private var _offsetX:Number       = 0;
		private var _offsetY:Number       = 0;
		private var _cameraX:Number       = 0;
		private var _cameraOffsetX:Number = 0;
		private var _cameraOffsetY:Number = 0;
		private var _cameraZ:Number       = 0;
		
		private var _viewPortX:Number;
		private var _viewPortY:Number;
		
		private var _rayLeftRadian:Number;
		private var _rayRigthRadian:Number;
		
		public function Camera1() {
			_render      = render1;
			focalLength = _focalLength;
			_map.addChild(new GridAsset());
			_map.addChild(_rayContainer);
		}
		
		public function addItem(item:Sprite3D):void {
			var name:String      = "id_" + String(_itemsList.length);
			_itemsList.push(item);
			
			_itemsList.sortOn("z", Array.DESCENDING | Array.NUMERIC); 
			
			var point:PointAsset = new PointAsset();
				point.name		 = name;
				point.x          = item.x;
				point.y          = item.z;
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
		}
		public function get offsetX():Number {
			return _offsetX;
		}
		public function set offsetX(value:Number):void {
			_offsetX = value;
		}
		
		//----------------------------------------------
		public function get cameraX(): Number{
			return _cameraX;
		}
		public function set cameraX(value:Number):void {
			_cameraX = value;
			_render();
		}
		
		public function set cameraZ(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			_depth = value;
			_cameraZ = value
			_render();
		}
		public function get cameraZ():Number {
			return _cameraZ;
		}
		
		public function set radian(value:Number):void {
			_radian = value;
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
			setVisionAngle();
		}
		
		public function get viewPortY():Number {
			return _viewPortY;
		}
		
		public function set viewPortY(value:Number):void {
			_viewPortY = value;
			setVisionAngle();
		}
		
		//----------------------------------------------
		// Render!!!
		private function render1():void {
			var view:MovieClip;
			var dx:Number;
			var dy:Number;
			var x:Number;
			var y:Number;
			var z:Number;
			var itemRadian:Number;
			var radius:Number;
			var item:Sprite3D;
			var point:MovieClip;
			var scaleFactor:Number;
			var name:String
			var index:uint  = 0;
			var length:uint = _itemsList.length;
			
			clearDraw(_map);
			
			while (index < length) {
				item    = _itemsList[index];
				view    = item.view;
				name    = "id_" + String(index);
				point   = MovieClip(_map.getChildByName(name));
				
				dx      = item.x - _cameraX;
				dy      = item.z - _cameraZ;
				
				itemRadian = Math.atan2(dy,dx) + _radian;
				radius     = getHipotenuse(dx, dy);
				
				x = Math.cos(itemRadian) * radius;
				y = item.y - _cameraOffsetY;
				z = Math.sin(itemRadian) * radius;
				
				drawLine(_map, _cameraX, _cameraZ, item.x, item.z, 0x99FF99);
				
				item.cameraZ = z;
				scaleFactor  = _focalLength / (_focalLength + z);
				
				if(scaleFactor > 0) {
					view.visible = true;
					view.x       = (x * scaleFactor) + _offsetX;
					view.y       = (y * scaleFactor) + _offsetY;
					view.scaleX  = scaleFactor;
					view.scaleY  = scaleFactor;
					view["foreground"].alpha   = scaleFactor;
					view["scaleT"].text  = String(int(scaleFactor*100));
				}else {
					view.visible = false;
				}
				
				index++
			}
			
			_itemsList.sortOn("cameraZ", Array.DESCENDING | Array.NUMERIC);
			
			index  = 0;
			length = _itemsList.length; 
			while (index < length) {
				item    = _itemsList[index];
				view    = item.view;
				view.parent.setChildIndex(view, index);
				index++
			}
			
			displayMap();
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
		
		public function getAngle(radian:Number):Number {
			return radian * (360/PI2);
		}
		
		//----------------------------------------------
		// Debugger
		public function get map():MovieClip {
			return _map;
		}
		
		private function displayMap():void {
			_map.addChild(_fixCamera);
			_fixCamera.addEventListener(Event.ADDED_TO_STAGE, onCameraAddedToStage);
			_fixCamera.x            = _cameraX;
			_fixCamera.y            = _cameraZ;
			_fixCamera.rotation     = getAngle(_radian);
			
			setVisionAngle();
		}
		
		private function onCameraAddedToStage(event:Event):void {
			_fixCamera.removeEventListener(Event.ADDED_TO_STAGE, onCameraAddedToStage);
			displayMap();
		}
		
		private function drawLine(mc:MovieClip, originX:Number, originY:Number, destinyX:Number, destinyY:Number, color:Number=0xFF0000, thickness:Number=1, clear:Boolean=false):void {
			var graphics:Graphics = mc.graphics;
			if (clear) {
				graphics.clear();
			}
			graphics.lineStyle(thickness, color);
			graphics.moveTo(originX, originY);
			graphics.lineTo(originX, originY);
			graphics.lineTo(destinyX, destinyY)
		}
		
		private function clearDraw(mc:MovieClip):void {
			mc.graphics.clear();
		}
		
		private function setVisionAngle():void {
			if (null == _fixCamera.stage || isNaN(_viewPortX) || isNaN(_viewPortY)) {
				return;
			}
			
			_fixCamera.lens.width = 0
			clearDraw(_rayContainer);
			
			var radian:Number = _radian; 
			
			var originX:Number = _cameraX;
			var originY:Number = _cameraZ;
			
			var pointLength:Point = getRotatedPoint(0, -_focalLength, radian, originX, originY);
			drawLine(_rayContainer, pointLength.x, pointLength.y, originX, _cameraZ, 0x00CCFF, 5);
			
			var leftPoint:Point = getRotatedPoint(_viewPortX/2, 0, radian, originX, originY);
			drawLine(_rayContainer, leftPoint.x, leftPoint.y, pointLength.x, pointLength.y, 0x0000FF, 5);
			var leftRadian:Number = Math.atan2(leftPoint.y-pointLength.y, leftPoint.x-pointLength.x);
			
			var rigthPoint:Point = getRotatedPoint(-_viewPortX/2, 0, radian, originX, originY);
			drawLine(_rayContainer, rigthPoint.x, rigthPoint.y, pointLength.x, pointLength.y, 0xFF0000, 5);
			var rightRadian:Number = Math.atan2(rigthPoint.y-pointLength.y, rigthPoint.x-pointLength.x);
			
			var itemX:Number = -400;
			var itemZ:Number =  400;
			drawLine(_rayContainer, itemX, itemZ, pointLength.x, pointLength.y, 0xFF0000, 5);
			
			var radianItem:Number = Math.atan2(itemZ - pointLength.y, itemX - pointLength.x);
			
			var red:Number = int(getAngle(rightRadian));
			var blue:Number = int(getAngle(leftRadian));
			var item:Number = int(getAngle(radianItem));
			
			red  = red  < 0 ? 360 - red: red;
			//item = item < 0 ? 360 - item: item;
			blue = blue < 0 ? 360 - blue: blue;
			
			traceRBI(red, blue, item);
			
			if (red == item || blue == item) {
				trace("1) SE VEEEEEEE!!!")
				return;
			}
			
			if (red < blue) {
				if (item > red && item < blue) {
					trace("2) SE VEEEEEEE!!!")
				}
			}else {
				if (item < red && item > blue) {
					trace("3) SE VEEEEEEE!!!")
				}
			}
			trace("-----------------");
		}
		
		private function traceRBI(r:Number, b:Number, i:Number):void {
			trace("Red:",  r%360);
			trace("Radian:", getAngle(_radian)%360);
			trace("Item:", i%360);
			trace("Blue:", b%360);
			
		}
		
		private function getRotatedPoint(x:Number, y:Number, radian:Number, originX:Number = 0, originY:Number = 0):Point {
			var finalX:Number = x * Math.cos(radian) - y * Math.sin(radian) + originX;
			var finalY:Number = x * Math.sin(radian) + y * Math.cos(radian) + originY;
			var point:Point = new Point(finalX, finalY);
			return point;
		}
	}
}

class Line {
	private var _x:Number;
	private var _y:Number;
	private var _radian:Number;
	
	public function Line(x:Number, y:Number):void {
		
	}
	
	public function get x():Number {
		return _x;
	}
	
	public function set x(value:Number):void {
		_x = value;
	}
	
	public function get y():Number {
		return _y;
	}
	
	public function set y(value:Number):void {
		_y = value;
	}
	
	public function get radian():Number {
		return _radian;
	}
	
	public function set radian(value:Number):void {
		_radian = value;
	}
}