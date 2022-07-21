import { InputTypes } from 'tsbase/Models/inputTypes';
import { Strings } from 'tsbase/System/Strings';
import { CrudInputProps, Object as ObjectInput } from './module';

export const InputComponentMap = new Map<InputTypes, (parameters: CrudInputProps) => Promise<string>>();
InputComponentMap.set(InputTypes.Hidden, async () => Strings.Empty);
InputComponentMap.set(InputTypes.Object, (parameters) => new ObjectInput(parameters).Render());
// InputComponentMap.set(InputTypes.Select, (parameters) => getDynamicInputControl(parameters));
// InputComponentMap.set(InputTypes.Checkbox, (parameters) => getDynamicInputControl(parameters));
// InputComponentMap.set(InputTypes.Text, (parameters) => /*html*/ `
// <tsb-crud-form-text-input
//   fieldName="${parameters.fieldName}"
//   formId="${parameters.formId}"
//   inputType="${parameters.inputType}"
//   crudType="${parameters.crudType}">
// </tsb-crud-form-text-input>
// `);
// InputComponentMap.set(InputTypes.Html, (parameters) => /*html*/ `
// <tsb-crud-form-html-input
//   fieldName="${parameters.fieldName}"
//   formId="${parameters.formId}"
//   inputType="${parameters.inputType}"
//   crudType="${parameters.crudType}">
// </tsb-crud-form-html-input>
// `);
// InputComponentMap.set(InputTypes.ObjectArray, (parameters) => /*html*/ `
// <tsb-crud-form-object-array-input
//   fieldName="${parameters.fieldName}"
//   formId="${parameters.formId}"
//   inputType="${parameters.inputType}"
//   crudType="${parameters.crudType}">
// </tsb-crud-form-object-array-input>
// `);
// InputComponentMap.set(InputTypes.ValueArray, (parameters) => /*html*/ `
// <tsb-crud-form-value-array-input
//   fieldName="${parameters.fieldName}"
//   formId="${parameters.formId}"
//   inputType="${parameters.inputType}"
//   crudType="${parameters.crudType}">
// </tsb-crud-form-value-array-input>
// `);

export function GetInputComponentForType(parameters: CrudInputProps): string {
  return InputComponentMap.has(parameters.inputType) ?
    (InputComponentMap.get(parameters.inputType) as Function)(parameters) :
    (InputComponentMap.get(InputTypes.Text) as Function)(parameters);
}
