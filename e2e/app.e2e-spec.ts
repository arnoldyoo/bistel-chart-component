import { ChartComponentPage } from './app.po';

describe('chart-component App', () => {
  let page: ChartComponentPage;

  beforeEach(() => {
    page = new ChartComponentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
