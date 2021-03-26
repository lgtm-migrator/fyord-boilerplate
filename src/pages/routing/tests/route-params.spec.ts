import { TestHelpers, Route } from 'fyord';
import { Routes } from '../../routes';
import { RouteParamsPage } from '../route-params';

describe('RouteParamsPage', () => {
  let classUnderTest: RouteParamsPage;
  const pageMocks = TestHelpers.GetComponentMocks();
  const route = { path: Routes.RouteParams, routeParams: ['examples', 'routing', 'route-params', 'one', 'two'] } as Route;

  beforeEach(() => {
    classUnderTest = new RouteParamsPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return true for routes that match', () => {
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const appStoreRoute = { path: Routes.ChangeDetection } as Route;
    expect(classUnderTest.Route(appStoreRoute)).toBeFalsy();
  });

  it('should render without error if no route is defined', async () => {
    expect(await classUnderTest.Html()).toBeDefined();
  });

  it('should render html containing the first and second query params', async () => {
    const htmlString = JSON.stringify(await classUnderTest.Html(route));

    expect(htmlString).toContain('one');
    expect(htmlString).toContain('two');
  });
});
