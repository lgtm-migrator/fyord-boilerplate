import { TestHelpers } from '../../fjord/utilities/tests/testHelpers.spec';
import { Route } from '../../fjord/module';
import { Routes } from '../routes';
import { RoutingPage } from '../routing';

describe('RoutingPage', () => {
  let classUnderTest: RoutingPage;
  const pageMocks = TestHelpers.GetPageMocks();

  beforeEach(() => {
    classUnderTest = new RoutingPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return true for routes that match', () => {
    const route = { path: Routes.Routing } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: Routes.ChangeDetection } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render', async () => {
    expect(await classUnderTest.Render()).toBeTruthy();
  });
});
