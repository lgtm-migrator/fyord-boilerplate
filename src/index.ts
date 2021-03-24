import { App, Environments } from 'fyord';
import { defaultLayout, InitialState, State } from './core/module';
import './styles/styles.scss';

import './pages/module';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Development);
  app.InitializeStore<State>(InitialState);
  await app.Start(defaultLayout);

  window['app'] = app;
})();
