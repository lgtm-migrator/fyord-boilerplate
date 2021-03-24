import { Component, EventTypes, ParseJsx } from 'fyord';

export enum Keys {
  Input = 'inputValue',
  Output = 'outputValue'
}

export class DataBindingComponent extends Component {
  private initialValue = 'change me';

  Html = async () => <div>
    <input id={this.Ids(Keys.Input)} type="text" value={this.initialValue}></input>
    <p id={this.Ids(Keys.Output)}>{this.initialValue}</p>
  </div>;

  Behavior = () => {
    const outputLabel = this.windowDocument.getElementById(this.Ids(Keys.Output)) as HTMLInputElement;

    this.addEventListenerToId(
      this.Ids(Keys.Input),
      EventTypes.Input,
      () => outputLabel.innerHTML = this.getInputValue(this.Ids(Keys.Input)));
  }
}
