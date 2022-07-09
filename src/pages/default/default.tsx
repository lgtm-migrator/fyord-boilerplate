import { Page, ParseJsx, Route, Fragment, SeoService, App } from 'fyord';
import { CrudTypes, Models } from '../../enums/module';
import { Content } from '../../models/module';
import { Authentication, IAuthentication } from '../../services/authentication/Authentication';
import { IContentRepository, ContentRepository } from '../../services/contentRepository/contentRepository';
import styles from './default.module.css';

export class Default extends Page {
  private path?: string;
  private content: Content | null = null;
  private contentValid = false;

  Route = async (route: Route) => {
    this.path = route.path;
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


  Template = async () => {
    return <div class={styles.container}>
      {this.content && this.contentValid ?
        <>
          <p>{JSON.stringify(this.content)}</p>
        </> :
        <>
          <h1>Content Not Found</h1>
          <p>"{this.path}" didn't correspond with any known page.</p>
          <p>The resource you're looking for may have moved.</p>

          {!this.content && this.authenticationService.Session &&
            <p>Would you like to
              <a href={`/admin/content/${CrudTypes.Create}/${Models.Content}?path=${this.path}`}>
                create a page at "{this.path}"?
              </a>
            </p>}
        </>}
    </div>;
  }
}
