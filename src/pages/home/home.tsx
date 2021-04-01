import { ParseJsx, Page, Route } from 'fyord';
import { Classes } from '../../enums/classes';
import { Routes } from '../routes';

export class HomePage extends Page {
  Title = 'fyord app';
  Route = (route: Route) => route.path === Routes.Home;
  Html = async () => {
    return <div>
      <h1>{this.Title}</h1>
      <p>Light-weight framework designed to embrace core competencies</p>

      <section>
        <h2>Core Tenants</h2>
        <ol class={Classes.ListStyle}>
          <li><span>Expert</span>
            <ul class={Classes.ListStyle}>
              <li><span>Focus on skills that transfer</span></li>
              <li><span>For software developers</span></li>
              <li><span>Who know Html, CSS, and JavaScript</span></li>
            </ul>
          </li>
          <li><span>Professional</span>
            <ul class={Classes.ListStyle}>
              <li><span>Easy to test</span></li>
              <li><span>Easy to debug</span></li>
              <li><span>Fast and Secure</span></li>
            </ul>
          </li>
          <li><span>Minimal</span>
            <ul class={Classes.ListStyle}>
              <li><span>Learning curve</span></li>
              <li><span>Boilerplate</span></li>
              <li><span>Friction</span></li>
            </ul>
          </li>
        </ol>

        <h3>Design Constraints</h3>
        <ol class={Classes.ListStyle}>
          <li><span>Serverless</span>
            <ul class={Classes.ListStyle}>
              <li><span>No features require server-side functionality outside of build / pipeline</span></li>
              <li><span>Hosting fyord apps should only require a file server</span></li>
              <li><span>Support build time (pipeline) pre-rendering</span></li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2>Getting started</h2>

        <p>Use this project as a starting point for a new <i>fyord</i> app or as living documentation for <i>fyord's</i> features.</p>
        <p><a href={Routes.Examples}>See examples</a></p>
      </section>
    </div>;
  };
}
