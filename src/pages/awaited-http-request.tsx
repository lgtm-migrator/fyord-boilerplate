import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { ParseJsx, Page, RenderModes, Route, App, ISeoService, SeoService } from 'fyord';
import { Routes } from './routes';

export const chuckNorrisJokeApi = 'https://api.chucknorris.io/jokes/random';
export type ChuckNorrisJoke = {
  icon_url: string,
  id: string,
  url: string,
  value: string
}

export class AwaitedHttpRequestPage extends Page {
  Title = 'Awaited Http Request';

  constructor(
    seoService: ISeoService = SeoService.Instance,
    app = App.Instance(),
    windowDocument = document,
    private httpClient = new HttpClient()
  ) {
    super(seoService, app, windowDocument);
  }

  RenderMode = RenderModes.Dynamic;
  Route = (route: Route) => route.path === Routes.AwaitedHttpRequest;
  Html = async () => {
    const randomJoke = JSON.parse(await this.httpClient.GetStringAsync(chuckNorrisJokeApi)) as ChuckNorrisJoke;

    return <div>
      <h1>{this.Title}</h1>

      <section>
        <h2>Joke id: {randomJoke.id}</h2>
        <img src={randomJoke.icon_url} alt="Chuck Norris Icon"></img>
        <p>{randomJoke.value}</p>

        <p>Courtesy of <a target="_blank" href={randomJoke.url}>The Chuck Norris Api</a></p>
      </section>
    </div>;
  }
}
