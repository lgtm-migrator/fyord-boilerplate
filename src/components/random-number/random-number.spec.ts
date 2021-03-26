import { TestHelpers, EventTypes } from 'fyord';
import { RandomNumberComponent, Keys } from './random-number';

describe('RandomNumberComponent', () => {
  let classUnderTest: RandomNumberComponent;
  const pageMocks = TestHelpers.GetComponentMocks();


  beforeEach(() => {
    classUnderTest = new RandomNumberComponent(
      false,
      pageMocks.mockDocument.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should add click event listener to new number button', async () => {
    spyOn(window, 'alert');
    const renderedComponent = document.createElement('div');
    renderedComponent.innerHTML = await classUnderTest.Render();
    const button = document.createElement('button');
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Id), renderedComponent);
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Ids(Keys.NewNumberButton)), button);

    classUnderTest.Behavior();

    setTimeout(() => {
      TestHelpers.EmitEventAtElement(button, EventTypes.Click);
    });

    const outputUpdatedToInput = await TestHelpers.TimeLapsedCondition(() => classUnderTest.Element !== null);
    expect(outputUpdatedToInput).toBeTruthy();
  });
});
