package  {
	import flash.display.Graphics;
	import flash.display.MovieClip;
	import flash.display.Shape;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;

	public class CameraNew {
		public static var PI2:Number = Math.PI * 2;
		
		private var _fixCamera:CameraAsset = new CameraAsset();
		private var _render:Function;
		
		private var _itemsList:Array      = new Array();
		private var _map:MovieClip        = new MovieClip();
		private var _debugger:Debugger    = new Debugger();
		
		private var _radian:Number        = 0;
		private var _radianFraction:Number;
		private var _focalLength:Number   = 300;
		
		private var _cameraX:Number       = 0;
		private var _cameraY:Number       = 0;
		private var _cameraZ:Number       = 0;
		private var _offsetX:Number       = 0;
		private var _offsetY:Number       = 0;
		
		public function CameraNew() {
			_render      = render1;
			_map.addChild(new GridAsset());
		}
		
		//--------------------------------------------------
		// Interface
		public function addItem(item:Sprite3D):void {
			_itemsList.push(item);
			
			_itemsList.sortOn("z", Array.DESCENDING | Array.NUMERIC); 
			
			var point:PointAsset  = new PointAsset();
				point.name        = item.view.name;
				point.x           = item.x;
				point.y           = item.z;
				point.indexT.text = item.id;
				point.addEventListener(MouseEvent.ROLL_OVER, onViewRollOver);
			
			var fixPoint:PointAsset = new PointAsset();
				fixPoint.name     = "fix" + point.name;
				fixPoint.x        = item.x;
				fixPoint.y        = item.z;
				fixPoint.indexT.text = item.id;
				fixPoint.alpha    = 0.3;
			_map.addChild(point);
			_map.addChild(fixPoint);
			
			_render();
		}
		
		//--------------------------------------------------
		// Getters y setters
		
		public function get offsetX():Number {
			return _offsetX;
		}
		public function set offsetX(value:Number):void {
			_offsetX = value;
		}
		
		public function get offsetY():Number {
			return _offsetY;
		}
		public function set offsetY(value:Number):void {
			_offsetY = value;
		}
		
		public function get cameraX(): Number{
			return _cameraX;
		}
		public function set cameraX(value:Number):void {
			_cameraX = value;
			_render();
		}
		
		public function get cameraY():Number {
			return _cameraY;
		}
		public function set cameraY(value:Number):void {
			_cameraY = value;
		}
		
		public function set cameraZ(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			_cameraZ = value;
			_render();
		}
		public function get cameraZ():Number {
			return _cameraZ;
		}
		
		public function set radian(value:Number):void {
			var last:Number = _radian;
			_radian = value;
			_radianFraction = _radian - last;
			rotate();
			_render();
		}
		public function get radian():Number {
			return getAngle(_radian);
		}
		
		public function set angle(value:Number):void {
			radian = getRadian(value);
		}
		public function get angle():Number {
			return getAngle(_radian);
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
		
		public function get map():MovieClip {
			return _map;
		}
		
		//--------------------------------------------------
		// Helpers
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
			_map.graphics.clear();
			while (index < length) {
				// Obtención del item
				item    = _itemsList[index];
				view    = item.view;
				name    = item.view.name;
				// Otención de punto en el mapa
				point   = MovieClip(_map.getChildByName(name));
				
				drawLine(_map, new Point(_cameraX, _cameraZ), new Point(item.x, item.z), 0xFFFF00);
				
				point.x = item.x;
				point.y = item.z;
				
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
		
		private function rotate():void {
			var dx:Number;
			var dy:Number;
			var x:Number;
			var z:Number;
			var itemRadian:Number;
			var radius:Number;
			var item:Sprite3D;
			var name:String;
			
			var index:uint  = 0;
			var length:uint = _itemsList.length;
			while (index < length) {
				// Cada item tiene las posiciiones en x, y, z
				item = _itemsList[index];
				
				// Distancia entre los ejes X e Y
				dx   = item.x - _cameraX;
				dy   = item.z - _cameraZ;
				
				// El nuevo angulo a partir de la rotación de la cámara con el item.
				// El largo entre el item y la cámara.
				// Ubicación x, y en base al ángulo del item con la cámara.
				itemRadian = Math.atan2(dy, dx) - _radianFraction;
				radius     = Math.sqrt(dx*dx + dy*dy);
				x = _cameraX + (Math.cos(itemRadian) * radius);
				z = _cameraZ + (Math.sin(itemRadian) * radius);
				
				// Actualización de la posición del item con respecto al nuevo ángulo
				item.x  = x;
				item.z  = z;
				
				index++
			}
		}
		
		private function getRadian(degree:Number):Number{
			return degree * (PI2/360);
		}
		
		private function getAngle(radian_:Number):Number {
			return radian_ * (360/PI2);
		}
		
		//--------------------------------------------------
		// Debugging
		public function get debugger():Debugger {
			return _debugger;
		}
		
		private function onViewRollOver(event:MouseEvent):void {
			_debugger.pointT.text = MovieClip(event.target).name;
		}
		
		private function displayMap():void {
			_debugger.xT.text    = String(_cameraX);
			_debugger.yT.text    = String("---");
			_debugger.zT.text    = String(_cameraZ);
			
			_debugger.offZT.text = "---";
			
			_map.addChild(_fixCamera);
			_fixCamera.x            = _cameraX;
			_fixCamera.y            = _cameraZ;
			_fixCamera.focal.height = _focalLength;
			_fixCamera.focal.y      = -_focalLength
			_fixCamera.rotation     = getAngle(_radian);
		}
		
		private function drawLine(mc:MovieClip, origin:Point, destiny:Point, color:Number, clear:Boolean=false):void {
			var graphics:Graphics = mc.graphics;
			if (clear) {
				graphics.clear();
			}
			graphics.lineStyle(1, color);
			graphics.moveTo(origin.x, origin.y);
			graphics.lineTo(origin.x, origin.y);
			graphics.lineTo(destiny.x, destiny.y)
		}
	}
}