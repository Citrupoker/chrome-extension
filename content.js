$(document).ready(function() {
    var captchaDiv = $('iframe[title="recaptcha widget"]');
    var url = document.URL;

    chrome.storage.sync.get(['token', 'solveOnLoad'], function(items) {
        if (items.solveOnLoad) {
            solve(items.token, captchaDiv, url, items.solveOnLoad);
        }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var token = request.token;
        solve(token, captchaDiv, url);
    });
});

function solve(token, captchaDiv, url, solveOnLoad) {
    if (captchaDiv.length > 0) {
        // If there actually is a recaptcha on the page and a token, get the solution and insert it in the appropriate textarea        
        if (token) {
            // Add an alert above the captcha div to let the user know their solution is on its way
            if ($('.notification').length > 0) {
                $('.notification').html('Captcha being solved. Please wait.');
            } else {
                $('<h2 style="border:1px solid red;border-radius:5px;text-align: center;padding:6px;">Captcha being solved. Please wait.</h2>').insertBefore(captchaDiv);
                captchaDiv.prev('h2').addClass('notification');
            }

            var keyStart = captchaDiv.attr('src').indexOf('?k=') + 3;
            var keyEnd = captchaDiv.attr('src').indexOf('&co=');
            var recaptchaKey = captchaDiv.attr('src').substring(keyStart, keyEnd);

            getSolution(token, url, recaptchaKey, function(solution, invalidToken) {
                if (solution) {
                    $('#g-recaptcha-response').val(solution);
                    chrome.storage.sync.get('submitAfterSolved', function(result) {
                        if (result.submitAfterSolved)
                            if ($('[type="submit"]').length > 0) $('[type="submit"]').click();
                            else $('[type="button"]').click();
                        else 
                            $('.notification').html('Captcha is solved. You can now submit your form.');
                    });
                } else if (invalidToken) {
                    $('.notification').html('The token you have provided is invalid. Please try again.');
                }
            });
        } else {
            if ($('.notification').length > 0) {
                // There is no token provided
                $('.notification').html('Please provide a token.');
            } else {
                $('<h2 style="border:1px solid yellow;border-radius:5px;text-align: center;padding:6px;">Please provide a token.</h2>').insertBefore(captchaDiv);
                captchaDiv.prev('h2').addClass('notification');
            }
        }
    } else if (!solveOnLoad) {
        if ($('.notification').length > 0) {
            // There is no recaptcha on the currently opened tab
            $('.notification').html('Something went wrong. It looks like you\'re on the wrong page.');
        } else {
            $('body').prepend('<h2 style="border:1px solid red;border-radius:5px;text-align: center;padding:6px;">Something went wrong. It looks like you\'re on the wrong page.</h2>');            
            $('h2').addClass('notification');
        }
    }
}

function getSolution(token, url, key, callback) {
  // Uses anticaptcha library and returns solution
  var anticaptcha = Anticaptcha(token);
  anticaptcha.setWebsiteURL(url);
  anticaptcha.setWebsiteKey(key);
  anticaptcha.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116");
  
  anticaptcha.getBalance(function (err, balance) {
      if (err) {
          console.error(err);
          callback(null, true);
      }
      if (balance > 0) {
          anticaptcha.createTaskProxyless(function (err, taskId) {
              if (err) {
                  console.error(err);
                  return;
              }
  
              console.log(taskId);
  
              anticaptcha.getTaskSolution(taskId, function (err, taskSolution) {
                  if (err) {
                      console.error(err);
                      return;
                  }
  
                  callback(taskSolution);
              });
          });
      }
  });
}