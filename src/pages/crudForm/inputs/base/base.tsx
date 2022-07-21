import { Component, Jsx } from 'fyord';
import { Model, InputTypes } from 'tsbase/Models/module';
import { Result } from 'tsbase/Patterns/Result/Result';
import { Strings } from 'tsbase/System/Strings';
import { CrudTypes } from '../../../../enums/module';
import { FormInput, IFormInput } from '../../../../services/formInput/formInput';

export type ValueType = string | number | boolean;

export type CrudInputProps = {
  fieldName: string,
  formId: string,
  inputType: InputTypes
  crudType: CrudTypes
}

const openIndexString = '[';
const closeIndexString = ']';

export abstract class Base extends Component {
  public get EditInputId() { return `${this.props.fieldName}EditInput`; }

  constructor(
    protected props: CrudInputProps,
    _children?: Jsx,
    protected formInputService: IFormInput = FormInput.Instance
  ) {
    super();
  }

  protected abstract getInputValue(): ValueType | Array<ValueType>;

  protected get readOnlyAttribute(): string {
    return this.props.crudType === CrudTypes.Read || this.props.crudType === CrudTypes.Delete ?
      'disabled' : Strings.Empty;
  }

  protected get cleanFieldName(): string {
    let cleanFieldName = this.props.fieldName;

    if (this.props.fieldName.indexOf('.') >= 0) {
      const keys = this.props.fieldName.split('.');
      cleanFieldName = keys[keys.length - 1];
    }

    if (cleanFieldName.indexOf(openIndexString) >= 0) {
      cleanFieldName = cleanFieldName.split(openIndexString)[0];
    }

    return cleanFieldName;
  }

  protected get fieldValue(): any {
    let fieldValue = Strings.IsEmptyOrWhiteSpace(this.cleanFieldName) ?
      this.model : this.model[this.cleanFieldName];

    const isObjectArray = this.props.fieldName.endsWith(closeIndexString);
    fieldValue = isObjectArray ? fieldValue[0] : fieldValue;

    return fieldValue;
  }

  protected get model(): Model<any> {
    const formInputResult = this.formInputService.GetFormInput<Model<any>>(this.props.formId);

    if (formInputResult.IsSuccess && formInputResult.Value) {
      if (this.props.fieldName.indexOf('.') >= 0 || this.props.fieldName.indexOf(openIndexString) >= 0) {
        return this.getModelForFieldName(formInputResult.Value, this.props.fieldName);
      } else {
        return formInputResult.Value;
      }
    } else {
      throw new Error(formInputResult.ErrorMessages[0]);
    }
  }

  protected updateInputValue(): Result {
    const currentFormInputModelResult = this.formInputService.GetFormInput<Model<any>>(this.props.formId);

    if (currentFormInputModelResult.IsSuccess && currentFormInputModelResult.Value) {
      this.setValueAtFieldName(this.props.fieldName, this.getInputValue());
      this.formInputService.SetFormInput(this.props.formId, currentFormInputModelResult.Value);
    }

    return currentFormInputModelResult;
  }

  protected hasImageExtension = (input: string): boolean => {
    if (typeof input !== 'string') {
      return false;
    }

    const imageExtensions = ['jpg', 'jpeg', 'png', 'tiff', 'bmp', 'svg', 'gif'];
    return imageExtensions.some(e => input ?
      input.toLowerCase().indexOf(`.${e}`) >= 0 :
      false);
  }

  private setValueAtFieldName(fieldName: string, value: any): void {
    const model = this.model;

    if (fieldName.indexOf('.') >= 0) {
      const keys = fieldName.split('.');
      model[keys[keys.length - 1]] = value;
    } else {
      model[fieldName] = value;
    }
  }

  private getModelForFieldName(model: object, fieldName: string): Model<any> {
    const keys = fieldName.split('.');

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      const isObjectArray = key.indexOf(openIndexString) >= 0;

      if (i !== keys.length - 1) {
        if (isObjectArray) {
          key = key.split(openIndexString)[0];
          const index = parseInt(keys[i].split(openIndexString)[1].split(closeIndexString)[0]);
          model = model[key][index];
        } else {
          model = model[key];
        }
      }
    }

    return model as Model<any>;
  }
}
