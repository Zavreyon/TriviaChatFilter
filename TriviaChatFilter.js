// ==UserScript==
// @name         Trivia Chat Filtering
// @namespace    TriviaChatters
// @version      1.3
// @description  Selectively Filter the Extra "Features" on Triviachatters and other CamMedia Chat Sites
// @author       Zavreyon
// @match        https://*.cammedia.com/*
// @match        http://*.cammedia.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==
/* globals jQuery, $, */

(function optionsFiltering() {

    const $USER = "zavreyon";

    // Attach the options to unsafeWindow, making them globally accessible
    unsafeWindow.options = {
        showCasino: false, // Show/Hide Casino
        showTips: true, // Show/Hide Tips (yours will always show)
        showRain: false, // Show/Hide 'Make it Rain' Animation
        showPvts: false, // Show/Hide Other's Private Chat notifications (your requests will still show)
        showRates: "showBoth", // showAll, hideAll", "showFours", "showOwn", showBoth
    };

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (!unsafeWindow.options.showCasino) {
                $('p.ticker:contains("rolled"), p.ticker:contains("slots")').remove();
            }

            if (!unsafeWindow.options.showTips) {
                $('p.ticker:contains("sent"):not(:contains("' + $USER + '"), :contains("sent you"))').remove();
            }

            if (!unsafeWindow.options.showPvts) {
                $('p.ticker:contains("accepted")').remove();
            }

            if (unsafeWindow.options.showRates === "hideAll") {
                $('p.ticker:contains("rated")').remove();
            } else {
                if (unsafeWindow.options.showRates === "showOwn") {
                    $('p.ticker:contains("rated"):not(:contains("' + $USER + '")').remove();
                }

                if (unsafeWindow.options.showRates === "showFours") {
                    $('p.ticker:contains("rated"):not(:contains(": 4")').remove();
                }

                if (unsafeWindow.options.showRates === "showBoth") {
                    $('p.ticker:contains("rated"):not(:contains("' + $USER + '"), :contains(": 4"))').remove();
                }
            }
        });
    });

    observer.observe($("#chatText")[0], {childList: true});
})();



(function tokenCounterFix () {

    // Create a new span to hold the spendable tokens.
    var newSpan = document.createElement('span');
    newSpan.id = 'newCreditsSpan';

    // Select the element that contains the total tokens.
    var element = document.querySelector('#creditsSpan');

    if (element) {
        setInterval(function() {
            // Get the total tokens from the element's text.
            var totalTokens = parseInt(element.textContent, 10);

            // Calculate the spendable tokens.
            var spendableTokens = totalTokens - 270;

            // Create another span to hold just the spendable tokens value and style it.
            var valueSpan = document.createElement('span');
            valueSpan.style.color = spendableTokens < 10 ? '#ff9999' : '#3399FF'; // Red if negative, blue if zero or positive.
            valueSpan.style.fontWeight = 'bold'; // Makes the text bold.
            valueSpan.textContent = spendableTokens.toString() + ' ';

            // Set the text in the new span and append the value span to it.
            newSpan.textContent = ' |  Spendable Tokens: ';
            newSpan.appendChild(valueSpan);

            // If the new span hasn't been added to the page yet, add it.
            if (!document.querySelector('#newCreditsSpan')) {
                element.parentNode.insertBefore(newSpan, element.nextSibling);
            } else {
                // If the new span is already on the page, just update the value.
                document.querySelector('#newCreditsSpan').replaceChild(valueSpan, document.querySelector('#newCreditsSpan').lastChild);
            }
        }, 1000); // Update the display every 1 second.
    }
})();


(function optionDropDown() {
    // Create a dropdown menu element
    const dropdown = document.createElement("select");
    dropdown.id = 'filterOptionsDropdown';
    dropdown.style.marginRight = "10px";

    // Create an object to store the options and their labels
    const optionLabels = {
        showCasino: "Casino",
        showTips: "Tips",
        showRain: "Rain",
        showPvts: "Privates",
        showRates: "Rates",
    };

    // Create a default option for the title or description
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Filter Options";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    // Iterate over the other options and create dropdown options
    for (const option in unsafeWindow.options) {
        const optionElement = createOptionElement(option, optionLabels[option]);
        dropdown.appendChild(optionElement);
    }


    // Attach an event listener to the dropdown
    dropdown.addEventListener("click", function (event) {
        const option = event.target.value;
        if (option) {
            if (option === "showRates") {
                // Cycle through rate options
                const rateOptions = ["hideAll", "showFours", "showOwn", "showBoth", "showAll"];
                const currentIndex = rateOptions.indexOf(unsafeWindow.options[option]);
                const nextIndex = (currentIndex + 1) % rateOptions.length;
                unsafeWindow.options[option] = rateOptions[nextIndex];
            } else {
                // Toggle boolean options
                unsafeWindow.options[option] = !unsafeWindow.options[option];
            }
            updateOptionStyles(option);

            // Trigger the change event manually
            const changeEvent = new Event("change");
            dropdown.dispatchEvent(changeEvent);
        }
    });

    // Reset the dropdown to default when user clicks outside of it
    dropdown.addEventListener("blur", function () {
        const defaultOption = dropdown.querySelector("option[value='']");
        dropdown.value = ""; // Reset to default value
        defaultOption.selected = true; // Select the default option
    });


    // Create a dropdown option element
    function createOptionElement(option, label) {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.text = getOptionText(option, label);

        // Update the initial style
        setTimeout(function () {
            updateOptionStyles(option);
        }, 0);

        return optionElement;
    }

    // Update the style of a dropdown option based on its value
    function updateOptionStyles(option) {
        const optionElement = dropdown.querySelector(`option[value="${option}"]`);
        const isTrue = unsafeWindow.options[option];

        if (optionElement) {
            optionElement.style.backgroundColor = getOptionColor(option);
            optionElement.style.textDecoration = isTrue ? "none" : "line-through";
            optionElement.text = getOptionText(option, optionLabels[option]);
        }
    }

    // Cycle through the rates option values
    function cycleRatesOption() {
        const ratesOption = unsafeWindow.options.showRates;
        const rateOptions = ["hideAll", "showFours", "showOwn", "showBoth", "showAll"];
        const currentIndex = rateOptions.indexOf(ratesOption);
        const newIndex = (currentIndex + 1) % rateOptions.length;
        unsafeWindow.options.showRates = rateOptions[newIndex];
        updateOptionStyles("showRates");
    }

    // Get the text for the option based on its value
    function getOptionText(option, label) {
        if (option === "showRates") {
            return "Rates: " + unsafeWindow.options.showRates;
        }
        return unsafeWindow.options[option] ? label + " Shown" : label + " Hidden";
    }

    // Get the color for the option based on its value
    function getOptionColor(option) {
        if (option === "showRates") {
            switch (unsafeWindow.options.showRates) {
                case "hideAll":
                    return "red";
                case "showFours":
                    return "orange";
                case "showOwn":
                    return "yellow";
                case "showBoth":
                    return "green";
                case "showAll":
                    return "blue";
                default:
                    return "black";
            }
        }
        return unsafeWindow.options[option] ? "green" : "red";
    }

    // Insert the dropdown before the btn_getTokens button
    const btnGetTokens = document.getElementById("btn_getTokens");
    if (btnGetTokens) {
        const parentDiv = btnGetTokens.parentNode.parentNode; // Access the grandparent div element
        parentDiv.insertBefore(dropdown, btnGetTokens.parentNode); // Insert the dropdown before the btn_getTokens parent div
    } else {
        console.error("btn_getTokens button not found.");
    }
})
();
