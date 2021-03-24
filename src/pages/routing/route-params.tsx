import { ParseJsx, Page, Route } from 'fyord';
import { Routes } from '../routes';

export class RouteParamsPage extends Page {
  Title = 'Route Params';

  Route = (route: Route) =>
    route.path.startsWith(Routes.RouteParams) &&
    route.routeParams.length === 5;

  Html = async (route?: Route) => {
    const paramOne = route?.routeParams[3];
    const paramTwo = route?.routeParams[4];

    return <div>
      <h1>{this.Title}</h1>

      <p>Param one: {paramOne}</p>
      <p>Param two: {paramTwo}</p>

      <div>
        {paramOne === 'one' ?
          <a href={`${Routes.RouteParams}/three/four`}>/three/four</a> :
          <a href={`${Routes.RouteParams}/one/two`}>/one/two</a>}
      </div>
    </div>;
  };
}
