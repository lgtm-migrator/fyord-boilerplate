import { Component, ParseJsx, Jsx, Asap, Fragment, State, Reference, RawHtml } from 'fyord';
import { Model } from 'tsbase/Models/Model';
import { GenericResult } from 'tsbase/Patterns/Result/GenericResult';
import { Strings } from 'tsbase/System/Strings';
import { InputTypes } from '../../enums/module';
import { ModelRecord, Models } from '../../models/module';
import { Authentication } from '../../services/authentication/Authentication';
import { ContentRepository } from '../../services/contentRepository/contentRepository';
import { Icons } from '../crudButton/icons';
import { Quill } from '../module';
import styles from './editableContent.module.css';

type Props = {
  inputType: InputTypes,
  location: string,
  model: Models,
  field: string
}

export class EditableContent extends Component {
  @State private editModeEnabled = false;
  @State private content: string | null = null;
  @Reference private editableContent!: HTMLInputElement;
  private modelTemplate: Model<any>;
  private quillComponent = new Quill();

  constructor(
    private props: Props = {
      inputType: InputTypes.Text,
      location: '',
      model: Models.Content,
      field: ''
    },
    _children?: Jsx,
    private contentRepository = ContentRepository.Instance(),
    private authenticationService = Authentication.Instance()
  ) {
    super();

    const mappedModel = ModelRecord[this.props.model];
    const modelConstructor = mappedModel as { new(): Model<any> };
    this.modelTemplate = new modelConstructor();
  }

  Template = async () => {
    Asap(async () => {
      if (!this.content) {
        await this.setContent();
      }
    });

    return <div class={styles.container}>
      {this.editModeEnabled ?
        <>
          {this.props.inputType === InputTypes.Html ?
            <>{await this.quillComponent.Render()}</> :
            <>
              <input ref={this.editableContent} title={this.props.field} type="text" value={this.content} />
              <div class="cancel-save-button-wrapper">
                <button onclick={() => this.editModeEnabled = false} id="${this.cancelButtonId}">
                  {Icons.cancel}
                </button>
                <button onclick={() => this.saveChanges()} id="${this.saveChangesButtonId}">
                  {Icons.save}
                </button>
              </div>
            </>}
        </> :
        <>
          <div class={`${styles.content} ${this.authenticationService.Session && styles.editable}`}>
            {await new RawHtml(this.content || '').Render()}
          </div>
          {this.authenticationService.Session &&
            <button onclick={() => this.editModeEnabled = true} class={styles.editButton} title={`Edit ${this.props.field}`}>
              {Icons.update}
            </button>}
        </>}
    </div>;
  }

  private async setContent(): Promise<void> {
    const contentResult = await this.getContent();

    if (contentResult.IsSuccess) {
      this.content = contentResult.Value ? contentResult.Value.toString() : Strings.Empty;
    }
  }

  private async getContent(): Promise<GenericResult<string>> {
    return await this.contentRepository.GetRaw(`${this.props.location}/${Strings.CamelCase(this.props.field)}`);
  }

  private saveChanges = async (): Promise<void> => {
    const contentToSave = this.props.inputType === InputTypes.Html ?
      this.quillComponent.HtmlContent :
      this.editableContent.value;

    this.modelTemplate[this.props.field] = contentToSave;
    const validationResult = this.modelTemplate.ValidateField(m => m[this.props.field]);

    if (validationResult.IsSuccess) {
      await this.contentRepository.SaveAtPath(contentToSave, `${this.props.location}/${Strings.CamelCase(this.props.field)}`);
      await this.setContent();
      this.editModeEnabled = false;
    } else {
      alert(validationResult.ErrorMessages.join('\n'));
    }
  }
}
