describe('The movies page', function () {
  it('has the expected title', function () {
    // when
    browser.get('http://localhost:8100');

    // then
    expect(element(by.css('.header-item.title')).getText()).toEqual('MOVIES');
  });

  it('has a menu button that displays the left menu', function () {
    // given
    browser.get('http://localhost:8100');

    // when
    element(by.css('.buttons.buttons-left button')).click();

    // then
    expect(element(by.css('body')).getAttribute('class')).toMatch('menu-open');
  });

  it('links a movie entry in the movie list to its page', function () {
    // given
    browser.get('http://localhost:8100');

    // when
    element(by.repeater('movie in movies').row(0)).click();

    // then
    expect(element.all(by.cssContainingText('.header-item.title', 'Avatar')).count()).toEqual(1);
  });
});
