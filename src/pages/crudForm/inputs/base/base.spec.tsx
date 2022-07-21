import { TestHelpers, Asap, ParseJsx } from 'fyord';
import { Base, ValueType } from './base';

describe('Base', () => {
  class TestClass extends Base {
    Template = async () => <div></div>;
    protected getInputValue(): ValueType | ValueType[] {
      throw new Error('Method not implemented.');
    }
  }
  let classUnderTest: TestClass;

  beforeEach(() => {
    classUnderTest = new TestClass();
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
