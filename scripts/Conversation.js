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
 * Search for span.null to replace #mySound
 * into a audio tag.
 *
 * @param element
 */
Conversation.prototype.parseMessages = function (element) {
    'use strict';

    element = $(element);
    var messages = element.find('span.null');

    if (window.MELGIBSOUND_DEBUG === true) {
        console.log(messages.length + ' messages found.');
    }

    // where to find the sound
    var url = 'https://tzouille.no-ip.org/soundbox/mp3/';
    var extension = '.mp3';

    // how to process a sound
    var regexp = /#s:([A-Za-z0-9_-]+)/i;
    var replace = '<audio controls style="width:50%" src="' + url + '\$1' + extension + '" type="audio/mpeg"></audio>';

    for (var i = 0; i < messages.length; i++) {
        var html = messages[i].innerHTML;
        messages[i].innerHTML = html.replace(regexp, replace);
    }
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