import { Strings } from 'tsbase/System/Strings';

export class FirebaseRefreshResponse {
  public ExpiresIn = Strings.Empty;
  public TokenType = 'Bearer';
  public RefreshToken = Strings.Empty;
  public IdToken = Strings.Empty;
  public UserId = Strings.Empty;
  public ProjectId = Strings.Empty;
}
