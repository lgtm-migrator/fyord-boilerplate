import { Component, ParseJsx } from 'fyord';

export enum Keys {
  Input = 'inputValue',
  Output = 'outputValue'
}

export class DataBindingComponent extends Component {
  private initialValue = 'change me';
  private get outputLabel(): HTMLParagraphElement {
    return this.windowDocument.getElementById(this.Ids(Keys.Output)) as HTMLParagraphElement;
  }

  Html = async () => <div>
    <input type="text" id={this.Ids(Keys.Input)} value={this.initialValue}
      oninput={() => this.outputLabel.innerHTML = this.getInputValue(this.Ids(Keys.Input))}>
    </input>
    <p id={this.Ids(Keys.Output)}>{this.initialValue}</p>
  </div>;
}
