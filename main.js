(function () {

    // Don't run on frames or iframes
    if (window.top != window.self) {
        return;
    }

    // start function
    var melgibsound = function () {
        window.MELGIBSOUND_DEBUG = false;

        // init script
        if (!window.MELGIBSOUND_DOCK) {
            var Dock = require('./scripts/Dock.js');
            window.MELGIBSOUND_DOCK = new Dock;
            window.MELGIBSOUND_DOCK.init();
        }
    };

    // if chrome use jQuery
    if ((/chrome/i).test(navigator.userAgent)) {
        var $ = require('jquery');
        $(document).ready(melgibsound);
    }
    else {
        window.addEventListener('load', melgibsound, false);
    }

})();