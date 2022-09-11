import { Page, ParseJsx, Route } from 'fyord';
import { Routes } from '../../routes';
import styles from './test.module.css';

export class Test extends Page {
  Title = 'Test';
  Route = async (route: Route) => route.href === Routes.Test;

  Template = async () => {
    return <div class={styles.container}>Hello test page!</div>;
  }
}
