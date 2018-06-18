package com.arukadia.view {
	import flash.display.MovieClip;
	/**
	 * ...
	 * @author Eze
	 */
	public class Map extends MovieClip {
		
		private var _fixCamera:CameraAsset    = new CameraAsset();
		private var _pointContainer:MovieClip = new MovieClip();
		private var _cameraAsset:MovieClip    = new CameraAsset();
		
		public function Map() {
			this.addChild(new GridAsset());
			this.addChild(_pointContainer);
			this.addChild(_cameraAsset);
		}
		
		public function addItemAt(name:String, x:Number, y:Number):void {
			var point:PointAsset
			    point             = new PointAsset();
				point.name        = name;
				point.x           = x;
				point.y           = y;
				point.indexT.text = name;
			_pointContainer.addChild(point);
		}
		
		public function render(name:String, x:Number, y:Number, scale:Number, index:uint):void {
			var item:MovieClip = MovieClip(_pointContainer.getChildByName(name));
			if (null == item) {
				return;
			}
			
			item.x = x;
			item.y = y;
			
			_pointContainer.setChildIndex(item, index);
		}
		
		public function setCamera(x:Number, y:Number, rotation:Number ):void {
			_cameraAsset.x        = x;
			_cameraAsset.y        = y;
			_cameraAsset.rotation = rotation;
		}
		
	}

}