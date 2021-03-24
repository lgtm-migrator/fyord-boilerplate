import { ParseJsx, Page, Route, RawHtml } from 'fyord';
import { Classes } from '../enums/classes';
import { Routes } from './routes';
import { DataBindingComponent } from '../components/data-binding/data-binding';

export class SecurityPage extends Page {
  Title = 'Security';

  Route = (route: Route) => route.path === Routes.Security;
  Html = async () => {
    return <div>
      <h1>{this.Title}</h1>

      <section>
        <h2>Passive Protection</h2>

        <section>
          <h3>Content Security Policy</h3>
          <div>Img: {await new RawHtml('<img src="fake" alt="test" onerror="alert(0)">', false).Render()}</div>
          <p>^This image attempts to log to the console via the onerror attribute - {this.userInput('onerror="alert(0)"')}</p>
          <p>If you check your console, you will see that this is disallowed via the default CSP defined in the index.html file</p>
        </section>

        <section>
          <h3>Using JSX for HTML</h3>
          <p>Currently you may return either a string or JSX when implementing a component's <code>html</code> method.
          Using JSX offers increased passive protection since any interpolated content between html tags will be
          rendered as text. When returning a string, you are responsible for sanitizing any inputs.</p>
        </section>
      </section>

      <section>
        <h2>Active Protection</h2>

        <section>
          <h3>Explicitly sanitizing with userInput method</h3>

          <section>
            <h4>Img "onerror" attack vector as plaintext - <code>this.userInput(text)</code></h4>
            <div>Img: {this.userInput('<img src="fake" alt="test" onerror="alert(0)">')}</div>
            <p>^All html is removed</p>
          </section>

          <section>
            <h4>Img "onerror" attack vector as html - <code>this.userInput(text, true)</code></h4>
            <div>Img: {this.userInput('<img src="fake" alt="test" onerror="alert(0)">', true)}
              {await new RawHtml('<img src="fake" alt="test" onerror="alert(0)">').Render()} </div>
            <p>^Html that can be included safely remains, while unsafe attributes, like onerror, are removed</p>
          </section>

          <section>
            <h4>Retrieving user input</h4>
            <p>A shortcut for retrieving sanitized input is available - <code>this.getInputValue(inputElementId)</code></p>
            {await new DataBindingComponent().Render()}
          </section>
        </section>
      </section>

      <section>
        <h2>Recommendations</h2>

        <ul class={Classes.ListStyle}>
          <li><span>Prefer returning JSX to a string when implementing a component's <code>html</code> method</span></li>
          <li><span>Use explicit sanitization when interpolating user input into a string</span></li>
          <li><span>Be cautious when relying on the CSP and test to ensure your expectations are met</span></li>
          <li><span>When updating the CSP (ex. allowing a 3rd party integration), consider how this will affect application security</span></li>
        </ul>
      </section>
    </div>;
  }
}
