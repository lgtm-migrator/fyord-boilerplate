import { ParseJsx, EventTypes, Page, Route } from 'fyord';
import { Routes } from '../routes';
import { DataBindingComponent } from '../../components/data-binding/data-binding';
import { RandomNumberComponent } from '../../components/random-number/random-number';
import { AppStore, State } from 'fyord/core/decorators/module';

export enum Keys {
  AgeIncrement = 'ageIncrement',
  AgeDecrement = 'ageDecrement',
  CounterIncrement = 'counterIncrement',
  CounterDecrement = 'counterDecrement'
}

export class ChangeDetectionPage extends Page {
  Title = 'Change Detection';
  @AppStore private userAge?: number;
  @State private counter: number = 0;

  Route = (route: Route) => route.path === Routes.ChangeDetection;
  Html = async () => {
    this.seoService.SetDefaultTags(this.Title);

    return <div>
      <h1>{this.Title}</h1>

      <section>
        <h2>App Store</h2>
        <p>A fyord app's store can be utilized to retrieve current values for initial render, as well as trigger
        a new render when the requested state value changes.</p>

        <p>User's Age: <b>{this.userAge}</b></p>

        <div>
          <button id={this.Ids(Keys.AgeIncrement)}>Increment</button>
          <button id={this.Ids(Keys.AgeDecrement)}>Decrement</button>
        </div>

        <p>*Note how changes here affect the below examples, but their changes are confined. This is because the
        app store example happens to be implemented at the page level and the below are at the component level.</p>
      </section>

      <section>
        <h2>Component State</h2>
        <p>A fyord component has an internal store, like the app store, which allows for similar functionality but
        at a component level.</p>

        <p>User's Age: <b>{this.counter}</b></p>

        <div>
          <button id={this.Ids(Keys.CounterIncrement)}>Increment</button>
          <button id={this.Ids(Keys.CounterDecrement)}>Decrement</button>
        </div>
      </section>

      <section>
        <h2>Data Binding</h2>
        <p>Example of how you might keep an input in sync with an output</p>

        {await new DataBindingComponent().Render()}
      </section>

      <section>
        <h2>Re-render</h2>
        <p>Manually trigger a re-render when appropriate</p>

        {await new RandomNumberComponent().Render()}
      </section>
    </div>;
  }

  Behavior = () => {
    this.setUserAgeBehavior();
    this.setCounterBehavior();
  }

  private setUserAgeBehavior() {
    const currentAge = this.userAge || 0;
    this.addEventListenerToId(this.Ids(Keys.AgeIncrement), EventTypes.Click, () => this.userAge = currentAge + 1);
    this.addEventListenerToId(this.Ids(Keys.AgeDecrement), EventTypes.Click, () => this.userAge = currentAge - 1);
  }

  private setCounterBehavior() {
    const currentCount = this.counter || 0;
    this.addEventListenerToId(this.Ids(Keys.CounterIncrement), EventTypes.Click, () => this.counter = currentCount + 1);
    this.addEventListenerToId(this.Ids(Keys.CounterDecrement), EventTypes.Click, () => this.counter = currentCount - 1);
  }
}
