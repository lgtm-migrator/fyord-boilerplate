import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { ITimer } from 'tsbase/Utility/Timers/ITimer';
import { Timer } from 'tsbase/Utility/Timers/Timer';
import { ISerializer } from 'tsbase/Utility/Serialization/ISerializer';
import { IGenericStorage, DomStorage, DomStorageMode } from 'tsbase/Persistence/GenericStorage/module';
import { GenericResult } from 'tsbase/Patterns/Result/GenericResult';
import { JsonSerializer } from 'tsbase/Utility/Serialization/JsonSerializer';
import { IRouter, Router } from 'fyord';
import { FirebaseLoginResponse } from './models/FirebaseLoginResponse';
import { Constants } from '../../constants';
import { FirebaseRefreshResponse } from './models/FirebaseRefreshResponse';

export interface IAuthenticationService {
  Session: FirebaseLoginResponse | null;
  Login(email: string, password: string): Promise<GenericResult<FirebaseLoginResponse>>;
  RefreshSession(force: boolean): Promise<GenericResult<FirebaseRefreshResponse>>;
  Logout(): void;
  RedirectWhenUnAuthenticated(redirectPath: string): void;
}

export class AuthenticationService implements IAuthenticationService {
  private static instance: IAuthenticationService | null = null;
  // eslint-disable-next-line max-params
  public static Instance(
    client: HttpClient = new HttpClient(),
    serializer: ISerializer = new JsonSerializer(),
    router: IRouter = Router.Instance(),
    sessionStorage: IGenericStorage = new DomStorage(DomStorageMode.Session),
    sessionTimeoutTimer: ITimer = new Timer(),
    reloadPageFunction: Function = () => location.reload()
  ): IAuthenticationService {
    if (!this.instance) {
      this.instance = new AuthenticationService(
        client, serializer, router, sessionStorage, sessionTimeoutTimer, reloadPageFunction);
    }
    return this.instance;
  }
  public static Destroy(): void {
    this.instance = null;
  }

  private session: FirebaseLoginResponse | null = null;
  public get Session(): FirebaseLoginResponse | null {
    if (!this.session) {
      const result = this.sessionStorage.Get(FirebaseLoginResponse, Constants.Config.Session.Key);
      this.session = result.IsSuccess && result.Value ? result.Value : null;
      this.removeSessionOnTimeout();
    }

    return this.session;
  }

  private timeoutPromptActive = false;

  // eslint-disable-next-line max-params
  private constructor(
    private client: HttpClient,
    private serializer: ISerializer,
    private router: IRouter,
    private sessionStorage: IGenericStorage,
    private sessionTimeoutTimer: ITimer,
    private reloadPageFunction: Function
  ) {
    this.setupSessionTimeoutTimer();
  }

  public async Login(email: string, password: string): Promise<GenericResult<FirebaseLoginResponse>> {
    const result = new GenericResult<FirebaseLoginResponse>();

    const response = await this.client.Post(Constants.ExternalEndpoints.EmailAuthentication, JSON.stringify({
      email: email,
      password: password,
      returnSecureToken: true
    }));

    if (!response.ok) {
      result.ErrorMessages.push(`Failed with status code: ${response.status} | text: ${response.statusText}`);
      result.ErrorMessages.push((response as any).body?.error?.message);
    } else {
      result.Value = this.serializer.Serialize(FirebaseLoginResponse, response.body);
      this.saveLoginResponseToSessionStorage(result.Value as FirebaseLoginResponse);
    }

    return result;
  }

  public async RefreshSession(force: boolean): Promise<GenericResult<FirebaseRefreshResponse>> {
    const result = new GenericResult<FirebaseRefreshResponse>();
    const autoRefreshPoint = Constants.Config.Session.TimeoutWarningPoint * 2;

    if (this.Session && (force || this.Session.GetSecondsTillExpiration() <= autoRefreshPoint)) {
      const response = await this.client.Post(Constants.ExternalEndpoints.RefreshAuthentication, {
        grant_type: 'refresh_token',
        refresh_token: (this.Session as FirebaseLoginResponse).RefreshToken
      });

      if (!response.ok) {
        result.ErrorMessages.push(`Failed with status code: ${response.status} | text: ${response.statusText}`);
      } else {
        const refreshResponse = this.serializer.Serialize(FirebaseRefreshResponse, response.body);
        result.Value = refreshResponse;

        this.updateStoredSessionResponse(refreshResponse);
      }
    } else {
      result.AddError('No session to refresh');
    }

    return result;
  }

  public Logout(): void {
    this.sessionStorage.Remove(Constants.Config.Session.Key);
    this.sessionStorage.Remove(Constants.Config.Session.TimeoutDismissKey);
    this.session = null;
  }

  public RedirectWhenUnAuthenticated(redirectPath: string): void {
    if (!this.Session) {
      this.router.RouteTo(`/admin?redirectUrl=${redirectPath}`, false);
    }
  }

  private setupSessionTimeoutTimer() {
    this.sessionTimeoutTimer.Interval = Constants.Config.Session.TimeoutPollFrequency;
    this.sessionTimeoutTimer.AutoReset = true;
    this.sessionTimeoutTimer.Elapsed.push(this.evaluateSessionRefresh);
    this.sessionTimeoutTimer.Elapsed.push(this.removeSessionOnTimeout);
    this.sessionTimeoutTimer.Start();
  }

  private saveLoginResponseToSessionStorage(item: FirebaseLoginResponse): void {
    this.sessionStorage.Set(Constants.Config.Session.Key, item);
  }

  private updateStoredSessionResponse(refreshResponse: any) {
    const session = this.Session as FirebaseLoginResponse;

    session.IdToken = refreshResponse.IdToken;
    session.RefreshToken = refreshResponse.RefreshToken;
    session.ExpiresIn = refreshResponse.ExpiresIn;
    session.ResetTimestamp();
    this.saveLoginResponseToSessionStorage(session);
  }

  private evaluateSessionRefresh = (): void => {
    if (!this.timeoutPromptActive && this.Session) {
      const secondsTillTimeout = this.Session.GetSecondsTillExpiration();

      const userDismissedTimeoutDuringSession = this.sessionStorage.GetValue(
        Constants.Config.Session.TimeoutDismissKey).IsSuccess;
      const shouldOfferRefreshPrompt = !userDismissedTimeoutDuringSession
        && secondsTillTimeout < Constants.Config.Session.TimeoutWarningPoint;

      if (shouldOfferRefreshPrompt) {
        this.promptUserToRefreshSession();
      }
    }
  }

  private removeSessionOnTimeout = (): void => {
    if (this.session && this.session.GetSecondsTillExpiration() <= 60) {
      this.Logout();
      this.reloadPageFunction();
    }
  }

  private async promptUserToRefreshSession() {
    this.timeoutPromptActive = true;
    const shouldRefresh = window.confirm('Your session is about to expire. Would you like to extend it?');

    if (shouldRefresh) {
      await this.RefreshSession(true);
      alert('Session extended!');
    } else {
      this.sessionStorage.SetValue(Constants.Config.Session.TimeoutDismissKey, 'true');
      this.removeSessionOnTimeout();
    }

    this.timeoutPromptActive = false;
  }
}
