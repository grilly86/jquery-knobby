(function ($) {
    $.fn.knobby = function (options) {
        var settings = $.extend({
            turns:1,
            min:0,
            max:100,
            step:1
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
        KnobbyVector.prototype.normalize=function() {
            var length = this.length();
            return new Vector(this.x/length, this.y/length);
        },
        KnobbyVector.prototype.length=function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        var upOrDown = function(x,y,prevX,prevY,width,height) {
            var direction = 0.0;

            var x1 = width/2 - prevX;
            var x2 = width/2 - x;

            var y1 = height/2 - prevY;
            var y2 = height/2 - y;

            var v1 = new KnobbyVector(x1,y1); //.normalize();
            var v2 = new KnobbyVector(x2,y2); //.normalize();

            var a1 = Math.atan((v1.x)/(v1.y)) * (180/Math.PI);
            var a2 = Math.atan((v2.x)/(v2.y)) * (180/Math.PI);

            var alpha = a1 - a2;

            if (alpha > 90) { alpha -= 180 }
            if (alpha < -90) { alpha += 180 }

            return alpha;

        };

        this.each(function() {
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
            var width = $knob.width();
            var height = $knob.height();

            var min = parseFloat($input.attr("min")) || settings.min;
            var max = parseFloat($input.attr("max")) || settings.max;
            var step = parseFloat($input.attr("step")) || settings.step;
            var turn = parseFloat($input.attr("turn")) || settings.turn;
            var exact_val = parseFloat($input.val()) || 0.0;

            // formats numbers on init
            var decimals = (step.toString().length-1);
            if (decimals>0) decimals-=1;
            var val = (Math.round(exact_val/step)*step).toFixed(decimals);
            $input.val(val);

            var self_triggered_change=false;

            $input.bind("input change", function () {
                if (!self_triggered_change) {
                    exact_val = parseFloat($(this).val()) || 0.0;
                }
                draw();
            });


            $knob.bind("mousedown", function (e) {
                mouseIsDown = true;
            });
            $knob.bind("mousemove", function (e) {
                var x = e.clientX - $knob.position().left;
                var y = e.clientY - $knob.position().top;

                if (mouseIsDown) {

                    var change = upOrDown(x, y, prevX, prevY, width, height);
                    change = change / 360/turn*(max-min);

                    exact_val += change;
                    if ((typeof max !== "undefined") && (exact_val > max)) exact_val = max;
                    if ((typeof min !== "undefined") && (exact_val < min)) exact_val = min;
                    //var val = exact_val - ((exact_val)% step)  + step;

                    self_triggered_change=true;
                    $input.val(val).trigger("input");
                    self_triggered_change=false;
                }
                prevX = x;
                prevY = y;

                e.preventDefault();
            });
            $knob.bind("dragstart drop", function () {
                return false;
            }).css("cursor", "pointer");

            $(window).bind("mouseup", function (e) {
                mouseIsDown = false;
            });
            var draw = function () {

                var decimals = (step.toString().length-1);
                if (decimals>0) decimals-=1;
                val = (Math.round(exact_val/step)*step).toFixed(decimals);
                $input.val(val);

                var degree = normalizeDegree((val-min) * (((360)*turn) / (max-min)));

                $handle.css("transform", " translateY(-3em) rotate(-" + degree + "deg)");
                $knob.css("transform", "rotate(" + degree + "deg)");
                $knob_sh.css("transform", "rotate(-" + degree + "deg)");
            };
            draw();
        });
        return this;
    };
}(jQuery));