import { Component, ParseJsx, Jsx, Reference, Asap } from 'fyord';
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
  theme: Themes
}

export class Quill extends Component {
  public Quill: any;
  @Reference private editorContainer!: HTMLElement;

  public get HtmlContent(): string {
    return this.qlEditor.innerHTML;
  }

  private get qlEditor(): HTMLDivElement {
    return this.App.Main.querySelector('.ql-editor') as HTMLDivElement;
  }

  constructor(
    private props: Props = {
      theme: Themes.Snow
    },
    _children?: Jsx
  ) {
    super();
  }

  Template = async () => {
    Asap(() => {
      const Quill = window['Quill'];

      this.Quill = new Quill(this.editorContainer, {
        theme: this.props.theme,
        modules: {
          toolbar: toolbarOptions
        }
      });

      this.qlEditor.innerHTML = this.editorContainer.innerHTML;
    });

    return <div class={styles.container}>
      <div ref={this.editorContainer}></div>
    </div>;
  };
}
