import { app } from './app';
import { defaultLayout } from './layouts';
import './pages/module';
import './styles/base.css';

(async () => {
  await app.Start(defaultLayout);

  if (navigator.serviceWorker) {
    await navigator.serviceWorker.register(
      '/service-worker.js', { scope: '/' });
  }
})();
