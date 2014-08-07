// todo: browserify add a line that fires twice "load"/"ready" events

(function () {
    window.addEventListener(
        'load',
        function () {
            window.MELGIBSOUND_DEBUG = false;

            // init script
            if (!window.MELGIBSOUND_DOCK) {
                var Dock = require('./scripts/Dock.js');
                window.MELGIBSOUND_DOCK = new Dock;
                window.MELGIBSOUND_DOCK.init();
            }
        },
        false
    );
})();