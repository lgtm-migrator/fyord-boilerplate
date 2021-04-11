import { Component, ParseJsx } from 'fyord';
import { ArrayFunctions } from 'tsbase/Functions/ArrayFunctions';

export class RandomNumberComponent extends Component {
  private maxNumber = 100;
  private numbers = Array.from({ length: this.maxNumber }, (_v, k) => k + 1);

  Html = async () => <div>
    <p>Random (1-{this.maxNumber}) number is: <b>{ArrayFunctions.Shuffle(this.numbers)[0]}</b></p>
    <button onclick={() => this.ReRender()}>New Random Number</button>
  </div>;
}
