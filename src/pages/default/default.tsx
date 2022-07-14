import { Page, ParseJsx, Route, Fragment, SeoService, App } from 'fyord';
import { Strings } from 'tsbase/System/Strings';
import { CrudButton, EditableContent } from '../../components/module';
import { CrudTypes, InputTypes } from '../../enums/module';
import { Content, Models } from '../../models/module';
import { Authentication, IAuthentication } from '../../services/authentication/Authentication';
import { IContentRepository, ContentRepository } from '../../services/contentRepository/contentRepository';
import styles from './default.module.css';

export class Default extends Page {
  private content: Content | null = null;
  private contentValid = false;

  Route = async (route: Route) => {
    const contentResult = await this.contentRepository.Get<Content>(Content, route.path);

    if (contentResult.IsSuccess) {
      const resultContent = contentResult.Value as Content;
      this.content = resultContent;
      this.contentValid = resultContent.Validate().IsSuccess;

      this.Title = this.content.Title;
      this.Description = this.content.Description;
    }

    return true;
  };

  constructor(
    seoService = SeoService.Instance,
    app = App.Instance(),
    private contentRepository: IContentRepository = ContentRepository.Instance(),
    private authenticationService: IAuthentication = Authentication.Instance()
  ) {
    super(seoService, app);
  }


  // eslint-disable-next-line complexity
  Template = async (route?: Route) => {
    return <div class={styles.container}>
      {this.content && this.contentValid ?
        <>
          <div>
            {await (<CrudButton model={Models.Content} type={CrudTypes.Update} />)}
            {await (<CrudButton model={Models.Content} type={CrudTypes.Delete} />)}
          </div>
          <article>
            <h1>
              {await (<EditableContent
                model={Models.Content}
                inputType={InputTypes.Text}
                location={route?.path || Strings.Empty}
                field="Title" />)}
            </h1>

            <p>
              {await (<EditableContent
                model={Models.Content}
                inputType={InputTypes.Text}
                location={route?.path || Strings.Empty}
                field="Description" />)}
            </p>

            {await (<EditableContent
              model={Models.Content}
              inputType={InputTypes.Html}
              location={route?.path || Strings.Empty}
              field="Body" />)}
          </article>
        </> :
        <>
          <h1>Content Not Found</h1>
          <p>"{route?.path}" didn't correspond with any known page.</p>
          <p>The resource you're looking for may have moved.</p>

          {!this.content && this.authenticationService.Session &&
            <p>Would you like to
              <a href={`/admin/content/${CrudTypes.Create}/${Models.Content}?path=${route?.path}`}>
                create a page at "{route?.path}"?
              </a>
            </p>}
        </>}
    </div>;
  }
}
