import { Mock, Times } from 'tsmockit';
import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { TestHelpers, Route } from 'fyord';
import { AwaitedHttpRequestPage } from '../awaited-http-request';
import { Routes } from '../routes';

describe('HttpRequestPage', () => {
  let classUnderTest: AwaitedHttpRequestPage;
  const pageMocks = TestHelpers.GetComponentMocks();
  const mockHttpClient = new Mock<HttpClient>();
  const jokeValue = 'funny joke lol';

  beforeEach(() => {
    mockHttpClient.Setup(c => c.GetStringAsync(''), `{ "icon_url": "", "id": "", "url": "", "value": "${jokeValue}" }`);

    classUnderTest = new AwaitedHttpRequestPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object,
      mockHttpClient.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should construct with default parameters', () => {
    expect(new AwaitedHttpRequestPage()).toBeDefined();
  });

  it('should return true for route matches', () => {
    expect(classUnderTest.Route({ path: Routes.AwaitedHttpRequest } as Route)).toBeTruthy();
  });

  it('should return false for other routes', () => {
    expect(classUnderTest.Route({ path: Routes.ChangeDetection } as Route)).toBeFalsy();
  });

  it('should render html', async () => {
    const htmlString = JSON.stringify(await classUnderTest.Html());

    mockHttpClient.Verify(c => c.GetStringAsync(''), Times.Once);
    expect(htmlString).toContain(jokeValue);
  });
});
