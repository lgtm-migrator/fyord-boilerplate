import { Model } from 'tsbase/Models/Model';
import { Content } from './content';

export enum Models {
  Content = 'content'
}

export const ModelRecord: Record<Models, new () => Model<any>> = {
  [Models.Content]: Content
};
