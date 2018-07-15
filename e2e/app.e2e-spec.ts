import { PercentilesUiPage } from './app.po';

describe('percentiles-ui App', () => {
  let page: PercentilesUiPage;

  beforeEach(() => {
    page = new PercentilesUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
