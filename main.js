(function () {
    window.addEventListener(
        'load',
        function () {
            window.MELGIBSOUND_DEBUG = false;

            // init script
            var Dock = require('./scripts/Dock.js');
            window.MELGIBSOUND_DOCK = window.MELGIBSOUND_DOCK || new Dock;
            window.MELGIBSOUND_DOCK.init();
        }
    );
})();