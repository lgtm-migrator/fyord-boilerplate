import { ParseJsx, Jsx, Asap } from 'fyord';
import { InputTypes } from 'tsbase/Models/module';
import { CrudTypes } from '../../../../enums/module';
import { Base, ValueType, CrudInputProps } from '../base/base';
import styles from './text.module.css';

export class Text extends Base {
  constructor(
    props: CrudInputProps = {
      fieldName: '',
      formId: '',
      inputType: InputTypes.Text,
      crudType: CrudTypes.Read
    },
    children?: Jsx
  ) {
    super(props, children);
  }

  Template = async () => {
    Asap(() => {
      const inputControl = this.Element?.querySelector(`#${this.EditInputId}`) as HTMLInputElement;
      inputControl.value = this.fieldValue;
    });


    return <div class={styles.container}>
      <input
        type={this.props.inputType}
        placeholder={this.model.LabelFor(this.cleanFieldName)}
        id={this.EditInputId}
        readonly={this.readOnlyAttribute}
        onchange={() => {
          this.updateInputValue();
        }} />

      {this.hasImageExtension(this.fieldValue) &&
        <div>
          <label for={this.EditInputId}>Image Preview</label>
          <div class={styles.imageWrapper}>
            <img src={this.fieldValue} alt={`Image preview of ${this.model.LabelFor(this.cleanFieldName)}`} />
          </div>
        </div>}
    </div>;
  }

  protected getInputValue(): ValueType | ValueType[] {
    const inputElement = this.Element?.querySelector(`#${this.EditInputId}`);

    let inputValue: ValueType =
      (inputElement as HTMLInputElement).value;

    if (this.props.inputType === InputTypes.Number) {
      inputValue = parseFloat(inputValue);
    }

    return inputValue;
  }
}
