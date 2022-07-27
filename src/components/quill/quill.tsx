import { Component, ParseJsx, Jsx, Reference, Asap } from 'fyord';
import { Strings } from 'tsbase/System/Strings';
import styles from './quill.module.css';

export enum Themes {
  Snow = 'snow',
  Bubble = 'bubble'
}

const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link'],
  ['image'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'color': [] }, { 'background': [] }],
  ['clean']
];

type Props = {
  theme: Themes,
  initialContent: string
}

export class Quill extends Component {
  public Quill: any;
  @Reference private editorContainer!: HTMLElement;

  public get HtmlContent(): string {
    return this.qlEditor.innerHTML;
  }

  private get qlEditor(): HTMLDivElement {
    return this.Element?.querySelector('.ql-editor') as HTMLDivElement;
  }

  constructor(
    private props: Props = {
      theme: Themes.Snow,
      initialContent: Strings.Empty
    },
    _children?: Jsx,
    private quillConstructor = window['Quill']
  ) {
    super();
  }

  Template = async () => {
    Asap(() => {
      this.Quill = new this.quillConstructor(this.editorContainer, {
        theme: this.props.theme,
        modules: {
          toolbar: toolbarOptions
        }
      });

      this.qlEditor.innerHTML = this.props.initialContent;
    });

    return <div class={styles.container}>
      <div ref={this.editorContainer} />
    </div>;
  };
}
