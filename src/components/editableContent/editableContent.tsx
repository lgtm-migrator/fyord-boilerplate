import { Component, ParseJsx, Jsx } from 'fyord';
import { InputTypes } from '../../enums/module';
import { Models } from '../../models/module';
import styles from './editableContent.module.css';

type Props = {
  inputType: InputTypes,
  location: string,
  model: Models,
  field: string
}

export class EditableContent extends Component {
  constructor(
    private props: Props = {
      inputType: InputTypes.Text,
      location: '',
      model: Models.Content,
      field: ''
    },
    _children?: Jsx
  ) {
    super();
  }

  Template = async () => <div class={styles.container}>
    {JSON.stringify(this.props)}
  </div>;
}
