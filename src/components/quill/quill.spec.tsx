import { TestHelpers, Asap } from 'fyord';
import { Quill } from './quill';

class FakeQuill { }

describe('Quill', () => {
  let classUnderTest: Quill;

  beforeEach(() => {
    classUnderTest = new Quill(
      undefined, undefined, FakeQuill
    );
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
