// ==UserScript==
// @name         Trivia Chat Filtering
// @namespace    TriviaChatters
// @version      1.2
// @description  Selectively Filter the Extra "Features" on CamMedia Chat Sites (many gateway sites hence generic match)
// @author       Zavreyon
// @match        https://*/*
// @match        http://*/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {

    // Uses keywords found in p.ticker class to selectively filter 'event' content. Because regular chat doesn't reside in the p.ticker class, the same keywords said in chat should NOT trigger their removal.
    // Please Note that shortly after joining/changing rooms, the undesired content may flash for a second before being removed. This should dissipate once the chat scrollbar is active (because it renders behind the input box BEFORE scrolling).

    const $USER = "zavreyon"; //Change to your chat username, in LOWERCASE. This is only needed for the "relevant to you" options.

    waitForKeyElements ("#chatText p.ticker", () => {

        // Comment/Uncomment Lines Below to Disable/Enable Removing of Features on an individual basis.
        $('p.ticker:contains("rolled"), p.ticker:contains("slots")').remove(); //Hide Casino Bullshit
        $('p.ticker:contains("accepted")').remove(); //Hide Others' Private Chats (your own invites should still show in box)
        //$('p.ticker:contains("sent"):not(:contains("' + $USER + '"), :contains("sent you"))').remove(); //Hide Tips except yours

        //Only leave ONE line below uncommented.
        //$('p.ticker:contains("rated")').remove(); //Hide ALL Rates
        //$('p.ticker:contains("rated"):not(:contains("' + $USER + '")').remove(); //Hide Rates Except Relevant to You
        //$('p.ticker:contains("rated"):not(:contains(": 4")').remove(); //Hide Rates Except 4s.
        $('p.ticker:contains("rated"):not(:contains("' + $USER + '"), :contains(": 4"))').remove(); //Hide Rates except Relevant to You AND 4s

    });
})();
