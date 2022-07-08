import { Strings } from 'tsbase/System/Strings';
import { DateProvider, IDateProvider } from '../dateProvider/providers/DateProvider';

export class FirebaseLoginResponse {
  public IdToken = Strings.Empty;
  public Email = Strings.Empty;
  public RefreshToken = Strings.Empty;
  public ExpiresIn = Strings.Empty;
  public LocalId = Strings.Empty;
  public Registered = false;
  public Timestamp = this.dateProvider.GetDate().getTime();

  constructor(private dateProvider: IDateProvider = new DateProvider()) { }

  public ResetTimestamp(): void {
    this.Timestamp = this.dateProvider.GetDate().getTime();
  }

  public GetSecondsTillExpiration(): number {
    const expirationTime = new Date(this.Timestamp + (parseInt(this.ExpiresIn) * 1000)).getTime();
    return Math.round((expirationTime - this.dateProvider.GetDate().getTime()) / 1000);
  }
}
