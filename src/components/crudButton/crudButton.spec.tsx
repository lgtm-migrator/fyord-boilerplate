import { TestHelpers, Asap } from 'fyord';
import { Mock } from 'tsmockit';
import { IAuthentication } from '../../services/authentication/Authentication';
import { CrudButton } from './crudButton';

describe('CrudButton', () => {
  let classUnderTest: CrudButton;
  const mockAuthentication = new Mock<IAuthentication>();

  beforeEach(() => {
    classUnderTest = new CrudButton(undefined, undefined, mockAuthentication.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
