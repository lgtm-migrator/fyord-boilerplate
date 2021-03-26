import { TestHelpers, Route } from 'fyord';
import { Routes } from '../routes';
import { SecurityPage } from '../security';

describe('SecurityPage', () => {
  let classUnderTest: SecurityPage;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new SecurityPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should return true for routes that match', () => {
    const route = { path: Routes.Security } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: Routes.ChangeDetection } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render html', async () => {
    expect(await classUnderTest.Html()).toBeDefined();
  });
});
