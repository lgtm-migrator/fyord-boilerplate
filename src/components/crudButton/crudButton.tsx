import { Component, ParseJsx, Jsx, Fragment } from 'fyord';
import { CrudTypes } from '../../enums/module';
import { Models } from '../../models/module';
import { IAuthentication, Authentication } from '../../services/authentication/Authentication';
import { Icons } from './icons';
import styles from './crudButton.module.css';

type Props = {
  type: CrudTypes,
  model: Models
}

export class CrudButton extends Component {
  constructor(
    private props: Props = {
      type: CrudTypes.Read,
      model: Models.Content
    },
    _children?: Jsx,
    private authentication: IAuthentication = Authentication.Instance()) {
    super();
  }

  Template = async () => <>
    {this.authentication.Session &&
      <a class={styles.container} href={`/admin/content/${this.props.type}/${this.props.model}?path=${this.App.Router.CurrentRoute?.path}`}>
        {Icons[this.props.type]}
      </a>}
  </>;
}
