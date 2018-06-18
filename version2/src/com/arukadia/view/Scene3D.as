package com.arukadia.view {
	import flash.display.MovieClip;
	/**
	 * ...
	 * @author Eze
	 */
	public class Scene3D extends MovieClip {
		
		private var _size:Number = 120;
		private var _gap:Number  = 20;
		
		public function Scene3D() {
			
		}
		
		public function addItemAt(column:Number, row:Number):MovieClip {
			var mc:NihonAsset;
			mc             = new NihonAsset();
			mc.width       = _size;
			mc.height      = _size;
			mc.name        = "mc" + String(row) + "_" + String(column)
			mc.x           = (_size ) * column;
			mc.y           = (_size ) * row;
			mc.indexT.text = mc.name;
			this.addChild(mc);
			return mc;
		}
//item.id, item.renderedX, item.renderedY, item.scale, item.visible		
		public function render(name:String, index:uint, 
		                       x:Number, y:Number, scale:Number, 
							   visible:Boolean):void {
			var item:MovieClip = MovieClip(this.getChildByName(name));
				if (null != item) {
					item.x       = x;
					item.y       = y;
					item.scaleX  = scale;
					item.scaleY  = scale;
					item.visible = visible;
					this.setChildIndex(item, index);
				}
		}
		
	}

}