/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
              return window.setTimeout(callback, 1000/60);
            };
})();

/**
 * Ticker constructor. This prototype provides functionality for animating and calculating
 * frame statistics.
 *
 * @returns {object} The ticker object.
 */
function Ticker() {
    this.tickCount = 0;
    this.t = 0.0;
    this.dt = 0.0;

    /**
     * Starts or restarts the ticker.
     *
     * @param {object} update - An object with an update() method called every frame.
     */
    this.start = function(owner, update) {
        "use strict";

        this.tickCount = 0;
        this.t = new Date().getTime();
        this.dt = 0.0;

        var _this = this;
        function tick() {
            var now = new Date().getTime();
            _this.dt = (now - _this.t) / 1000.0;
            _this.t = now;
            _this.tickCount++;

            owner.update();

            requestAnimFrame(tick);
        }

        requestAnimFrame(tick);
    };
}
