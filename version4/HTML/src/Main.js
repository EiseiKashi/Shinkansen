(function Main (){
	
	var _camera;
	
	window.onload = function(){
		_camera = window.Camera;
		_camera.setViewPortX (800);
		_camera.setViewPortY (600);
		_camera.setOffsetX   (800  / 2);
		_camera.setOffsetY   (600 / 2);
		
		var node/*:DIV*/;
		var item/*:Sprite3D*/;
		
		var _size                   = 120;
		
		var fracc/*:Number*/        = 120;
		
		var totalColumns/*:Number*/ = 5;
		var totalRows/*:Number*/    = 2;
		
		var yPostion/*:Number*/     = 0;
		
		var rowIndex/*:Number*/     = 0;
		var columnIndex/*:Number*/  = 0;
		
		var indexX/*:int*/          = 1;
		var index/*:int*/           = 0;
		var x;
		var y;
		while (rowIndex < totalRows) {
			columnIndex = 0;
			while(columnIndex < totalColumns) {
				node = document.getElementById("imagen" + index);
				x = columnIndex*_size;
				y = rowIndex*_size;
				item = new window.Sprite3D(node, x, 0, y);
				_camera.addItem(item);
				index++
				columnIndex ++;
			}
			rowIndex++;
		}
		
		_camera.setCameraX(570);
		_camera.setCameraY(0);
		var camera = 570;
		_camera.setCameraZ(15);
		
		_camera.addCallback(onRender);
		
		_camera.setAngle(90);
		
		setInterval(function(){
			_camera.setCameraX(camera);
			camera -= 1;
		}, 30);
	}
	
	function onRender(view/*:View*/, index/*:uint*/,
					  x/*:Number*/, y/*:Number*/, z/*:Number*/,
					  scale/*:Number*/,
					  isFirstItem/*:Boolean*/, isLastItem/*:Boolean*/)/*:void*/ {
		if(scale == 0){
			view.style.display = "none";
			return;
		}else{
			view.style.display = "inline";
		}
		view.style.left    = x + "px";
		view.style.top     = y + "px";
		view.style.width   = (scale*99) + "px";
		view.style.height  = (scale*99) + "px";
		view.style.zIndex  = index;
	}
})()