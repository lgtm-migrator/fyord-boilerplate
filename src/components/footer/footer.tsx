import { ParseJsx, Component } from '../../fjord/module';
import styles from './footer.module.scss';

export class FooterComponent extends Component {
  Html = async () =>
    <footer class={styles.footer}>
      <h2>Footer</h2>
    </footer>;
}
