import { Mock, Times } from 'tsmockit';
import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { Strings } from 'tsbase/Functions/Strings';
import { TestHelpers, RenderModes, Route } from 'fyord';
import { Routes } from '../routes';
import { LoadingHttpRequestPage } from '../loading-http-request';

describe('SyncHttpRequestPage', () => {
  let classUnderTest: LoadingHttpRequestPage;
  const pageMocks = TestHelpers.GetComponentMocks();
  const mockHttpClient = new Mock<HttpClient>();
  const jokeValue = 'funny joke lol';

  beforeEach(() => {
    mockHttpClient.Setup(c => c.GetStringAsync(Strings.Empty), `{ "icon_url": "", "id": "", "url": "", "value": "${jokeValue}" }`);

    classUnderTest = new LoadingHttpRequestPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object,
      mockHttpClient.Object);

    const div = document.createElement('div');
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Id), div);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should construct with default parameters', () => {
    expect(new LoadingHttpRequestPage()).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', () => {
    const route = { path: Routes.LoadingHttpRequest } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: Routes.AwaitedHttpRequest } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render html with data', async () => {
    const htmlString = JSON.stringify(await classUnderTest.Html());
    mockHttpClient.Verify(c => c.GetStringAsync(''), Times.Once);
    expect(htmlString).toContain(jokeValue);
  });

  it('should render html when loading data', async () => {
    mockHttpClient.Setup(c => c.GetStringAsync(Strings.Empty), null);
    classUnderTest = new LoadingHttpRequestPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object,
      mockHttpClient.Object);

    const htmlString = JSON.stringify(await classUnderTest.Html());
    expect(htmlString).toContain('Loading...');
  });
});
