package 
{
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.net.navigateToURL;
	import flash.net.URLRequest;
	
	/**
	 * ...
	 * @author 
	 */
	public class Main extends Sprite 
	{
		private var _camera:Camera;
		public function Main():void 
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		private function init(e:Event = null):void {
			stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDownStage);
			stage.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheelEvent);
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			_camera                 = new Camera();
			_camera.viewPortX       = stage.stageWidth;
			_camera.viewPortY       = stage.stageHeight;
			_camera.offsetX         = stage.stageWidth  / 2;
			_camera.offsetY         = stage.stageHeight / 2;
			
			var mc:NihonAsset;
			var map:MovieClip       = _camera.map;
			var fracc:Number        = 120;
			var rowFracc:Number;
			var container:MovieClip = new MovieClip();
			
			var totalColumns:Number = 5;
			var totalRows:Number    = 2;
			
			var yPostion:Number     = 0;
			
			var rows:Number         = 0;
			var columns:Number      = 0;
			
			var indexX:int          = 1;
			var index:int           = 0;
			
			while (rows < totalRows) {
				columns = 0;
				rowFracc = rows * fracc;
				while(columns < totalColumns) {
					mc             = new NihonAsset();
					mc.width       = fracc;
					mc.height      = fracc;
					mc.name        = String(rows) + "." + String(columns)
					mc.x           = fracc * columns;
					mc.y           = rowFracc;
					mc.indexT.text = mc.name;
					container.addChild(mc);
					
					_camera.addItem(mc, mc.x, 0, mc.y);
					index++
					columns ++;
				}
				rows++;
			}
			addChild(container);
			map.scaleX = 0.4;
			map.scaleY = 0.4
			map.x      = 20 + map.width/2;
			map.y      = 20 + map.height/2;
				
			this.addChild(container);
			this.addChild(map);
			//map.rotation = 180;
			container.alpha = 0.5;
			/*
			_camera.cameraX = -300;
			_camera.cameraY = 65;
			_camera.cameraZ = -150;*/
			_camera.angle   = 0;
			
		}
		
		private function onMouseWheelEvent(event:MouseEvent):void {
			_camera.cameraZ += event.delta;
		}
		
		private function onKeyDownStage(event:KeyboardEvent):void {
			switch(event.keyCode) {
				//////////////////////////////////////
				case 37:// left
					_camera.cameraX += 5;
					break;
				case 39:// right
					_camera.cameraX -= 5;
					break;
				//////////////////////////////////////
				case 38:// up
					_camera.cameraZ += 5;
					break;
				case 40:// down
					_camera.cameraZ -= 5;
					break;
				/////////////////////////////////////
				// Rotation
				case 82 : // R
					_camera.angle += 1;
					break;
				case 84 : // T
					_camera.angle -= 1;
					break;
				/////////////////////////////////////
				// Lens
				case 70 : // F
					_camera.focalLength += 10;
					//setPan();
					break;
				case 71 : // G
					_camera.focalLength -= 10;
					break;
				/////////////////////////////////////
				// Depth
				case 68: // D
					_camera.cameraZ ++;
					break;
				case 83: // S
					_camera.cameraZ --;
					break;
				/////////////////////////////////////
			}
		}
	}
	
}