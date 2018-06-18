package  {
	public class Trigo {
		
		public static var PI2:Number = Math.PI * 2;
		
		public static function getHipotenuse(dx:Number, dy:Number):Number {
			var hypotenuse:Number;
			if (isNaN(dx) || isNaN(dy)) {
				return hypotenuse;
			}
			hypotenuse =  Math.sqrt(dx * dx + dy * dy);
			return hypotenuse;
		}
		
		public static function getRadian (degree:Number):Number{
			return degree * (PI2/360);
		}
		
		public static function getDegree (radian:Number):Number{
			return radian * (360/PI2);
		}
		
		public static function getDistance (adjacent:Number, opposite:Number):Number{
			var distance:Number = Math.sqrt(Math.pow(adjacent, 2)+Math.pow(opposite, 2))
			return distance;
		}
		
		private var _angle:Number;
		private var _radius:Number = 1;
		
		public function Trigo (angle:Number=0, radius:Number=1) {
			_angle  = angle;
			_radius = radius;
		}
		//------------
		public function set angle(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			_angle = value;
		}
		
		public function get angle():Number {
			return _angle%360;
		}
		//------------
		public function set radian(value:Number):void {
			_angle = getDegree(value);
		}
		
		public function get radian():Number {
			return getRadian(_angle);
		}
		//------------
		public function set x(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			setAngleBySizes(value, y);
		}
		
		public function get x():Number {
			return Math.cos(radian)*_radius;
		}
		//------------
		public function set y(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			setAngleBySizes(x, value);
		}
		
		public function get y():Number {
			return Math.sin(radian)*_radius;
		}
		//------------
		public function get radius():Number {
			return _radius;
		}
		
		public function set radius(value:Number):void {
			if (isNaN(value)) {
				return;
			}
			_radius = value;
		}
		//------------
		public function setAngleBySizes(x:Number, y:Number):void {
			if (isNaN(x) || isNaN(y)) {
				return;
			}
			_angle = getDegree(Math.atan2(y, x));
		}
	}
	
}