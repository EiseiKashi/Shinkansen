/*
Author: Eisei Kashi - 07/2018
*/

function Yasashiku (){
    //Formula list, credits: Robert Penner
    Math.linearTween = function (t, b, c, d) {
        return c*t/d + b;
    };

    Math.yasashiInQuad = function (t, b, c, d) {
        return c*(t/=d)*t + b;
    };
    Math.yasashiOutQuad = function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    };
    Math.yasashiInOutQuad = function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    };

    Math.yasashiInCubic = function (t, b, c, d) {
        return c*(t/=d)*t*t + b;
    };
    Math.yasashiOutCubic = function (t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    };
    Math.yasashiInOutCubic = function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    };

    Math.yasashiInQuart = function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    };
    Math.yasashiOutQuart = function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    };
    Math.yasashiInOutQuart = function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    };

    Math.yasashiInQuint = function (t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    };
    Math.yasashiOutQuint = function (t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    };
    Math.yasashiInOutQuint = function (t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    };

    Math.yasashiInSine = function (t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    };
    Math.yasashiOutSine = function (t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    };
    Math.yasashiInOutSine = function (t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };

    Math.yasashiInExpo = function (t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    };
    Math.yasashiOutExpo = function (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    };
    Math.yasashiInOutExpo = function (t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };

    Math.yasashiInCirc = function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    };
    Math.yasashiOutCirc = function (t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    };
    Math.yasashiInOutCirc = function (t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    };

    /////////// ELASTIC EASING: exponentially decaying sine wave  //////////////

    // t: current time, b: beginning value, c: change in value, d: duration, a: amplitude (optional), p: period (optional)
    // t and d can be in frames or seconds/milliseconds
    Math.yasashiInElastic = function (t, b, c, d, a, p) {
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    };
    Math.yasashiOutElastic = function (t, b, c, d, a, p) {
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    };
    Math.yasashiInOutElastic = function (t, b, c, d, a, p) {
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    };

    // back easing in - backtracking slightly, then reversing direction and moving to target
    // t: current time, b: beginning value, c: change in value, d: duration, s: overshoot amount (optional)
    // t and d can be in frames or seconds/milliseconds
    // s controls the amount of overshoot: higher s means greater overshoot
    // s has a default value of 1.70158, which produces an overshoot of 10 percent
    // s==0 produces cubic easing with no overshoot
    Math.yasashiInBack = function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    };
    // back easing out - moving towards target, overshooting it slightly, then reversing and coming back to target
    Math.yasashiOutBack = function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };
    // back easing in/out - backtracking slightly, then reversing direction and moving to target,
    // then overshooting target, reversing, and finally coming back to target
    Math.yasashiInOutBack = function (t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    };

    /////////// BOUNCE EASING: exponentially decaying parabolic bounce  //////////////

    // bounce easing in
    // t: current time, b: beginning value, c: change in position, d: duration
    Math.yasashiInBounce = function (t, b, c, d) {
        return c - Math.yasashiOutBounce (d-t, 0, c, d) + b;
    };
    // bounce easing out
    Math.yasashiOutBounce = function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    };
    // bounce easing in/out
    Math.yasashiInOutBounce = function (t, b, c, d) {
        if (t < d/2) return Math.yasashiInBounce (t*2, 0, c, d) * .5 + b;
        return Math.yasashiOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
    };

    function Yasashiku(){
        'use strict'
        var _self           = this;
        var _emitter        = new Emitter(this);
        var _stateList      = [];
        var _lastTime       = 0;
        var _lapsed         = 0;
        var _duration       = 1000;
        var _ratio          = 0;
        var _formulaName    = "yasashiInOutQuad";
        var _formula        = Math[_formulaName];
        var _active         = false;
        
        var _idTime;
        
        this.seconds; 
        this.formula;

        var StatesFromTo = function(target, to){
            var from    = {};
            
            this.from   = from;
            this.to     = to;
            this.target = target;

            this.update = function(){
                for(var property in to){
                    from[property] = target[property];
                }
            }
        }

        var stateCounter = 0;
        this.add = function(stateFrom, stateTo){
            _stateList.push(new StatesFromTo(stateFrom, stateTo));
            return stateCounter++;
        }

        this.removeByIndex = function(index){
            if(isNumber(index) && index > 0){
                _stateList.splice(Math.round(index), 1);
            }
        }
        var playDelay = function(){
            _active         = true;
            _formula        = Math[_formulaName];
            _lastTime       = Date.now();
            _lapsed         = 0;

            var length = _stateList.length;
            for(var index = 0; index <length; index++){
                _stateList[index].update();
            }
            update();
            emit("start");
        }

        this.play = function(seconds, delay){
            this.seconds    = seconds;
            cancelAnimationFrame(_idTime);
            if(!isNumber(delay)){
                delay = 0;
            }
            setTimeout(playDelay, delay);
        }

        this.stop = function(){
            cancelAnimationFrame(_idTime);
            _active     = false;
            _duration   = 0;
            emit("stop");
        }

        this.pause = function(){
            _active = false;
            emit("pause");
        }

        this.addEventListener = function(type, listener, context){
            _emitter.addEventListener(type, listener, context);
        }

        this.removeEventListener = function(type, listener, context){
            _emitter.removeEventListener(type, listener, context);
        }

        var emit = function(type){
            _emitter.emit(type, {ratio:_ratio, milliseconds:_duration});
        }

        var laps;
        var update = function(){
            if(!_active){
                return;
            }

            if(isNumber(_self.seconds)){
                _duration       = _self.seconds * 1000;
            }else{
                _self.seconds   = _duration/1000;
            }

            if(_duration == 0){
                // Early return
                return;
            }

            if(_self.formula in Math){
                _formulaName = _self.formula;
            }else{
                _self.formula = _formulaName;
            }

            var now     = Date.now();
            laps        = now - _lastTime;
            _lapsed     += laps;
            _lastTime   = now;

            if(_duration <= _lapsed){
                _ratio  = 1;
                _active = false;
            }else{
                _ratio = _formula(_lapsed, 0, 1, _duration);
            }

            var length = _stateList.length;
            var from;
            var to;
            var target;
            var states;
            for(var index=0; index < length; index++){
                states = _stateList[index];
                to     = states.to;
                from   = states.from;
                target = states.target;
                for(var property in to){
                    target[property] = from[property] + (to[property] - from[property])*_ratio;
                }
            }

            var type = "tick";

            if(!_active){
                _self.stop();
                type = "complete";    
            }else{
                _idTime = requestAnimationFrame(update);
            }
            
            emit(type);
        }
    }

    return new Yasashiku();
}