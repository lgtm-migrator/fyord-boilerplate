import { Strings } from 'tsbase/System/Strings';
import { IFormInput, FormInput } from './formInput';

class TestClass {
  public Name = Strings.Empty;
}

describe('FormInput', () => {
  let classUnderTest: IFormInput;

  const testId = 'testId';

  beforeEach(() => {
    FormInput.Destroy();
    classUnderTest = FormInput.Instance;
    classUnderTest.SetFormInput(testId, new TestClass());
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get form input', () => {
    const getResult = classUnderTest.GetFormInput(testId);

    expect(getResult.IsSuccess).toBeTruthy();
    expect(getResult.Value).toBeDefined();
  });

  it('should return a failed result when getting a form input for an id that is not set', () => {
    classUnderTest.DeleteFormInput(testId);
    const getResult = classUnderTest.GetFormInput(testId);

    expect(getResult.IsSuccess).toBeFalsy();
    expect(getResult.ErrorMessages.indexOf(`No form input with id:\"${testId}\" exists.`) >= 0).toBeTruthy();
  });

  it('should update form input', () => {
    const testName = 'testName';
    const testClassInstance = new TestClass();
    testClassInstance.Name = testName;

    const updateResult = classUnderTest.SetFormInput(testId, testClassInstance);

    expect(updateResult.IsSuccess).toBeTruthy();
    expect(updateResult.Value?.Name).toEqual(testName);
  });

  it('should delete form input', () => {
    const deleteResult = classUnderTest.DeleteFormInput(testId);

    expect(deleteResult.IsSuccess).toBeTruthy();
    expect(classUnderTest.GetFormInput(testId).Value).toEqual(undefined);
  });
});
