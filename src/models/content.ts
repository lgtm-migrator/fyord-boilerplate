import { Model, Required } from 'tsbase/Models/module';
import { Strings } from 'tsbase/System/Strings';

export class Content extends Model<Content> {
  @Required()
  public Title = Strings.Empty;
  public Description = Strings.Empty;
  public Body = Strings.Empty;
}
