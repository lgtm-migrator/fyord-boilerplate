import { Result, GenericResult } from 'tsbase/Patterns/Result/module';
import { Command, Query } from 'tsbase/Patterns/CommandQuery/module';

export interface IFormInput {
  SetFormInput<T>(id: string, model: T): GenericResult<T>;
  GetFormInput<T>(id: string): GenericResult<T>;
  DeleteFormInput(id: string): Result;
}

export class FormInput implements IFormInput {
  private static instance: IFormInput | null = null;
  public static get Instance(): IFormInput {
    return this.instance = this.instance || new FormInput();
  }
  public static Destroy(): void {
    this.instance = null;
  }

  private constructor() { }

  private forms = new Map<string, any>();

  SetFormInput<T>(id: string, model: T): GenericResult<T> {
    return new Query<T>(() => {
      this.forms.set(id, model);
      return this.forms.get(id);
    }).Execute();
  }

  GetFormInput<T>(id: string): GenericResult<T> {
    return new Query<T>(() => {
      if (this.forms.has(id)) {
        return this.forms.get(id);
      } else {
        throw new Error(`No form input with id:\"${id}\" exists.`);
      }
    }).Execute();
  }

  DeleteFormInput(id: string): Result {
    return new Command(() => this.forms.delete(id)).Execute();
  }
}
