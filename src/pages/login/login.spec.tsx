import { RenderModes, Route, TestHelpers, Asap, IRouter } from 'fyord';
import { Mock } from 'tsmockit';
import { IAuthenticationService } from '../../services/authentication/AuthenticationService';
import { Login } from './login';

describe('Login', () => {
  let classUnderTest: Login;
  const pageMocks = TestHelpers.GetComponentMocks();
  const mockRouter = new Mock<IRouter>();
  const mockAuthenticationService = new Mock<IAuthenticationService>();


  beforeEach(() => {
    classUnderTest = new Login(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      mockAuthenticationService.Object,
      mockRouter.Object
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', async () => {
    const route = { path: '/login', queryParams: new Map() } as Route;
    expect(await classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', async () => {
    const route = { path: '/not-found', queryParams: new Map() } as Route;
    expect(await classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
