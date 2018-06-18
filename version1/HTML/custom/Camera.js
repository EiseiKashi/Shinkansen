(function() {
		
		function Camera() {
			var PI2 = Math.PI * 2;
			
			var _itemsList/*:Array*/    = new Array();
			
			var _radian/*:Number*/      = 0;
			var _focalLength/*:Number*/ = 300;
			
			var _offsetX/*:Number*/     = 0;
			var _offsetY/*:Number*/     = 0;
			
			var _cameraX/*:Number*/     = 0;
			var _cameraY/*:Number*/     = 0;
			var _cameraZ/*:Number*/     = 0;
			
			var _cameraX1               = -1;
			var _cameraX2               = 1;
			var _cameraY1               = 0;
			var _cameraY2               = 0;
			
			var _viewPortX/*:Number*/;
			var _viewPortY/*:Number*/;
			
			var _focalLengthX/*:Number*/;
			var _focalLengthY/*:Number*/;
			var _visionRadian/*:Number*/;
			var _pointLength/*:Point*/;
			
			this.addItem = function(view, x, y, z)/*:void*/ {
				var item      = new Object();
				    item.x    = x;
					item.y    = y;
					item.z    = z;
					view.position = "absolute"
					item.width = view.style.width;
					item.height = view.style.height;
					item.view = view;
				_itemsList.push(item);
				_itemsList.sort(function(a, b){return b.z-a.z}); 
				display3D();
			}
			
			//----------------------------------------------
			// Desplazamiento de camera
			this.getOffsetY = function()/*:Number*/ {
				return _offsetY;
			}
			this.setOffsetY = function(value/*:Number*/)/*:void*/ {
				_offsetY = value;
				display3D();
			}
			this.getOffsetX = function()/*:Number*/ {
				return _offsetX;
			}
			this.setOffsetX = function (value/*:Number*/)/*:void*/ {
				_offsetX = value;
				display3D();
			}
			
			//----------------------------------------------
			this.getCameraX = function()/*: Number*/{
				return _cameraX;
			}
			this.setCameraX = function(value/*:Number*/)/*:void*/ {
				_cameraX = value;
				display3D();
			}
			
			this.getCameraY = function()/*: Number*/{
				return _cameraY;
			}
			this.setCameraY = function(value/*:Number*/)/*:void*/ {
				_cameraY = value;
				display3D();
			}
			
			this.setCameraZ = function(value/*:Number*/)/*:void*/ {
				if (isNaN(value)) {
					return;
				}
				_cameraZ = value
				display3D();
			}
			this.getCameraZ = function()/*:Number*/ {
				return _cameraZ;
			}
			
			this.setRadian = function(value/*:Number*/)/*:void*/ {
				_radian = value;
				display3D();
			}
			this.getRadian = function()/*:Number*/ {
				return _radian;
			}
			
			this.getFocalLength = function()/*:Number*/ {
				return _focalLength;
			}
			this.setFocalLength = function(value/*:Number*/)/*:void*/ {
				if (isNaN(value)) {
					return;
				}
				_focalLength = value;
				
				display3D();
			}
			
			//----------------------------------------------
			
			this.getViewPortX = function()/*:Number*/ {
				return _viewPortX;
			}
			this.setViewPortX = function(value/*:Number*/)/*:void*/ {
				_viewPortX = value;
				display3D();
			}
			
			this.getViewPortY = function()/*:Number*/ {
				return _viewPortY;
			}
			this.setViewPortY = function(value/*:Number*/)/*:void*/ {
				_viewPortY = value;
				display3D();
			}
			
			//----------------------------------------------
			// Render!!!
			function display3D()/*:void*/ {
				
				updateProperties();
				
				var view/*:MovieClip*/;
				var dx/*:Number*/;
				var dy/*:Number*/;
				var x/*:Number*/;
				var y/*:Number*/;
				var z/*:Number*/;
				var item/*:Sprite3D*/;
				var point/*:MovieClip*/;
				var scaleFactor/*:Number*/;
				var name/*:String*/
				var viewName/*:String*/;
				var isInRange;/*:Boolean*/
				var index/*:uint*/  = 0;
				var length/*:uint*/ = _itemsList.length;
				
				var posX;
				var posY;
				var acumulator = "";
				while (index < length) {
					item    = _itemsList[index];
					view    = item.view;
					//name    = view.id;
					
					dx      = item.x - _cameraX;
					dy      = item.z - _cameraZ;
					
					isInRange = checkIsInRange(item.x, item.z);
					
					x = dx;
					y = item.y - _cameraY;
					z = getPointDistance(item.x, item.z, _cameraX1, _cameraY1, _cameraX2, _cameraY2);
					
					item.cameraZ = z;
					scaleFactor  = _focalLength / (z);
					
					acumulator += ("x: " + String(Math.round(x)) + "\n");
					acumulator += ("y: " + String(Math.round(y)) + "\n");
					acumulator += ("z: " + String(Math.round(z)) + "\n");
					acumulator += ("scaleFactor: " + String(Math.round(scaleFactor*100)) + "\n");
					
					if(scaleFactor > 0) {
						//view.visible = true;
						posX       = (x * scaleFactor) + _offsetX;
						posY       = (y * scaleFactor) + _offsetY;
						
						view.style.left = posX+"px";
						view.style.top  = posY +"px";
						
						view.style.width =  (scaleFactor * parseInt(item.width)) + "px";
						view.style.height = (scaleFactor * parseInt(item.height)) + "px";
						
						//view.alpha   = isInRange ? scaleFactor + 0.5 : 0;
					}else {
						//view.visible = false;
					}
					
					index++
				}
				
				_itemsList.sort(function(a, b){return b.cameraZ-a.cameraZ}); 
				
				index  = 0;
				length = _itemsList.length; 
				while (index < length) {
					item    = _itemsList[index];
					view    = item.view;
					//CAMBIARLE PROFUNDIDAD!! 
					//view.parent.setChildIndex(view, index);
					index++
				}
				if(_itemsList.length > 0){
					console.log(acumulator+ "\-  -  -  -  -  -");
					acumulator += ("_cameraX:", _cameraX) + "\n";
					acumulator += ("_cameraY",  _cameraY) + "\n";
					acumulator += ("_cameraZ",  _cameraZ) + "\n";
					acumulator += ("_radian",  _radian) + "\n";
					acumulator += ("-----------");
					console.log(acumulator+ "\n==========");
				}
			}
			
			//----------------------------------------------
			// Helpers
			function getHipotenuse(dx/*:Number*/, dy/*:Number*/)/*:Number*/ {
				var hypotenuse/*:Number*/ =  Math.sqrt(dx * dx + dy * dy);
				return hypotenuse;
			}
			
			function getRadian (degree/*:Number*/)/*:Number*/{
				return degree * (PI2/360);
			}
			
			function getAngle(radian/*:Number*/)/*:Number*/ {
				return radian * (360/PI2);
			}
			
			function updateProperties()/*:void*/ {
				
				var halfViewPort/*:Number*/ = _viewPortX / 2;
				var visionLength/*:Number*/ = getHipotenuse(halfViewPort, _focalLength);
				
				var leftRadian/*:Number*/   = Math.atan2(0, halfViewPort)  + _radian;
				var rigthRadian/*:Number*/  = Math.atan2(0, -halfViewPort) + _radian;
				
				_pointLength            = getRotatedPoint(0, _focalLength,  _radian,     _cameraX, _cameraZ);
				var leftPoint/*:Point*/     = getRotatedPoint(visionLength, 0,  leftRadian,  _cameraX, _cameraZ);
				var rigthPoint/*:Point*/    = getRotatedPoint(visionLength, 0,  rigthRadian, _cameraX, _cameraZ);
				
				_focalLengthX           = _pointLength.x;
				_focalLengthY           = _pointLength.y;
				
				_visionRadian           = getVectorsRadian(leftPoint.x, leftPoint.y, _pointLength.x, _pointLength.y);
				
				_cameraX1 = leftPoint.x; 
				_cameraY1 = leftPoint.y;
				_cameraX2 = rigthPoint.x;
				_cameraY2 = rigthPoint.y;
				
				var acumulator = "";
			}
			
			function getRotatedPoint(x/*:Number*/, y/*:Number*/, radian/*:Number*/, originX/*:Number= 0*/, originY/*:Number= 0*/)/*:Point*/ {
				if(isNaN(originX)){
					originX = 0;
				}
				
				if(isNaN(originY)){
					originY = 0;
				}
				
				var finalX/*:Number*/ = x * Math.cos(radian) - y * Math.sin(radian) + originX;
				var finalY/*:Number*/ = x * Math.sin(radian) + y * Math.cos(radian) + originY;
				var point/*:Point*/ = new Point(finalX, finalY);
				return point;
			}
			
			function checkIsInRange(x/*:Number*/, y/*:Number*/)/*:Boolean*/ {
				var radian/*:Number*/ = getVectorsRadian(_pointLength.x, _pointLength.y, x, y);
				return _visionRadian > radian;
			}
			
			function getVectorsRadian(point1X/*:Number*/, point1Y/*:Number*/,
											  point2X/*:Number*/, point2Y/*:Number*/ )/*:Number*/ {
				
				point1X -= _cameraX;
				point1Y -= _cameraZ;
				
				point2X -= _cameraX;
				point2Y -= _cameraZ;
				
				var scalar/*:Number*/ =  point1X * point2X + point1Y * point2Y;
				var mod1/*:Number*/   = getHipotenuse(point1X, point1Y);
				var mod2/*:Number*/   = getHipotenuse(point2X, point2Y);
				
				var mods = (mod1 * mod2);
				var radianToCalculate/*:Number*/ = mods == 0 ? 0 : scalar / mods;
				
				var radian/*:Number*/= Math.acos(radianToCalculate);
				if(isNaN(radian)){
					return;
				}
				while (isNaN(radian)) {
					radian = Math.acos(Math.round(radianToCalculate*10)/10);
				}
				return radian;
			}
			
			//----------------------------------------------
			// Debugger
			function getPointDistance(itemX/*:Number*/, itemY/*:Number*/, 
											  x1/*:Number*/, y1/*:Number*/, x2/*:Number*/, y2/*:Number*/)/*:Number*/ {
				var denominator/*:Number*/ = Math.abs((y2 - y1) * itemX - (x2 - x1) * itemY + x2 * y1 - y2 * x1);
				var divisor/*:Number*/     = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 -x1, 2));
				if (y1 == y2) {
					return itemY - y1;
				}
				
				if (x1 == x2) {
					return itemX - x1;
				}
				
				return denominator / divisor;
			}
			
			function Point(x, y) {
				
				this.x = isNaN(x) ? 0 : x;
				this.y = isNaN(y) ? 0 : y;
			}
		}
		
		window.ADMCamera = new Camera();
})();