import { TestHelpers, Asap } from 'fyord';
import { EditableContent } from './editableContent';

describe('EditableContent', () => {
  let classUnderTest: EditableContent;

  beforeEach(() => {
    classUnderTest = new EditableContent();
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
