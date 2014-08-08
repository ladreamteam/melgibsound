var $ = require('jquery');
var Conversation = require('./Conversation');

/**
 * Page class
 *
 * @constructor
 */
function Page(element, observer) {
    'use strict';

    // HTML Element
    this.element = element || null;

    // PageObserver
    this.observer = observer || null;

    // Conversation
    this.conversation = null;
}

/**
 * Gets the HTML Element referencing
 * the Page, in facebook.
 *
 * @return {HTMLElement}
 */
Page.prototype.getElement = function () {
    'use strict';

    if (this.element === null) {
        this.element = $('div[role=log] > ul');
    }

    return this.element;
};

/**
 * Gets the observer attached to the
 * Page element.
 *
 * @return {MutationObserver}
 */
Page.prototype.getObserver = function () {
    'use strict';

    if (this.observer === null) {
        this.observer = new MutationObserver($.proxy(function (mutations) {
            mutations.forEach($.proxy(function (mutation) {
                this.changeConversation();
            }, this));
        }, this))
    }

    return this.observer;
};

/**
 * Gets the configuration for the observer.
 *
 * @returns {{attributes: boolean}}
 */
Page.prototype.getObserverConfiguration = function () {
    'use strict';

    return { attributes: true };
};

/**
 * When a conversation changes.
 */
Page.prototype.changeConversation = function () {
    'use strict';

    if (this.conversation !== null) {
        if (window.MELGIBSOUND_DEBUG === true) {
            console.log('MELGIBSOUND: Conversation removed.');
        }

        this.conversation.removed();
    }

    var conversation = new Conversation(this.getElement());
    this.conversation = conversation;

    if (window.MELGIBSOUND_DEBUG === true) {
        console.log('MELGIBSOUND: Conversation added.');
    }

    // start processing
    conversation.added();
};


/**
 * Initializes the process.
 */
Page.prototype.init = function () {
    'use strict';

    // get the element
    var element = this.getElement();

    // add the current conversation
    this.changeConversation();

    // add observer for this element
    // for the future opened conversation
    // or removed conversation
    var observer = this.getObserver();
    observer.observe(element[0], this.getObserverConfiguration())
};

module.exports = Page;