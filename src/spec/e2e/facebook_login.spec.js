describe('The facebook login', function () {
  var email, pass;

  beforeEach(function () {
    email = process.env.FB_EMAIL
    pass  = process.env.FB_PASS
  })

  it('let the user login with a valid facebook email/pass', function () {
    // given
    browser.get('http://localhost:8100');

    // when
    element(by.cssContainingText('.button.facebook', 'LOGIN WITH FACEBOOK')).click();

    browser.ignoreSynchronization = true;

    browser.getAllWindowHandles().then(function (handles) {
      appHandle = handles[0];
      facebookHandle = handles[1];

      browser.switchTo(facebookHandle).window(facebookHandle).then(function () {
        element(by.id('email')).sendKeys(email);
        element(by.id('pass')).sendKeys(pass);

        element(by.buttonText('Log In')).click()
      });

      // then
      browser.switchTo(appHandle).window(appHandle).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8100/#/movies');
        expect(element(by.cssContainingText('.title', 'MOVIES' )));
      });
    });
  });
});
