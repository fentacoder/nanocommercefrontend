paypal.use( ['login'], function (login) {
  login.render ({
    "appid":"",
    "authend":"sandbox",
    "scopes":"openid",
    "containerid":"cwppButton",
    "responseType":"code",
    "locale":"en-us",
    "buttonType":"CWP",
    "buttonShape":"pill",
    "buttonSize":"lg",
    "fullPage":"true",
    "returnurl":"http://localhost:4200/payment"
  });
});
