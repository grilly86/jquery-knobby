(function ($) {

    $.fn.knobby = function (options) {
        var settings = $.extend({
            color:'#556b2f',
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

        var Vector = function(x,y){
            this.x = x;
            this.y = y;
        };
        Vector.prototype.normalize=function() {
            var length = this.length();
            return new Vector(this.x/length, this.y/length);
        },
        Vector.prototype.length=function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };


        var upOrDown = function(x,y,prevX,prevY,width,height) {
            var direction = 0.0;

            var x1 = width/2 - prevX;
            var x2 = width/2 - x;

            var y1 = height/2 - prevY;
            var y2 = height/2 - y;

            var v1 = new Vector(x1,y1).normalize();
            var v2 = new Vector(x2,y2).normalize();

            var a1 = Math.atan((v1.x)/(v1.y)) * (180/Math.PI);
            var a2 = Math.atan((v2.x)/(v2.y)) * (180/Math.PI);

            var alpha = a1 - a2;

            if (alpha > 90) { alpha -= 180 }
            if (alpha < -90) { alpha += 180 }

console.log(alpha);

            return alpha;

        };

        this.each(function() {
            var mouseIsDown = false;
            var $knob = $("<div>");
            $knob.addClass("knobby-knob");
            var $value = $("<div>");
            $value.addClass("knobby-value");

            var $knob_sh = $("<div>");
            $knob_sh.addClass("knobby-shadow");

            $knob_sh.appendTo($knob);
            $value.appendTo($knob);

            $knob.insertBefore(this);

            var $this = $(this);

            $this.bind("input change", function () {
                if (!self_triggered_change) {
                    exact_val = parseFloat($(this).val()) || 0.0;
                }
                draw();
            });

            var prevX, prevY;
            var width = $knob.width();
            var height = $knob.height();


            var min = parseFloat($this.attr("min")) || settings.min;
            var max = parseFloat($this.attr("max")) || settings.max;
            var step = $this.attr("step") || settings.step;
            var turn = parseFloat($this.attr("turn")) || settings.turn;
            var exact_val = parseFloat($this.val()) || 0.0;

            var self_triggered_change=false;

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


                    var val = exact_val-exact_val%step;

                    self_triggered_change=true;
                    $this.val(val).trigger("input");
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
                var degree = normalizeDegree((exact_val-min) * (((360)*turn) / (max-min)));
                $value.css("transform", " translateY(-3em) rotate(-" + degree + "deg)");
                $knob.css("transform", "rotate(" + degree + "deg)");
                $knob_sh.css("transform", "rotate(-" + degree + "deg)");

                console.log("draw:" + exact_val);
            };

            draw();
        });

        return this;


    };






}(jQuery));