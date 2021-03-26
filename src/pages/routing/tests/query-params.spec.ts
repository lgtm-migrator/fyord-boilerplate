import { TestHelpers, Route } from 'fyord';
import { Routes } from '../../routes';
import { QueryParamsPage } from '../query-params';

describe('QueryParamsPage', () => {
  let classUnderTest: QueryParamsPage;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new QueryParamsPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return true for routes that match', () => {
    const route = { path: Routes.QueryParams } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: Routes.ChangeDetection } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render without error if no route is defined', async () => {
    expect(await classUnderTest.Html()).toBeDefined();
  });

  it('should render html containing the first and second query params', async () => {
    const firstParam = 'one';
    const secondParam = 'two';
    const route = {
      queryParams: new Map<string, string>([
        ['one', firstParam],
        ['two', secondParam]
      ])
    } as Route;

    const htmlString = JSON.stringify(await classUnderTest.Html(route));

    expect(htmlString).toContain(firstParam);
    expect(htmlString).toContain(secondParam);
  });
});
