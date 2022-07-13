import * as dlv from 'dlv';
import { dset } from 'dset';
import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { IHttpClient, RestResponse } from 'tsbase/Net/Http/IHttpClient';
import { GenericResult } from 'tsbase/Patterns/Result/GenericResult';
import { ISerializer } from 'tsbase/Utility/Serialization/ISerializer';
import { JsonSerializer } from 'tsbase/Utility/Serialization/JsonSerializer';
import { Strings } from 'tsbase/System/Strings';
import { Result } from 'tsbase/Patterns/Result/Result';
import { Authentication, IAuthentication } from '../authentication/Authentication';
import { Constants } from '../../constants';
import { FirebaseLoginResponse } from '../authentication/models/FirebaseLoginResponse';

export interface IContentRepository {
  Get<T>(t: new () => T, path: string): Promise<GenericResult<T>>;
  GetRaw(path: string): Promise<GenericResult<string>>;
  SaveAtPath<T>(data: T, path: string): Promise<GenericResult<object>>;
}

export class ContentRepository implements IContentRepository {
  private static instance: ContentRepository | null = null;
  public static Instance(
    httpClient: IHttpClient = new HttpClient(),
    serializer: ISerializer = new JsonSerializer(),
    authenticationService = Authentication.Instance()
  ): IContentRepository {
    if (!this.instance) {
      this.instance = new ContentRepository(httpClient, serializer, authenticationService);
    }
    return this.instance;
  }
  public static Destroy(): void {
    this.instance = null;
  }

  private cache = {};

  private constructor(
    private httpClient: IHttpClient,
    private serializer: ISerializer,
    private authenticationService: IAuthentication
  ) { }

  public async Get<T>(t: new () => T, path: string): Promise<GenericResult<T>> {
    const result = new GenericResult<T>();

    const keyPath = this.getJsonKeyPath(path);
    const uri = this.getEndpointWithPath(path);
    const rawContent = (!this.authenticationService.Session ? dlv(this.cache, keyPath) : null)
      || await (await this.httpClient.Get(uri)).body;

    if (rawContent) {
      const content = this.serializer.Serialize(t, rawContent);

      result.Value = content;
      if (!this.authenticationService.Session) {
        dset(this.cache, keyPath, rawContent);
      }
    } else {
      result.ErrorMessages.push('Content not found');
    }

    return result;
  }

  public async GetRaw(path: string): Promise<GenericResult<string>> {
    const result = new GenericResult<string>();
    const keyPath = this.getJsonKeyPath(path);
    const cachedContent = dlv(this.cache, keyPath);

    if (!this.authenticationService.Session && cachedContent) {
      result.Value = cachedContent;
    } else {
      const uri = this.getEndpointWithPath(path);
      const response = await this.httpClient.Get(uri);

      if (response.ok && response.body) {
        result.Value = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);
        dset(this.cache, keyPath, result.Value);
      } else {
        result.ErrorMessages.push('Content not found');
      }
    }

    return result;
  }

  public async SaveAtPath<T>(data: T, path: string): Promise<Result> {
    const result = new Result();
    const session = this.authenticationService.Session;

    const response = await this.sendRequestToFirebase<T>(data, path, session);

    if (!response.ok) {
      result.ErrorMessages.push(
        `Failed with status code: ${response.status} | text: ${response.statusText}`);
      result.ErrorMessages.push(JSON.stringify(response.body));
    }

    await this.authenticationService.RefreshSession(false);

    return result;
  }

  private async sendRequestToFirebase<T>(data: T, path: string, session: FirebaseLoginResponse | null) {
    let response: RestResponse<T>;
    const savableData = !this.isNullOrWhiteSpace(data) ? this.cleanData(data) : null;

    if (savableData) {
      response = await this.httpClient.Put(
        `${this.getEndpointWithPath(path)}${session ? `?auth=${session.IdToken}` : Strings.Empty}`, savableData);
    } else {
      response = await this.httpClient.Delete(
        `${this.getEndpointWithPath(path)}${session ? `?auth=${session.IdToken}` : Strings.Empty}`);
    }

    return response;
  }

  private getJsonKeyPath(path: string): string {
    return this.cleanPath(path).replace(/\//g, '.').replace('.', Strings.Empty);
  }

  private getEndpointWithPath(path: string): string {
    return `${Constants.Config.Firebase.DatabaseURL}${this.cleanPath(path)}.json`;
  }

  private cleanPath(path: string): string {
    const contentRootPath = '/content/root';

    if (path === '/content') {
      return path;
    } else if (path === '/') {
      return contentRootPath;
    } else if (path.startsWith('//')) {
      return path.replace('//', `${contentRootPath}/`);
    } else {
      return `/content${path}`;
    }
  }

  private cleanData(data): object {
    let savableData = data;

    if (data && typeof (data) === 'object') {
      savableData = {};
      const dataKeys = Object.keys(data);

      dataKeys.forEach(key => {
        const camelCasedKey = Strings.CamelCase(key);
        savableData[camelCasedKey] = this.cleanData(data[key]);
      });
    }

    return savableData;
  }

  private isNullOrWhiteSpace(data): boolean {
    if (typeof (data) === 'string') {
      return Strings.IsEmptyOrWhiteSpace(data);
    } else {
      return data === undefined || data === null;
    }
  }
}
