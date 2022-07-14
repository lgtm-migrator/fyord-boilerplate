import { Asap, Page, ParseJsx, Route, Fragment } from 'fyord';
import { Model } from 'tsbase/Models/Model';
import { Strings } from 'tsbase/System/Strings';
import { Guid } from 'tsbase/System/Guid';
import { Result } from 'tsbase/Patterns/Result/Result';
import { CrudTypes } from '../../enums/crudTypes';
import { ModelRecord, Models } from '../../models/models';
import { ContentRepository } from '../../services/contentRepository/contentRepository';
import { FormInput } from '../../services/formInput/formInput';
import { Authentication } from '../../services/authentication/Authentication';
import { Content } from '../../models/content';
import styles from './crudForm.module.css';

export class CrudForm extends Page {
  private type!: CrudTypes;
  private model!: Models;
  private path: string | undefined;
  private modelConstructor: (new () => Model<any>);
  private templateModel: Model<any> | null = null;
  private formId = Guid.NewGuid();

  constructor(
    private authenticationService = Authentication.Instance(),
    private repository = ContentRepository.Instance(),
    private formInputService = FormInput.Instance
  ) {
    super();
    const mappedModel = this.model ? ModelRecord[this.model] : undefined;
    this.modelConstructor = mappedModel ? mappedModel : Content;
  }

  Route = async (route: Route) => {
    this.type = route.routeParams[1] as CrudTypes;
    this.model = route.routeParams[2] as Models;
    this.path = route.queryParams.get('path');

    if (route.path.startsWith('/content') && route.routeParams.length === 3) {
      this.Title = Strings.PascalCase(this.type);
      this.Description = `${Strings.PascalCase(this.type)} ${Strings.PascalCase(this.model)}`;
      return true;
    } else {
      return false;
    }
  }

  Template = async () => {
    Asap(async () => {
      this.authenticationService.RedirectWhenUnAuthenticated(`${window.location.pathname}${window.location.search}`);
      await this.setInitialModelValues();
    });

    return <div class={styles.container}>
      <h1>{Strings.PascalCase(this.type)} - {this.model as any !== 'undefined' ? this.model : 'Content'} at "{this.path}"</h1>
      {this.type === CrudTypes.Delete && <>
        <p>Are you sure you want to delete this content?</p>
        <p>Press the "Delete" button below to confirm and delete this content <strong>forever.</strong></p>
        <hr />
      </>}
      <>
        <p>Fields go here...</p>
        {/* <tsb-crud-form-object-input
            formId=${this.formId}
            crudType=${this.Type}>
          </tsb-crud-form-object-input>`} */}
        <hr />
        {this.type === CrudTypes.Create && <button onclick={() => this.saveChangesToModel()}>Add</button>}
        {this.type === CrudTypes.Update && <button onclick={() => this.saveChangesToModel()}>Save</button>}
        {this.type === CrudTypes.Delete && <>
          <button class={styles.deleteButton} onclick={() => this.deleteModel()}>Delete</button>
          <button onclick={() => this.goBack()}>Cancel / Go back</button>
        </>}
      </>
    </div>;
  }

  private goBack = (): void => {
    this.formInputService.DeleteFormInput(this.formId);
    history.back();
  }

  // eslint-disable-next-line complexity
  private saveChangesToModel = async (): Promise<void> => {
    const formInputResult = this.formInputService.GetFormInput<Model<any>>(this.formId);
    if (formInputResult.IsSuccess && formInputResult.Value) {
      this.templateModel = formInputResult.Value;
    }

    if (this.templateModel) {
      let result = this.templateModel.Validate();

      if (result.IsSuccess && this.path) {
        result = result.CombineWith(await this.repository.SaveAtPath(this.model, this.path));
      }

      if (result.IsSuccess) {
        this.goBack();
      } else {
        this.reportErrors('save changes', result);
      }
    }
  }

  private deleteModel = async (): Promise<void> => {
    if (this.repository && this.path) {
      const result = await this.repository.SaveAtPath(null, this.path);

      if (result.IsSuccess) {
        this.goBack();
      } else {
        this.reportErrors('delete', result);
      }
    }
  }

  private async setInitialModelValues() {
    if (this.type !== CrudTypes.Create && this.path) {
      const savedModelResult = await this.repository.Get(this.modelConstructor, this.path);
      if (savedModelResult.IsSuccess) {
        this.templateModel = savedModelResult.Value ? savedModelResult.Value : new this.modelConstructor();
      }
    } else {
      this.templateModel = new this.modelConstructor();
    }

    this.formInputService.SetFormInput(this.formId, this.model);
  }

  private reportErrors(action: string, result: Result) {
    alert(`Unable to ${action} due to the following validation errors: \n${result.ErrorMessages.join('\n')} `);
  }
}
