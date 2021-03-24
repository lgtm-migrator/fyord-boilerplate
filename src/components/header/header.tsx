import { ParseJsx, Component } from 'fyord';
import { Routes } from '../../pages/routes';
import styles from './header.module.scss';

export class HeaderComponent extends Component {
  private links = [
    { href: Routes.Home, label: 'Home' },
    { href: Routes.Examples, label: 'Examples' },
    { href: Routes.Styleguide, label: 'Styleguide' }
  ];

  Html = async () =>
    <header>
      <nav class={styles.nav}>
        <ul>
          {this.links.map((l, i) => <li key={i}>
            <a href={l.href}>{l.label}</a>
          </li>)}
        </ul>
      </nav>
    </header>;
}
