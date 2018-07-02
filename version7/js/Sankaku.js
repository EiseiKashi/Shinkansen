function Sankaku (){
    'use strict'
    	
	var isNumber = function(number){
		var isNull   = null == number;
		var isNotN   = isNaN(number);
		var isString;
		if(!isNull){
			isString = number.length != undefined;
		}
		var isNotAnumber = isNull || isNotN  ||  isString;
		if( isNotAnumber){
			return false;
		}
		return true;
    }
    
    var PI2	= Math.PI * 2;

    var getLength  = function(dx, dy) {
        var hypotenuse =  Math.sqrt(dx * dx + dy * dy);
        return hypotenuse;
    }
    /*
        radian =  degree * (PI2/360);
        degree =  radian * (360/PI2);
    */
    var getRadian  = function(degree){
        return (((degree%360)+360)%360) * (PI2/360);
    }
        
    var getDegree  = function(radian) {
        return radian * (360/PI2);
    }
    
    var pointByRadian  = function(x, y, radian, offsetX, offsetY) {
        offsetX		= isNumber(offsetX) ? offsetX : 0;
        offsetY		= isNumber(offsetY) ? offsetY : 0;
        
        var finalX	= x * Math.cos(radian) - y * Math.sin(radian) + offsetX;
        var finalY	= x * Math.sin(radian) + y * Math.cos(radian) + offsetY;
        var point	= new Point(finalX, finalY);
        return point;
    }

    var pointByLengthRadian = function(length, radian, offsetX, offsetY){
        return pointByRadian(length, 0, radian, offsetX, offsetY);
    }

    var pointByLengthDegree = function(length, degree){
        return pointByDegree(length, 0, radian, offsetX, offsetY);
    }
        
    var getLinesRadian  = function(line1, line2) {
        var point1X = line1.getDx();
        var point2X = line1.getDy();
        var point1Y = line2.getDx();
        var point2Y = line2.getDy();

        var scalar	=  point1X * point2X + point1Y * point2Y;
        var mod1	= getHipotenuse(point1X, point1Y);
        var mod2	= getHipotenuse(point2X, point2Y);
        var mods	= (mod1 * mod2); 
        
        var radianToCalculate = mods == 0 ? 0 : scalar / mods;
        var radian= Math.acos(radianToCalculate);
        if(isNaN(radian)){
            return;
        }
        
        while (isNaN(radian)) {
            radian = Math.acos(int(radianToCalculate * 10) / 10);
        }
        return radian;
    }
        
    var getPointDistance  = function(itemX, itemY, 
                                        x1, y1, x2, y2) {
        var denominator = Math.abs((y2 - y1) * itemX - (x2 - x1) * itemY + x2 * y1 - y2 * x1);
        var divisor     = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 -x1, 2));
        return denominator / divisor;
        
        // d = 	|A·Mx + B·My + C|
        //			√A2 + B2		
        //https://www.youtube.com/watch?v=bfZ57ESvFok
    }
        
    var intercetionPoint  = function(pointX, pointY, x, y, x1, y1) {
        //x, y, x1, x2 = rect
        var slope			= (y1 - y) / (x1 - x);
        var interceptorY	= y1 - slope * x1;
        var m2 				= -(1 / slope);
        var b2  			= pointY - m2 * pointX;
        var x2  			= (b2-interceptorY)/(slope-m2);
        var y2  			= (m2 * x2 + b2);
        return new Point(x2, y2);
    }

    var Point  = function(x, y) {
        this.x = x;
        this.y = y;
    }

    var Line = function(x1, y1, x ,y){
        
        _self = this;

        var _x   = 0;
        var _y   = 0;
        var _x1  = 1;
        var _y1  = 0;
        var _dx  = _x1-x;
        var _dy  = _y1-y;

        this.setXY = function(x, y, x1, y1){
            _self.setPivot(x, y);
            _self.setHead(x1, y1);
        }

        this.setPivot = function(x, y){
            _x = isNumber(x) ? x : _x;
            _y = isNumber(y) ? y : _y;
        }

        this.setHead = function(x, y){
            _x1 = isNumber(x) ? x : _x1;
            _y1 = isNumber(y) ? y : _y1;
        }

        this.setX = function(x, x1){
            setPivot(x);
            setHead(x1);
        }

        this.setY = function(y, y1){
            setPivot(null, y);
            setHead(null, y1);
        }

        this.setPivot(x,y);
        this.setHead(x1,y1);

        this.getLength = function(){
            var dx = _x1 - 
            Math.sqrt(_dx * _dx + _dy * _dy);
        }

        this.getDx = function(){
            return _dx;
        }

        this.getDy = function(){
            return _dy;
        }

        this.getSlope = function(){
            return (_y1 - _y) / (_x1 - _x);
        }

        this.getPointIntercept = function(pointX, pointY){
            return intercetionPoint(pointX, pointY, _x, _y, _x1, _y1);
        }

        this.getDistancePoint = function(pointX, pointY){
            return  getPointDistance  = function(pointX, pointY, _x, _y, _x1, _y1);
        }

        this.getRadianWithLine = function(line){
            return getLinesRadian(this, line);
        }
    }

    this.createLine = function(x1, y2, x, y){
        return new Line(x1, y2, x, y);
    }
}