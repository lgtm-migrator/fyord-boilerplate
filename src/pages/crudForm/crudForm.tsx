import { Page, ParseJsx, Route } from 'fyord';
import styles from './crudForm.module.css';

export class CrudForm extends Page {
  Title = 'CrudForm';
  Route = async (route: Route) => route.path === '/crudForm';

  Template = async () => {
    return <div class={styles.container}>Hello crudForm page!</div>;
  }
}
