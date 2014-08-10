var $ = require('jquery');

/**
 * Conversation class
 *
 * @constructor
 */
function Conversation(element, observer) {
    'use strict';

    // HTMLElement, lowest subtree
    //
    // Dock
    // |__div
    //    |__div <--- this one
    //       |__msg
    //       |__msg
    //       |__msg
    this.element = element || null;

    // Observer
    this.observer = observer || null;

    // Regex
    this.soundRegex = /#s:([A-Za-z0-9_-]+)/i;
}

/**
 * Gets the HTML Element referencing
 * the Conversation.
 *
 * @return {HTMLElement}
 */
Conversation.prototype.getElement = function () {
    'use strict';

    if (this.element === null) {
        throw 'conversation.element should not be null.'
    }

    return this.element;
};

/**
 * Gets the observer attached to the
 * Dock element.
 *
 * @return {MutationObserver}
 */
Conversation.prototype.getObserver = function () {
    'use strict';

    if (this.observer === null) {
        this.observer = new MutationObserver($.proxy(function (mutations) {
            mutations.forEach($.proxy(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    this.parseMessages(mutation.addedNodes[i]);
                }
            }, this));
        }, this))
    }

    return this.observer;
};

/**
 * Gets the configuration for the observer.
 *
 * @returns {{childList: boolean}}
 */
Conversation.prototype.getObserverConfiguration = function () {
    'use strict';

    return { childList: true };
};

/**
 * Searches for span.null
 *
 * @param element
 */
Conversation.prototype.parseMessages = function (element) {
    'use strict';

    element = $(element);
    var messages = element.find('span.null');

    if (window.MELGIBSOUND_DEBUG === true) {
        console.log('MELGIBSOUND: ' + messages.length + ' messages found.', messages);
    }

    // processSound for each msg
    for (var i = 0; i < messages.length; i++) {
        var sound = this.soundRegex.exec(messages[i].innerHTML);
        if (sound !== null) {
            this.processSound(messages[i], sound[1]);
        }
    }
};

/**
 * Checks if sounds exists and replace with an audio tag
 * nothing otherwise.
 *
 * @param message
 * @param sound
 */
Conversation.prototype.processSound = function (message, sound) {
    'use strict';

    if (window.MELGIBSOUND_DEBUG === true) {
        console.log('MELGIBSOUND: Sound synthax found. Sound ' + sound + ' identified.', message);
    }

    // where to find the sound
    var url = 'https://tzouille.no-ip.org/soundbox/mp3/';
    var extension = '.mp3';

    // use GM to make an HTTP request
    // more flexible than jQuery
    GM_xmlhttpRequest({
        method: 'GET',
        url: url + sound + extension,
        context: {'url': url, 'sound': sound, 'extension': extension, 'regex': this.soundRegex, 'message': message },
        onload: function (response) {
            if (response.status === 200) {
                if (window.MELGIBSOUND_DEBUG === true) {
                    console.log('MELGIBSOUND: Sound ' + response.context.sound + ' incrusted!');
                }

                // replace the sound
                response.context.message.innerHTML = response.context.message.innerHTML.replace(
                    response.context.regex,
                        '<audio controls style="width: 150px;" src="'
                        + response.context.url + '\$1' + response.context.extension + '" type="audio/mpeg"></audio>'
                );
            }
        }
    });
};

/**
 * When the conversation has ben added.
 */
Conversation.prototype.added = function () {
    'use strict';

    // get the element
    var element = this.getElement();

    // already visible messages
    this.parseMessages(element[0]);

    // add observer for this element
    // for the future sent messages
    var observer = this.getObserver();
    observer.observe(element[0], this.getObserverConfiguration())
};

/**
 * When the conversation has been removed.
 */
Conversation.prototype.removed = function () {
    'use strict';

    var observer = this.getObserver();
    observer.disconnect();

    delete this.element;
    delete this.observer;
};

module.exports = Conversation;