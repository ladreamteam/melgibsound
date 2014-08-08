(function () {

    // Don't run on frames or iframes
    if (window.top != window.self) {
        return;
    }

    // else start!
    var $ = require('jquery');
    $(document).ready(
        function () {
            window.MELGIBSOUND_DEBUG = false;

            // init script
            if (!window.MELGIBSOUND_DOCK) {
                var Dock = require('./scripts/Dock.js');
                window.MELGIBSOUND_DOCK = new Dock;
                window.MELGIBSOUND_DOCK.init();
            }
        }
    );
})();