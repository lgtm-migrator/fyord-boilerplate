import { Page, ParseJsx, Route } from 'fyord';
import { Classes } from '../enums/classes';
import { Routes } from './routes';

export class ExamplesPage extends Page {
  Title = 'Examples';
  private examples = [
    { label: 'Routing', href: Routes.Routing, description: 'Learn how to use the router' },
    { label: 'Security', href: Routes.Security, description: 'Best practices in fyord' },
    {
      label: 'Awaited Http Request',
      href: Routes.AwaitedHttpRequest,
      description: 'An page which renders upon completion of an asynchronous request'
    },
    {
      label: 'Loading Http Request',
      href: Routes.LoadingHttpRequest,
      description: 'A page which will display while loading - an can be preloaded if not the landing page'
    },
    { label: 'Change Detection', href: Routes.ChangeDetection, description: 'Usage of fyord\'s app state store and other forms of change detection' }
  ]

  Route = (route: Route) => route.path === Routes.Examples;

  Html = async () => {
    return <div>
      <h1>{this.Title}</h1>

      <ul>
        {this.examples.map((e, i) => <li key={i}>
          <a href={e.href}>{e.label}</a>
          <ul class={Classes.ListStyle}>
            <li><span>{e.description}</span></li>
          </ul>
        </li>)}
      </ul>
    </div>;
  }

  Behavior = () => { }
}
