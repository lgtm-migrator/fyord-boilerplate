import { App, IRouter, Page, ParseJsx, Route, Router, SeoService, Fragment, Reference, State } from 'fyord';
import { Routes } from '../../routes';
import { Authentication, IAuthentication } from '../../services/authentication/Authentication';
import { FirebaseLoginResponse } from '../../services/authentication/models/FirebaseLoginResponse';
import styles from './login.module.css';

export class Login extends Page {
  private redirectUrl?: string;
  @State private session?: FirebaseLoginResponse | null;
  @Reference private email!: HTMLInputElement;
  @Reference private password!: HTMLInputElement;

  Title = 'Login';
  Description = 'Authenticate with your application';

  constructor(
    seoService = SeoService.Instance,
    app = App.Instance(),
    private authenticationService: IAuthentication = Authentication.Instance(),
    private router: IRouter = Router.Instance()
  ) {
    super(seoService, app);

    this.session = this.authenticationService.Session;
  }

  Route = async (route: Route) => {
    this.redirectUrl = route.queryParams.get('redirectUrl');
    return route.path === Routes.Login;
  };

  Template = async () => {
    return <div class={styles.container}>
      <h1>Login</h1>

      {this.redirectUrl && <p>You <em>must</em> login before proceeding to "{this.redirectUrl}"</p>}

      <form onsubmit={this.onSubmit} aria-label="Login Form">
        {this.session ? <>
          <p>Currently authenticated as <strong>"{this.session.Email}"</strong></p>
          <button type="submit">Logout</button>
        </> : <>
          <div class="input-wrapper">
            <label for="email">Email</label>
            <input ref={this.email} type="text" name="Email" placeholder="email@domain.com" />
          </div>
          <div class="input-wrapper">
            <label for="password">Password</label>
            <input ref={this.password} type="password" name="Password" placeholder="SUPERstrongP@" />
          </div>

          <button type="submit">Login</button>
        </>}
      </form>
    </div>;
  }

  private onSubmit = async (event: Event) => {
    event.preventDefault();
    if (this.session) {
      this.authenticationService.Logout();
      this.session = null;
    } else {
      const loginResult = await this.authenticationService.Login(this.email.value, this.password.value);
      if (loginResult.IsSuccess) {
        this.session = loginResult.Value;
        if (this.redirectUrl) {
          this.router.RouteTo(this.redirectUrl, false);
        }
      } else {
        alert(loginResult.ErrorMessages.join('\n'));
      }
    }
  };
}
