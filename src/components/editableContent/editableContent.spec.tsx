import { TestHelpers, Asap } from 'fyord';
import { Mock } from 'tsmockit';
import { InputTypes } from '../../enums/inputTypes';
import { Models } from '../../models/models';
import { IAuthentication } from '../../services/authentication/Authentication';
import { IContentRepository } from '../../services/contentRepository/contentRepository';
import { EditableContent } from './editableContent';

describe('EditableContent', () => {
  const mockAuthentication = new Mock<IAuthentication>();
  const mockContentRepository = new Mock<IContentRepository>();
  let classUnderTest: EditableContent;

  beforeEach(() => {
    classUnderTest = new EditableContent(
      {
        field: 'test',
        inputType: InputTypes.Text,
        location: 'location',
        model: Models.Content
      },
      undefined,
      mockContentRepository.Object,
      mockAuthentication.Object
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    mockContentRepository.Setup(r => r.GetRaw(''), {});
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
