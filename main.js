(function () {

    // Don't run on frames or iframes
    if (window.top != window.self) {
        return;
    }

    // we will need jQuery for some operations
    var $ = require('jquery');

    /**
     * Function which starts the script
     */
    var melgibsound = function () {
        // we will check the location to know if
        // we need to use the Dock or the Page
        if ((/https?:\/\/(www.)?facebook.com\/messages(\/.*)?/i).test(window.location)) {
            // init script
            if (window.MELGIBSOUND_PAGE) {
                if (window.MELGIBSOUND_DEBUG === true) {
                    console.info('MELGIBSOUND: Page deleted.');
                }

                window.MELGIBSOUND_PAGE.destroy();
                delete window.MELGIBSOUND_PAGE;
            }

            if (window.MELGIBSOUND_DEBUG === true) {
                console.info('MELGIBSOUND: Page added.');
            }

            var Page = require('./src/Page');
            window.MELGIBSOUND_PAGE = new Page;
            window.MELGIBSOUND_PAGE.init();
        }

        // init script for the dock anyway
        if (window.MELGIBSOUND_DOCK) {
            if (window.MELGIBSOUND_DEBUG === true) {
                console.info('MELGIBSOUND: Dock deleted.');
            }

            window.MELGIBSOUND_DOCK.destroy();
            delete window.MELGIBSOUND_DOCK;
        }

        var Dock = require('./src/Dock');
        window.MELGIBSOUND_DOCK = new Dock;
        window.MELGIBSOUND_DOCK.init();
    };

    /***********************************************************************
     *
     ***********************************************************************/

    window.MELGIBSOUND_DEBUG = true;

    // Chrome needs to use the $.ready to start
    // the script after every thing is loaded.
    if ((/chrome/i).test(navigator.userAgent)) {
        if (window.MELGIBSOUND_DEBUG === true) {
            console.info('MELGIBSOUND: Chrome detected.');
        }

        $(document).ready(melgibsound);
    }
    else {
        if (window.MELGIBSOUND_DEBUG === true) {
            console.info('MELGIBSOUND: !Chrome detected.');
        }

        // atm: for others (ff tested), use window is enough.
        window.addEventListener('load', melgibsound, false);
    }
})();