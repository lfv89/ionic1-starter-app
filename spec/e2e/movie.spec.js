describe('The movie page', function () {
  describe('The first movie', function () {
    it('has the expected title', function () {
      // when
      browser.get('http://localhost:8100/#/movies/0');

      // then
      expect(element.all(by.cssContainingText('.header-item.title', 'Avatar')).count()).toEqual(1);
    });
  });

  it('has a menu button that displays the left menu', function () {
    // given
    browser.get('http://localhost:8100');

    // when
    element(by.css('.buttons.buttons-left button')).click();

    // then
    expect(element(by.css('body')).getAttribute('class')).toMatch('menu-open');
  });
});
