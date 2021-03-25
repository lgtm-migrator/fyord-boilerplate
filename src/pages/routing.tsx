import { ParseJsx, Page, RenderModes, Route } from 'fyord';
import { Classes } from '../enums/classes';
import { Routes } from './routes';

export class RoutingPage extends Page {
  Title = 'Routing';

  RenderMode = RenderModes.Static;
  Route = (route: Route) => route.path === Routes.Routing;
  Html = async () => {
    return <div>
      <h1>{this.Title}</h1>
      <p>Routing in fyord is seamless.  Simply use normal anchor tags, and local urls which aren't target blank will be routed on the client.</p>
      <p>The below examples demonstrate this. Follow any of the "params" links to see how to make use of the respective parameter types.</p>

      <ul class={Classes.ListStyle}>
        <li><a href={`${Routes.RouteParams}/one/two`}>Route Params</a></li>
        <li><a href={`${Routes.QueryParams}?one=1&two=2`}>Query Params</a></li>
        <li><a href={`${Routes.HashParams}#one#two`}>Hash Params</a></li>
        <li><a href={Routes.Routing} target="_blank">Target Blank</a></li>
        <li><a href="https://duckduckgo.com/">External Route</a></li>
      </ul>
    </div>;
  }
}
