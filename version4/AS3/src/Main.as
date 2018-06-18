package 
{
	import com.arukadia.model.camera.Camera;
	import com.arukadia.view.Map;
	import com.arukadia.view.Scene3D;
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
		private var _scene3D:Scene3D;
		private var _map:Map;
		
		public function Main():void 
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		private function init(e:Event = null):void {
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDownStage);
			stage.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheelEvent);
			
			_scene3D                = new Scene3D();
			_map                    = new Map();
			_camera                 = new Camera();
			
			
			_camera.viewPortX       = stage.stageWidth;
			_camera.viewPortY       = stage.stageHeight;
			_camera.offsetX         = stage.stageWidth  / 2;
			_camera.offsetY         = stage.stageHeight / 2;
			
			addChild(_scene3D);
			addChild(_map);
			
			var mc:MovieClip;
			var item:Sprite3D;
			
			var fracc:Number        = 120;
			
			var totalColumns:Number = 5;
			var totalRows:Number    = 2;
			
			var yPostion:Number     = 0;
			
			var rowIndex:Number     = 0;
			var columnIndex:Number  = 0;
			
			var indexX:int          = 1;
			var index:int           = 0;
			
			while (rowIndex < totalRows) {
				columnIndex = 0;
				while(columnIndex < totalColumns) {
					mc   = _scene3D.addItemAt(columnIndex, rowIndex);
					item = new Sprite3D(mc, mc.x, 0, mc.y);
					_map.addItemAt(mc.name, item.x, item.z);
					_camera.addItem(item);
					index++
					columnIndex ++;
				}
				rowIndex++;
			}
			
			_map.scaleX = 0.4;
			_map.scaleY = 0.4
			_map.x      = 20 + _map.width/2;
			_map.y      = 20 + _map.height/2;
			
			_camera.cameraX = 610;
			_camera.cameraY = 0;
			_camera.cameraZ = 25;
			
			_camera.addCallBack(onRender);
			
			_camera.angle   = 90;
		}
		
		private function onRender(item:Sprite3D, index:uint, isLastItem:Boolean):void {
			_map.render(item.id, item.x, item.z, item.scale, index);
			_map.setCamera(_camera.cameraX, _camera.cameraZ, _camera.angle);
			_scene3D.render(item.id, index, 
							item.renderedX, item.renderedY, item.scale, 
							item.visible);
			/*console.log(_camera.cameraX + " | " + _camera.cameraY + " | " +  _camera.cameraZ +  " | " +  _camera.angle);* /
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
					_camera.radian += Math.PI/360;
					break;
				case 84 : // T
					_camera.radian -= Math.PI/360;
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

class console {
	static public function log(message:String) {
		trace(message);
	}
}