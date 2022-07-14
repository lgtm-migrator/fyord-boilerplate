import { CrudTypes } from './enums/crudTypes';
import { Models } from './models/models';

export class Routes {
  static Home = '/';
  static Login = '/login';
  static Content = '/content';
  static Admin = (type: CrudTypes, model: Models, path: string) =>
    `/content/${type}/${model}?path=${path}`;
}
