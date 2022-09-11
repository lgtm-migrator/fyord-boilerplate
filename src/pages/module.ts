import { Test } from './test/test';
import { WelcomePage } from './welcome/welcome';
import { NotFoundPage } from './not-found/not-found';

export const pages = [
  new Test(),
  new WelcomePage(),
  new NotFoundPage()
];
