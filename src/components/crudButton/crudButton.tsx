import { Component, ParseJsx, Jsx, Fragment } from 'fyord';
import { CrudTypes } from '../../enums/module';
import { Models } from '../../models/module';
import { IAuthentication, Authentication } from '../../services/authentication/Authentication';
import { Icons } from './icons';
import styles from './crudButton.module.css';
import { Routes } from '../../routes';

type Props = {
  type: CrudTypes,
  model: Models
}

export class CrudButton extends Component {
  private get path(): string | undefined {
    const currentPath = this.App.Router.Route.CurrentIssue?.path;
    return currentPath === '/' ? '/root' : currentPath;
  }

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
      <a class={styles.container} href={Routes.Admin(this.props.type, this.props.model, this.path as string)}>
        {Icons[this.props.type]}
      </a>}
  </>;
}
