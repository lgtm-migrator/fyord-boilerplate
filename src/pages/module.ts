import { Default } from './default/default';
import { Content } from './content/content';
import { Login } from './login/login';
import { WelcomePage } from './welcome/welcome';

export const pages = [
  new Content(),
  new Login(),
  new WelcomePage(),
  new Default()
];
