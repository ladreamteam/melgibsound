var $ = require('jquery');
var Conversation = require('./Conversation');

/**
 * Dock class
 *
 * @constructor
 */
function Dock(element, observer) {
    'use strict';

    // HTML Element
    this.element = element || null;

    // DockObserver
    this.observer = observer || null;

    // Conversation[]
    this.conversations = {};
}

/**
 * Gets the HTML Element referencing
 * the Dock, in facebook.
 *
 * @return {HTMLElement}
 */
Dock.prototype.getElement = function () {
    'use strict';

    if (this.element === null) {
        this.element = $('.fbNubGroup.clearfix.videoCallEnabled');
    }

    return this.element;
};

/**
 * Gets the observer attached to the
 * Dock element.
 *
 * @return {MutationObserver}
 */
Dock.prototype.getObserver = function () {
    'use strict';

    if (this.observer === null) {
        this.observer = new MutationObserver($.proxy(function (mutations) {
            mutations.forEach($.proxy(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    this.addConversation(mutation.addedNodes[i]);
                }
                for (var j = 0; j < mutation.removedNodes.length; j++) {
                    this.removeConversation(mutation.removedNodes[i]);
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
Dock.prototype.getObserverConfiguration = function () {
    'use strict';

    return { childList: true };
};

/**
 * When a new conversation is added to the dock.
 *
 * @param element
 */
Dock.prototype.addConversation = function (element) {
    'use strict';

    // transform to jQuery element
    element = $(element);
    var key = element[0].__FB_TOKEN[0];

    // if conversation does not exist
    if (!this.conversations[key]) {
        // create a new Conversation on this element
        element = $(element.find('div.conversation')[0].firstChild);
        var conversation = new Conversation(element);

        // store it the array of handled conversations
        this.conversations[key] = conversation;

        if (window.MELGIBSOUND_DEBUG === true) {
            console.log('MELGIBSOUND: Conversation ' + key + ' added.');
        }

        // start processing
        conversation.added();
    }
};

/**
 * When a conversation is removed from the dock.
 *
 * @param element
 */
Dock.prototype.removeConversation = function (element) {
    'use strict';

    // transform to jQuery element
    element = $(element);
    var key = element[0].__FB_TOKEN[0];

    // if conversation exists
    if (this.conversations[key]) {
        // get it thanks to the array of handled conversations
        var conversation = this.conversations[key];
        delete this.conversations[key];

        if (window.MELGIBSOUND_DEBUG === true) {
            console.log('MELGIBSOUND: Conversation ' + key + ' removed.');
        }

        // start processing
        conversation.removed();
    }
};

/**
 * Initializes the process.
 */
Dock.prototype.init = function () {
    'use strict';

    // get the element
    var element = this.getElement();

    // already opened conversation
    var children = element.children();

    if (window.MELGIBSOUND_DEBUG === true) {
        console.log('MELGIBSOUND: ' + children.length + ' opened conversation(s) found.');
    }

    for (var i = 0; i < children.length; i++) {
        this.addConversation(children[i]);
    }

    // add observer for this element
    // for the future opened conversation
    // or removed conversation
    var observer = this.getObserver();
    observer.observe(element[0], this.getObserverConfiguration())
};

module.exports = Dock;