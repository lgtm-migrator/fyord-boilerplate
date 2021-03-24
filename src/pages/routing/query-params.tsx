import { ParseJsx, Page, Route } from 'fyord';
import { Routes } from '../routes';

export class QueryParamsPage extends Page {
  Title = 'Query Params';

  Route = (route: Route) => route.path === Routes.QueryParams;
  Html = async (route?: Route) => {
    const paramOne = route?.queryParams.get('one');
    const paramTwo = route?.queryParams.get('two');

    return <div>
      <h1>{this.Title}</h1>

      <p>Param one: {paramOne}</p>
      <p>Param two: {paramTwo}</p>
    </div>;
  };
}
