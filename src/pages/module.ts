import { Login } from './login/login';
import { WelcomePage } from './welcome/welcome';
import { NotFoundPage } from './not-found/not-found';

export const pages = [
  new Login(),
  new WelcomePage(),
  new NotFoundPage()
];
