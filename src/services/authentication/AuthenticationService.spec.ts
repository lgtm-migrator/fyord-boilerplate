/* eslint-disable max-lines */
import { Mock, TestHelpers, Times } from 'tsmockit';
import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { ISerializer } from 'tsbase/Utility/Serialization/ISerializer';
import { ITimer } from 'tsbase/Utility/Timers/ITimer';
import { GenericResult } from 'tsbase/Patterns/Result/GenericResult';
import { Strings } from 'tsbase/System/Strings';
import { IGenericStorage } from 'tsbase/Persistence/GenericStorage/module';
import { IRouter } from 'fyord';
import { Constants } from '../../constants';
import { AuthenticationService, IAuthenticationService } from './AuthenticationService';
import { FirebaseLoginResponse } from './models/FirebaseLoginResponse';
import { FirebaseRefreshResponse } from './models/FirebaseRefreshResponse';

describe('AuthenticationService', () => {
  const mockHttpClient = new Mock<HttpClient>();
  const mockSerializer = new Mock<ISerializer>();
  const mockRouter = new Mock<IRouter>();
  const mockSessionStorage = new Mock<IGenericStorage>();
  const mockTimer = new Mock<ITimer>();

  let classUnderTest: IAuthenticationService;

  const loginRequest = { email: 'email', password: 'password', returnSecureToken: true };
  const refreshRequest = { grant_type: 'refresh_token', refresh_token: 'testToken' };
  const loginResponseContent = new FirebaseLoginResponse();
  const stringLoginResponseContent = JSON.stringify(loginResponseContent);
  const refreshResponseContent = new FirebaseRefreshResponse();
  const failedResponse = { ok: false, status: 400, statusText: 'error', body: { error: { message: 'invalid' } } };
  const successfulSessionResult = new GenericResult<FirebaseLoginResponse>();
  successfulSessionResult.Value = new FirebaseLoginResponse();
  const failedSessionResult = new GenericResult<FirebaseLoginResponse>();
  failedSessionResult.ErrorMessages.push('test');

  function setupSession(mockSessionStorage: Mock<IGenericStorage>) {
    const successfulSessionResult = new GenericResult<FirebaseLoginResponse>();
    successfulSessionResult.Value = new FirebaseLoginResponse();
    mockSessionStorage.Setup(s => s.Get(FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
  }

  function resetClassUnderTest(): void {
    AuthenticationService.Destroy();

    classUnderTest = AuthenticationService.Instance(
      mockHttpClient.Object,
      mockSerializer.Object,
      mockRouter.Object,
      mockSessionStorage.Object,
      mockTimer.Object,
      () => { });
  }

  beforeEach(() => {
    mockTimer.Setup(t => t.Elapsed, []);
    mockTimer.Setup(t => t.Start());
    mockSerializer.Setup(s => s.Serialize(FirebaseLoginResponse, stringLoginResponseContent), loginResponseContent);
    mockSessionStorage.Setup(s => s.Set(Constants.Config.Session.Key, loginResponseContent));
    mockSessionStorage.Setup(s => s.Set(Constants.Config.Session.Key, refreshResponseContent));
    mockHttpClient.Setup(c => c.Post(Strings.Empty, loginRequest), { ok: true, status: 200, statusText: 'OK', body: loginResponseContent });
    mockHttpClient.Setup(c => c.Post(Strings.Empty, refreshRequest), { ok: true, status: 200, statusText: 'OK', body: refreshResponseContent });

    resetClassUnderTest();
  });

  it('should construct', () => {
    resetClassUnderTest();
    AuthenticationService.Instance(mockHttpClient.Object);
    expect(classUnderTest).toBeDefined();
  });

  it('should get current session when one exists', () => {
    setupSession(mockSessionStorage);
    resetClassUnderTest();

    const session = classUnderTest.Session;

    expect(session).toBeDefined();
  });

  it('should cache current session once retrieved', () => {
    mockSessionStorage.Setup(s => s.Get(
      FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
    resetClassUnderTest();

    const session = classUnderTest.Session;
    const cachedSession = classUnderTest.Session;

    expect(session).toEqual(cachedSession);
  });

  it('should return null for session when no session exists', () => {
    mockSessionStorage.Setup(s => s.Get(
      FirebaseLoginResponse, Constants.Config.Session.Key), failedSessionResult);
    resetClassUnderTest();

    const session = classUnderTest.Session;

    expect(session).toBeNull();
  });

  it('should return a successful result upon successful login', async () => {
    resetClassUnderTest();

    const result = await classUnderTest.Login(loginRequest.email, loginRequest.password);

    expect(result.IsSuccess).toBeTruthy();
    mockSessionStorage.Verify(s => s.Set(Constants.Config.Session.Key, loginResponseContent), Times.Once);
  });

  it('should return a failed result upon failed login', async () => {
    mockHttpClient.Setup(c => c.Post(Strings.Empty, loginRequest), failedResponse);
    resetClassUnderTest();

    const result = await classUnderTest.Login(loginRequest.email, loginRequest.password);

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(
      `Failed with status code: ${failedResponse.status} | text: ${failedResponse.statusText}`);
    expect(result.ErrorMessages).toContain(failedResponse.body.error.message);
  });

  it('should return a successful result upon successful session refresh', async () => {
    setupSession(mockSessionStorage);
    resetClassUnderTest();
    await classUnderTest.Login(loginRequest.email, loginRequest.password);

    const result = await classUnderTest.RefreshSession(true);

    expect(result.IsSuccess).toBeTruthy();
    mockSessionStorage.Verify(s => s.Set(Constants.Config.Session.Key, refreshResponseContent), Times.Once);
  });

  it('should return a failed result upon failed refresh', async () => {
    mockHttpClient.Setup(c => c.Post(Strings.Empty, refreshRequest), failedResponse);
    resetClassUnderTest();

    const result = await classUnderTest.RefreshSession(true);

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(
      `Failed with status code: ${failedResponse.status} | text: ${failedResponse.statusText}`);
  });

  it('should logout, clearing the current session and timeout dismiss keys', () => {
    mockSessionStorage.Setup(s => s.Remove(Constants.Config.Session.Key));
    mockSessionStorage.Setup(s => s.Remove(Constants.Config.Session.TimeoutDismissKey));
    resetClassUnderTest();

    classUnderTest.Logout();

    mockSessionStorage.Verify(s => s.Remove(Constants.Config.Session.Key), Times.Once);
    mockSessionStorage.Verify(s => s.Remove(Constants.Config.Session.TimeoutDismissKey), Times.Once);
  });

  it('should redirect to redirect path when user not authenticated', () => {
    const redirectPath = '/test';
    const expectedRedirectRoute = `/admin?redirectUrl=${redirectPath}`;
    mockRouter.Setup(r => r.RouteTo(expectedRedirectRoute, false));
    mockSessionStorage.Setup(s => s.Get(
      FirebaseLoginResponse, Constants.Config.Session.Key), failedSessionResult);
    resetClassUnderTest();

    classUnderTest.RedirectWhenUnAuthenticated(redirectPath);

    mockRouter.Verify(r => r.RouteTo(expectedRedirectRoute, false), Times.Once);
  });

  it('should not redirect to redirect path when user is authenticated', () => {
    const redirectPath = '/test';
    const expectedRedirectRoute = `/admin?redirectUrl=${redirectPath}`;
    mockRouter.Setup(r => r.RouteTo(expectedRedirectRoute, false));
    mockSessionStorage.Setup(s => s.Get(
      FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
    resetClassUnderTest();

    classUnderTest.RedirectWhenUnAuthenticated(redirectPath);

    mockRouter.Verify(r => r.RouteTo(expectedRedirectRoute, false), Times.Never);
  });

  function setupRefreshRequest(secondsTillExpiration: number) {
    (successfulSessionResult.Value as FirebaseLoginResponse).ExpiresIn = secondsTillExpiration.toString();
    resetClassUnderTest();
    classUnderTest['timeoutPromptActive'] = false;
    spyOn(window, 'alert');
  }

  it('should refresh a user\s session if given confirmation', () => {
    const secondsTillExpiration = 10;
    mockSessionStorage.Setup(s => s.Get(FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
    mockSessionStorage.Setup(s => s.GetValue(Constants.Config.Session.TimeoutDismissKey), failedSessionResult);
    spyOn(window, 'confirm').and.returnValue(true);
    setupRefreshRequest(secondsTillExpiration);

    classUnderTest['evaluateSessionRefresh']();

    const refreshRequestSent = TestHelpers.TimeLapsedCondition(() => {
      return mockHttpClient.TimesMemberCalled(
        c => c.Post(Constants.ExternalEndpoints.RefreshAuthentication, refreshRequest)) > 0;
    });
    expect(refreshRequestSent).toBeTruthy();
  });

  it('should not refresh a user\s session if the session is not about to expire', () => {
    const secondsTillExpiration = 1000;
    mockSessionStorage.Setup(s => s.Get(FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
    mockSessionStorage.Setup(s => s.GetValue(Constants.Config.Session.TimeoutDismissKey), failedSessionResult);
    spyOn(window, 'confirm').and.returnValue(true);
    setupRefreshRequest(secondsTillExpiration);

    classUnderTest['evaluateSessionRefresh']();

    expect(window.confirm).toHaveBeenCalledTimes(0);
  });

  it('should not refresh a user\s session if the user has dismissed refreshing in the past', () => {
    const secondsTillExpiration = 100;
    mockSessionStorage.Setup(s => s.Get(FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
    mockSessionStorage.Setup(s => s.GetValue(Constants.Config.Session.TimeoutDismissKey), successfulSessionResult);
    spyOn(window, 'confirm').and.returnValue(true);
    setupRefreshRequest(secondsTillExpiration);

    classUnderTest['evaluateSessionRefresh']();

    expect(window.confirm).toHaveBeenCalledTimes(0);
  });

  it('should not queue multiple refresh prompts', () => {
    const secondsTillExpiration = 100;
    mockSessionStorage.Setup(s => s.Get(FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
    mockSessionStorage.Setup(s => s.GetValue(Constants.Config.Session.TimeoutDismissKey), failedSessionResult);
    spyOn(window, 'confirm').and.returnValue(true);
    setupRefreshRequest(secondsTillExpiration);

    classUnderTest['evaluateSessionRefresh']();
    classUnderTest['evaluateSessionRefresh']();

    expect(window.confirm).toHaveBeenCalledTimes(1);
  });

  // it('should set a user dismissed variable when a user dismisses refreshing', () => {
  //   const secondsTillExpiration = 100;
  //   mockSessionStorage.Setup(s => s.Get(FirebaseLoginResponse, Constants.Config.Session.Key), successfulSessionResult);
  //   mockSessionStorage.Setup(s => s.GetValue(Constants.Config.Session.TimeoutDismissKey), failedSessionResult);
  //   spyOn(window, 'confirm').and.returnValue(false);
  //   setupRefreshRequest(secondsTillExpiration);

  //   classUnderTest['evaluateSessionRefresh']();
  //   classUnderTest['evaluateSessionRefresh']();

  //   const userDismissedSet = TestHelpers.TimeLapsedCondition(() => {
  //     return mockSessionStorage.TimesMemberCalled(
  //       s => s.SetValue(Constants.Config.Session.TimeoutDismissKey, 'true')) > 0;
  //   });
  //   expect(userDismissedSet).toBeTruthy();
  //   expect(window.confirm).toHaveBeenCalledTimes(1);
  // });
});
