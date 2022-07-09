import { Asap, Jsx, Page, ParseJsx, Route, Fragment, SeoService, App, State } from 'fyord';
import { Strings } from 'tsbase/System/Strings';
import { Queryable } from 'tsbase/Collections/Queryable';
import { Content as ContentModel } from '../../models/content';
import { Constants } from '../../constants';
import { ContentRepository, IContentRepository } from '../../services/contentRepository/contentRepository';
import styles from './content.module.css';

const titleField = 'title';
const descriptionField = 'description';

export class Content extends Page {
  @State private content: object | null = null;

  Title = 'Content List';
  Description = 'A directory of all public content in the site';
  Route = async (route: Route) => route.path === '/content';

  constructor(
    seoService = SeoService.Instance,
    app = App.Instance(),
    private contentRepository: IContentRepository = ContentRepository.Instance()
  ) {
    super(seoService, app);
  }

  Template = async () => {
    if (!this.content) {
      Asap(async () => {
        const result = await this.contentRepository.GetRaw(Constants.Config.Admin.ContentRoute);
        if (result.IsSuccess) {
          this.content = JSON.parse(result.Value as any);
        }
      });
    }

    return <div class={styles.container}>
      <div class={styles.hero}>
        <h1>{this.Title}</h1>
        <p>{this.Description}</p>
      </div>

      <div>
        {this.content && this.getAnchorListForNode(this.content, Strings.Empty)}
      </div>
    </div>;
  }

  private getAnchorListForNode(node: object, rootKey: string): Jsx {
    const contentBaseTemplate = new ContentModel();
    const keysToIgnore = Object.keys(contentBaseTemplate)
      .map(k => Strings.CamelCase(k));

    const nodeChildrenKeys = Queryable.From(Object.keys(node))
      .Except(keysToIgnore);

    return <>
      {nodeChildrenKeys.map(key => this.isOrContainsContent(node[key]) && <ul>
        <a href={`${rootKey}/${key}`}>{this.getTitle(node, key)}</a>
        {this.getAnchorListForNode(node[key], `${rootKey}/${key}`)}
      </ul>)}
    </>;
  }

  private getTitle(node: object, key: string): string {
    const hasTitle = node[key][titleField];
    const hasDescription = node[key][descriptionField];

    if (hasTitle && hasDescription) {
      return `${node[key][titleField]} | ${node[key][descriptionField]}`;
    } else if (hasTitle) {
      return `${node[key][titleField]}`;
    } else {
      return Strings.PascalCase(key);
    }
  }

  private isOrContainsContent(object: object): boolean {
    const keys = Object.keys(object);
    const isContent = object[titleField];
    const hasContent = (keys.length >= 1 && object[keys[0]] && object[keys[0]][titleField] !== undefined);

    return isContent || hasContent;
  }
}
