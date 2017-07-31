$(document).ready(function() {
    var solve = function() {
        chrome.storage.sync.set({'token': $('.token').val()});
        // Send the token to the content script when the solve button is pressed
        var anticaptchaToken = $('.token').val();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {token: anticaptchaToken});
        });
    }

    // Check for token and checkboxes in chrome storage to set up on load
    chrome.storage.sync.get('token', function(result) {
        if (result.token)
            $('.token').val(result.token);
    });
    chrome.storage.sync.get('solveOnLoad', function(result) {
        $('.onload').prop('checked', result.solveOnLoad);
    });
    chrome.storage.sync.get('submitAfterSolved', function(result) {
        $('.submit').prop('checked', result.submitAfterSolved);
    });

    // Store checkbox status in chrome storage on change
    $('.onload').change(function() {
        chrome.storage.sync.set({'solveOnLoad': $('.onload').is(':checked')});
    });
    $('.submit').change(function() {
        chrome.storage.sync.set({'submitAfterSolved': $('.submit').is(':checked')});
    });

    $('.solveBtn').click(solve);


});