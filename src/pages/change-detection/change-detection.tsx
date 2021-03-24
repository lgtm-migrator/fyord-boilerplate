import { ParseJsx, EventTypes, Page, Route } from 'fyord';
import { StatePaths } from '../../core/state';
import { Routes } from '../routes';
import { DataBindingComponent } from '../../components/data-binding/data-binding';
import { RandomNumberComponent } from '../../components/random-number/random-number';

export enum Keys {
  Increment = 'increment',
  Decrement = 'decrement'
}

export class ChangeDetectionPage extends Page {
  private title = 'Change Detection';
  private userAge = this.useAppStore<number>(StatePaths.UserAge) as () => number;

  Route = (route: Route) => route.path === Routes.ChangeDetection;
  Html = async () => {
    this.seoService.SetDefaultTags(this.title);

    return <div>
      <h1>{this.title}</h1>

      <section>
        <h2>App Store</h2>
        <p>A fjord app's store can be utilized to retrieve current values for initial render, as well as trigger
        a new render when the requested state value changes.</p>

        <p>User's Age: <b>{this.userAge()}</b></p>

        <div>
          <button id={this.Ids(Keys.Increment)}>Increment</button>
          <button id={this.Ids(Keys.Decrement)}>Decrement</button>
        </div>

        <p>*Note how changes here affect the below examples, but their changes are confined. This is because the
        app store example happens to be implemented at the page level and the below are at the component level.</p>
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
    this.addEventListenerToId(
      this.Ids(Keys.Increment),
      EventTypes.Click,
      () => this.app.Store.SetStateAt((this.userAge()) + 1, StatePaths.UserAge));

    this.addEventListenerToId(
      this.Ids(Keys.Decrement),
      EventTypes.Click,
      () => this.app.Store.SetStateAt((this.userAge()) - 1, StatePaths.UserAge));
  }
}
