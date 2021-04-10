import { Component, EventTypes, ParseJsx } from 'fyord';
import { ArrayFunctions } from 'tsbase/Functions/ArrayFunctions';

export enum Keys {
  NewNumberButton = 'newNumberButton'
}

export class RandomNumberComponent extends Component {
  private maxNumber = 100;
  private numbers = Array.from({ length: this.maxNumber }, (_v, k) => k + 1);

  Html = async () => <div>
    <p>Random (1-{this.maxNumber}) number is: <b>{ArrayFunctions.Shuffle(this.numbers)[0]}</b></p>
    <button id={this.Ids(Keys.NewNumberButton)}>New Random Number</button>
  </div>;

  Behavior = () => {
    this.addEventListenerToId(
      this.Ids(Keys.NewNumberButton),
      EventTypes.Click,
      () => this.ReRender());
  }
}
