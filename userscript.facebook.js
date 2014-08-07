// ==UserScript==
// @name        SaucisSound
// @namespace   tzouille
// @match       *://*.facebook.com*
// @version     1.0.0
// @grant       none
// ==/UserScript==

(function () {

  /****************************************************
     ALREADY OPENED CONVERSATIONS
  *****************************************************/

  // what to do when a msg came
  var processMsg = function (spanElement) {

    // html of the span
    var html = spanElement.innerHTML;
    var regexp = /#sound:([A-Za-z]+)/i;
    var replace = '<audio controls style="width:50%" src="https://tzouille.no-ip.org/soundbox/mp3/\$1.mp3" type="audio/mpeg"></audio>';
    
    // we replace
    html = html.replace(regexp, replace);
    spanElement.innerHTML = html;
  };
  
  // Observer to know when a msg came
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // foreach mutation we will parse the content of the msg
      processMsg(mutation.addedNodes[0].querySelectorAll('span.null')[0]);
    });
  });

  // on launch
  var init = function () {
    
    // get all conversation div
    var conversations = document.querySelectorAll('div.conversation');
    for(i=0; i < conversations.length; i++) {
      
      // if the conversation is opened
      if(conversations[i].firstChild) {
        
        // we observe the childList trying to get the new msgs
        observer.observe(conversations[i].firstChild, { childList: true });

        // for every msg already sent we apply the algorithm
        spansMsg = conversations[i].firstChild.querySelectorAll('span.null');
        for(j=0; j < spansMsg.length; j++) {
          
          // we process them as a new msg
          processMsg(spansMsg[j]);
        }
      }
    }
  };

  // lets go when page is readyyy
  window.addEventListener(
    'load',
    function() {
      init();
    }
  );
  
})();