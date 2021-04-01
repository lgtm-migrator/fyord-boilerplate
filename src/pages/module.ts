import { HomePage } from './home/home';
import { RoutingPage } from './routing';
import { RouteParamsPage } from './routing/route-params';
import { QueryParamsPage } from './routing/query-params';
import { HashParamsPage } from './routing/hash-params';
import { SecurityPage } from './security';
import { AwaitedHttpRequestPage } from './awaited-http-request';
import { ChangeDetectionPage } from './change-detection/change-detection';
import { NotFoundPage } from './not-found/not-found';
import { StyleguidePage } from './styleguide/styleguide';
import { ExamplesPage } from './examples';
import { LoadingHttpRequestPage } from './loading-http-request';

export * from './routes';
export const pages = [
  new HomePage(),
  new StyleguidePage(),
  new ExamplesPage(),
  new RoutingPage(),
  new RouteParamsPage(),
  new QueryParamsPage(),
  new HashParamsPage(),
  new SecurityPage(),
  new AwaitedHttpRequestPage(),
  new LoadingHttpRequestPage(),
  new ChangeDetectionPage(),
  new NotFoundPage()
];
