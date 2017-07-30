$(document).ready(function() {
    $('.solveBtn').click(function() {
        // Send the token to the content script when the solve button is pressed
        var anticaptchaToken = $('.token').val();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {token: anticaptchaToken});
        });
    });
});