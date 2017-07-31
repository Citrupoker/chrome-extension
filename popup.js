$(document).ready(function() {
    var solve = function() {
        localStorage.setItem('token', $('.token').val());
        // Send the token to the content script when the solve button is pressed
        var anticaptchaToken = $('.token').val();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {token: anticaptchaToken, submit: $('.submit').is(':checked')});
        });
    }

    // Check for token and checkboxes in local storage to set up on load
    if (localStorage.getItem('token') !== null)
        $('.token').val(localStorage.getItem('token'));
    if (localStorage.getItem('solveOnLoad') == 'true')
        $('.onload').prop('checked', true);
    if (localStorage.getItem('submitAfterSolved') == 'true') 
        $('.submit').prop('checked', true);

    // Store checkbox status in local storage on change
    $('.onload').change(function() {
        localStorage.setItem('solveOnLoad', $('.onload').is(':checked'));
    });
    $('.submit').change(function() {
        localStorage.setItem('submitAfterSolved', $('.submit').is(':checked'));
    });

    $('.solveBtn').click(solve);


});