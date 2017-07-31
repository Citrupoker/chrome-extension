chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var captchaDiv = $('#recaptcha-demo')
    var token = request.token;
    var url = document.URL;

    if(token){
        // Add an alert above the captcha div to let the user know their solution is on its way
        $('<h2 style="border:1px solid red;border-radius:5px;text-align: center;padding:6px;">Captcha being solved. Please wait.</h2>').insertBefore(captchaDiv);
        captchaDiv.prev('h2').addClass('notification');
    }else {
        $('<h2 style="border:1px solid yellow;border-radius:5px;text-align: center;padding:6px;">Please provide a token</h2>').insertBefore(captchaDiv);
        captchaDiv.prev('h2').addClass('notification');
    }




    if (captchaDiv.length > 0) {
        // If there actually is a recaptcha on the page, get the solution and insert it in the appropriate textarea
        var recaptchaKey = captchaDiv.attr('data-sitekey');

        getSolution(token, url, recaptchaKey, function(solution) {
            $('#g-recaptcha-response').val(solution);
            $('.notification').html('Captcha is solved. You can now submit your form.');
        });
    } else 
        // There is not recaptcha on the currently opened tab
        alert( "Something went wrong. It looks like you're on the wrong page.");
});

function getSolution(token, url, key, callback) {
  // Uses anticaptcha library and returns solution
  var anticaptcha = Anticaptcha(token);
  anticaptcha.setWebsiteURL(url);
  anticaptcha.setWebsiteKey(key);
  anticaptcha.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116");
  
  anticaptcha.getBalance(function (err, balance) {
      if (err) {
          console.error(err);
          return;
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