import { TestHelpers } from '../../fjord/utilities/tests/testHelpers.spec';
import { Route } from '../../fjord/core/module';
import { HomePage } from '../home';
import { Routes } from '../routes';

describe('HomePage', () => {
  let classUnderTest: HomePage;
  const pageMocks = TestHelpers.GetPageMocks();

  beforeEach(() => {
    classUnderTest = new HomePage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return true for routes that match', () => {
    const route = { path: Routes.Home } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: Routes.ChangeDetection } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render an h1', async () => {
    const content = await classUnderTest.Render();
    expect(content).toContain('<h1>fjord</h1>');
  });
});
