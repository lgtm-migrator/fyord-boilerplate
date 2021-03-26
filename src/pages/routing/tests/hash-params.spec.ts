import { TestHelpers, Route } from 'fyord';
import { Routes } from '../../routes';
import { HashParamsPage } from '../hash-params';

describe('HashParamsPage', () => {
  let classUnderTest: HashParamsPage;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new HashParamsPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return true for routes that match', () => {
    const route = { path: Routes.HashParams } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: Routes.ChangeDetection } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render without error if no route is defined', async () => {
    expect(await classUnderTest.Html()).toBeDefined();
  });

  it('should render html containing the first and second hash params', async () => {
    const firstParam = 'one';
    const secondParam = 'two';
    const route = { hashParams: [firstParam, secondParam] } as Route;

    const htmlString = JSON.stringify(await classUnderTest.Html(route));

    expect(htmlString).toContain(firstParam);
    expect(htmlString).toContain(secondParam);
  });
});
