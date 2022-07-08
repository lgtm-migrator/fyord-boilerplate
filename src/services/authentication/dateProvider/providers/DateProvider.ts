export interface IDateProvider {
  GetDate(): Date;
}

export class DateProvider implements IDateProvider {
  GetDate(): Date {
    return new Date();
  }
}
