import { ParseJsx, Jsx } from 'fyord';
import { Model, InputTypes } from 'tsbase/Models/module';
import { Strings } from 'tsbase/System/Strings';
import { CrudTypes } from '../../../../enums/module';
import { Base, CrudInputProps } from '../base/base';
import { GetInputComponentForType } from '../InputComponentMap';
import styles from './object.module.css';

export class Object extends Base {
  constructor(
    props: CrudInputProps = {
      fieldName: '',
      formId: '',
      inputType: InputTypes.Object,
      crudType: CrudTypes.Read
    },
    children?: Jsx
  ) {
    super(props, children);
  }

  Template = async () => {
    const keys = this.fieldValue ? this.fieldValue.ModelKeys as Array<any> : new Array<string>();

    return <div class={styles.container}>
      <ul>
        {keys.map(key => <li>
          <label>{this.fieldValue.GetLabelFor(key)}</label>
          {this.getInputControl(this.fieldValue, key)}
        </li>)}
      </ul>
    </div>;
  }

  protected getInputValue = (): string => Strings.Empty;

  private getInputControl(model: Model<any>, key: string): string {
    const dynamicFieldName = Strings.IsEmptyOrWhiteSpace(this.props.fieldName) ?
      key : `${this.props.fieldName}.${key}`;
    const inputType = model.InputTypeFor(m => m[key]);

    const inputParameters: CrudInputProps = {
      fieldName: dynamicFieldName,
      formId: this.props.formId,
      inputType: inputType as InputTypes,
      crudType: this.props.crudType
    };

    return GetInputComponentForType(inputParameters);
  }
}
