import { EventTypes, TestHelpers } from 'fyord';
import { DataBindingComponent, Keys } from './data-binding';

describe('DataBindingComponent', () => {
  let classUnderTest: DataBindingComponent;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new DataBindingComponent(
      false,
      pageMocks.mockDocument.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should add input event listener to input element', async () => {
    spyOn(window, 'alert');
    const renderedComponent = document.createElement('div');
    renderedComponent.innerHTML = await classUnderTest.Render();
    const inputElement = document.createElement('input');
    const outputElement = document.createElement('p');
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Id), renderedComponent);
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Ids(Keys.Input)), inputElement);
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Ids(Keys.Output)), outputElement);

    classUnderTest.Behavior();

    setTimeout(() => {
      inputElement.value = 'a';
      TestHelpers.EmitKeyEventAtElement(inputElement, 'a', EventTypes.Input);
    });

    const outputUpdatedToInput = await TestHelpers.TimeLapsedCondition(() => outputElement.innerHTML === 'a');
    expect(outputUpdatedToInput).toBeTruthy();
  });
});
