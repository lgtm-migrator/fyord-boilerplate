import { ParseJsx, Page, Route } from 'fyord';
import { Routes } from '../routes';

export class HashParamsPage extends Page {
  Title = 'Hash Params';

  Route = (route: Route) => route.path === Routes.HashParams;
  Html = async (route?: Route) => {
    const paramOne = route?.hashParams[0];
    const paramTwo = route?.hashParams[1];

    return <div>
      <h1>{this.Title}</h1>

      <p>Param one: {paramOne}</p>
      <p>Param two: {paramTwo}</p>
    </div>;
  };
}
