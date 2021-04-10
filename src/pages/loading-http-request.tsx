import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { App, ISeoService, Page, ParseJsx, Route, SeoService } from 'fyord';
import { ChuckNorrisJoke, chuckNorrisJokeApi } from './awaited-http-request';
import { Routes } from './routes';

export class LoadingHttpRequestPage extends Page {
  private randomJoke: ChuckNorrisJoke | null = null;

  Title = 'Loading Http Request';

  constructor(
    seoService: ISeoService = SeoService.Instance,
    app = App.Instance(),
    windowDocument = document,
    private httpClient = new HttpClient()
  ) {
    super(seoService, app, windowDocument);

    (async () => {
      this.randomJoke = JSON.parse(await this.httpClient.GetStringAsync(chuckNorrisJokeApi)) as ChuckNorrisJoke;
      this.ReRender();
    })();
  }

  Route = (route: Route) => route.path === Routes.LoadingHttpRequest;

  Html = async () => {
    return <div>
      <h1>{this.Title}</h1>

      {this.randomJoke ?
        <section>
          <h2>Joke id: {this.randomJoke.id}</h2>
          <img src={this.randomJoke.icon_url} alt="Chuck Norris Icon"></img>
          <p>{this.randomJoke.value}</p>

          <p>Courtesy of <a target="_blank" href={this.randomJoke.url}>The Chuck Norris Api</a></p>
        </section> :
        <section>
          <p>Loading...</p>
        </section>
      }
    </div>;
  }
}
