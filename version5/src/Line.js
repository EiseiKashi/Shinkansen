window.Line = function (x1/*:Number=0*/, 
						y1/*:Number=0*/, 
						x2/*:Number=0*/, 
						y2/*:Number=0*/) {
	
	var _slope;
	var _x1 = 0;
	var _y1 = 0;
	var _x2 = 1;
	var _y2 = 1;
	var _dx;
	var _dy;
	var _radian;
	var _angle;
	var _length;
	var _intercept;
	
	this.getSlope = function() {return _slope;}
	this.setSlope = function(value) {
		return this;
	}
	
	this.getIntercept = function() { return _intercept;}
	this.setIntercept = function(value) {
		return this;
	}
	
	this.getFoot = function() {return {_x1, _y1};}
	this.setFoot = function(x, y) {
		return this;
	}
	
	this.getHead = function() {return {_x2, _y2};}
	this.setHead = function(x, y) {
		return this;
	}
	
	this.getLength = function() {return _length;}
	this.setLength = function(value) {
		return this;
	}
	
	this.getRadian = function() {return _radian;}
	this.setRadian = function(value) {
		return this;
	}
	
	this.getAngle = function() {return _angle;}
	this.setAngle = function(value) {
		return this;
	}
	
	this.rotateOnPoint(x, y, angle) {
		return this;
	}
	
	this.getYbyX(value) {
	}
	
	this.getXbyY(value) {
	}
	
	this.containsPoint(x, y) {
	}
	
	this.calculateByEquation(dx, dy, intercept, slope) {
		dx			= null	== dx			? getDx()			: dx;
		dy			= null	== dy			? getDy()			: dy;
		intercept	= null	== intercept	? getIntercept()	: intercept;
		slope		= null	== slope		? getSlope()		: slope;
	}
	
	function updateProperties() {
		_dx 		= _x2 - _x1;
		_dy 		= _y2 - _y1;
		_slope		= _dy / _dx;
		_intercept	= _y1 - (_slope*_x1);
		_radian     = Math.atan2(_dy,_dx);
	}
}