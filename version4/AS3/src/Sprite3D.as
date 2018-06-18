package  {
	import flash.display.MovieClip;
	
	public class Sprite3D {
		private var _view:MovieClip;
		
		private var _x:Number       = 0;
		private var _y:Number       = 0;
		private var _z:Number       = 0;
		
		private var _renderedX:Number = 0;
		private var _renderedY:Number = 0;
		private var _renderedZ:Number = 0;
		
		private var _visible:Boolean;
		
		private var _scale:Number;
		
		public function Sprite3D(view:MovieClip=null, x:Number=0, y:Number=0, z:Number=0) {
			_view = view;
			_x    = x;
			_y    = y;
			_z    = z
		}
		
		public function get id():String {
			return _view != null ? _view.name : null;
		}
		
		public function set view(value:MovieClip):void {
			if (null != value) {
				_view = value;
			}
		}
		
		public function get x():Number {
			return _x;
		}
		
		public function set x(value:Number):void {
			if (!isNaN(value)) {
				_x = value;
			}
		}
		
		public function get y():Number {
			return _y;
		}
		
		public function set y(value:Number):void {
			if (!isNaN(value)) {
				_y = value;
			}
		}
		
		public function get z():Number {
			return _z;
		}
		
		public function set z(value:Number):void {
			if (!isNaN(value)) {
				_z = value;
			}
		}
		
		public function get view():MovieClip {
			return _view;
		}
		
		public function get renderedX():Number {
			return _renderedX;
		}
		
		public function set renderedX(value:Number):void {
			if (!isNaN(value)) {
				_renderedX = value;
			}
		}
		
		public function get renderedY():Number {
			return _renderedY;
		}
		
		public function set renderedY(value:Number):void {
			if (!isNaN(value)) {
				_renderedY = value;
			}
		}
		
		public function get renderedZ():Number {
			return _renderedZ;
		}
		
		public function set renderedZ(value:Number):void {
			if (!isNaN(value)) {
				_renderedZ = value;
			}
		}
		
		public function get scale():Number {
			return _scale;
		}
		
		public function set scale(value:Number):void {
			_scale = value;
		}
		
		public function set visible(value:Boolean):void {
			_visible = value;
		}
		
		public function get visible():Boolean {
			return _visible;
		}
		
	}

}