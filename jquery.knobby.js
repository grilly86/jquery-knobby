/*
 * Knobby - jQuery Plugin
 * by Christian Frauscher
 * Examples and documentation at: http://github.com/grilly86/jquery.knobby.js/
 *
 * Version: 0.1 (2015-05-13)
 *
 */
(function ($) {
    $.fn.knobby = function (options) {
        var instanceIsPressed = [];
        var rad2deg = (180/Math.PI);
        var settings = $.extend({
            min:0,
            max:100,
            step:1,
            turn:1,
            size:4,
            handleSize:1,
            handleGap:.25,
            sensitivity: 1,
        }, options);
        var normalizeDegree = function(d) {
            if (d < 0) {
                d = normalizeDegree(d + 360);
            }
            return d;
        };
        var KnobbyVector = function(x,y){
            this.x = x;
            this.y = y;
        };

        var upOrDown = function(x,y,prevX,prevY,radius) {

            var x1 = radius - prevX;
            var x2 = radius - x;

            var y1 = radius - prevY;
            var y2 = radius - y;

            var v1 = new KnobbyVector(x1,y1);
            var v2 = new KnobbyVector(x2,y2);

            var a1 = Math.atan((v1.x)/(v1.y)) * rad2deg;
            var a2 = Math.atan((v2.x)/(v2.y)) * rad2deg;

            var alpha = a1 - a2;

            if (alpha > 90) { alpha -= 180 }
            if (alpha < -90) { alpha += 180 }

            return alpha;

        };

        this.each(function(n) {
            instanceIsPressed[n] = false;

            var $input = $(this);
            var $wrap = $("<div>");
            $wrap.addClass("knobby-wrap");
            var $knob = $("<div>");
            $knob.addClass("knobby-knob");
            var $handle = $("<div>");
            $handle.addClass("knobby-handle");
            var $knob_sh = $("<div>");
            $knob_sh.addClass("knobby-shadow");

            $knob_sh.appendTo($knob);
            $handle.appendTo($knob);
            $wrap.append($knob);

            // swap input
            $wrap.insertBefore(this);
            $input.insertAfter($knob);
            $input.addClass("knobby-input");

            var mouseIsDown = false;
            var prevX, prevY;

            var min = $input.attr("min") ? parseFloat($input.attr("min")) : settings.min;
            var max = parseFloat($input.attr("max")) || settings.max;
            var step = parseFloat($input.attr("step")) || settings.step;
            var turn = parseFloat($input.attr("turn")) || settings.turn;
            var exact_val = parseFloat($input.val()) || 0.0;
            var size = parseFloat($input.attr("size")) || settings.size;
            var handleSize = parseFloat($input.attr("handle-size")) || settings.handleSize;
            var handleGap = $input.attr("handle-gap") ? parseFloat($input.attr("handle-gap")) : settings.handleGap;
            var sensitivity = parseFloat($input.attr("sensitivity")) || settings.sensitivity;

            // formats numbers on init
            var decimals = (step.toString().length-1);
            if (decimals>0) decimals-=1;
            var val = (Math.round(exact_val/step)*step).toFixed(decimals);
            $input.val(val);
            $knob.css({width:size*2 + "em",height: size*2 + "em"});
            $handle.css({width:handleSize + "em", height: handleSize + "em", marginTop: -(handleSize/2)+"em", marginLeft:-handleSize/2+"em"});

            var width = parseFloat($knob.width());
            var self_triggered_change=false;

            $input.bind("input change", function (e) {
                if (!self_triggered_change) {
                    exact_val = parseFloat($(this).val()) || 0.0;
                    if ((typeof max !== "undefined") && (exact_val > max)) exact_val = max;
                    if ((typeof min !== "undefined") && (exact_val < min)) exact_val = min;
                    
                    refreshValue(e.type=="change");
                    draw();
                }
            });
            var lerp = function(start, end, amt ) {
                return (1-amt) * start + end * amt;
            }
            var currentFinger=0;
            $knob.bind("mousedown touchstart", function (e) {
                mouseIsDown = true;
                instanceIsPressed[n] = true;

                if (e.type == 'touchstart') {
                    currentFinger = e.originalEvent.changedTouches[0].identifier;
                }
            });
            $(window).bind("mousemove touchmove", function (e) {
                if (mouseIsDown) {
                    var x = 0,y = 0;
                    if (e.type == "mousemove") {
                        x = e.pageX - $knob.position().left;
                        y = e.pageY - $knob.position().top;
                    }
                    if(e.type == 'touchmove'){
                        var touch;
                        var touches = e.originalEvent.changedTouches;

                        if (touches) {
                            for (var t = 0; t < touches.length; t++) {
                                if (touches[t].identifier == currentFinger) {
                                    touch = touches[t];
                                }
                            }
                        }
                        if (touch) {
                            x = touch.pageX - $knob.position().left;
                            y = touch.pageY - $knob.position().top;
                        }
                    }
                    if ((x || y) && (prevX || prevY)) {
                        var change = upOrDown(x, y, prevX, prevY, width/2);
                        change = change / 360 * (max - min) / turn ;
                        exact_val += change * sensitivity;

                        if ((typeof max !== "undefined") && (exact_val > max)) {
                            exact_val = max;
                        }
                        if ((typeof min !== "undefined") && (exact_val < min)) {
                            exact_val = min;
                        }

                        refreshValue(true);
                        draw();
                        self_triggered_change = true;
                        $input.trigger("change");
                        self_triggered_change = false;
                    }
                    prevX = x;
                    prevY = y;
                    e.preventDefault();
                } else {
                    prevX = null;
                    prevY = null;
                }

                for(var i = 0; i<instanceIsPressed.length; i++) {
                    if (instanceIsPressed[i]) {
                        e.preventDefault();
                        return;
                    }
                }

            });
            $(window).bind("mouseup touchend", function (e) {
                mouseIsDown = false;
                prevX = undefined;
                prevY = undefined;

                instanceIsPressed[n] = false;
            });
            $knob.bind("dragstart drop", function () {
                return false;
            }).css("cursor", "pointer");

            var refreshValue = function(rewrite) {
                if (typeof rewrite == "undefined") rewrite = true;

                var decimals = (step.toString().length-1);
                if (decimals>0) decimals-=1;
                val = (Math.round(exact_val/step)*step).toFixed(decimals);

                if (rewrite) {
                    $input.val(val);
                }
            };
            var draw = function () {
                var degree = normalizeDegree((val-min) * (((360)*turn) / (max-min)));
                $handle.css("transform", " translateY(-"+parseFloat((size-handleSize/2)-handleGap)+"em) rotate(-" + degree + "deg)");
                $knob.css("transform", "rotate(" + degree + "deg)");
                $knob_sh.css("transform", "rotate(-" + degree + "deg)");
            };
            if ((typeof max !== "undefined") && (exact_val > max)) {
                exact_val = max;
            }
            if ((typeof min !== "undefined") && (exact_val < min)) {
                exact_val = min;
            }
            refreshValue(true);
            draw();
        });
        return this;
    };
}(jQuery));