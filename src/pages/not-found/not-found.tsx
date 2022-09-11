import { ParseJsx, Page, RenderModes, Route, Asap } from 'fyord';
import { baseUrl, Routes } from '../../routes';
import styles from './not-found.module.css';

export class NotFoundPage extends Page {
  Title = 'Not Found';

  RenderMode = RenderModes.Dynamic;
  Route = async (route: Route) => {
    this.recoverFromNonReLoadableState(route);

    return true;
  };

  Template = async (route?: Route) => {
    return <div>
      <h1 class={styles.red}>{this.Title}</h1>

      <p>Could not find content matching, "{decodeURI(route?.href || '')}"</p>
      <p>Please check spelling. Otherwise the resource may have been moved.</p>
    </div>;
  }

  private recoverFromNonReLoadableState(route: Route) {
    Asap(() => {
      if (!location.href.includes(baseUrl)) {
        location.href = `${Routes.NotFound}?originalRoute=${route.href}`;
      }
    });
  }
}
