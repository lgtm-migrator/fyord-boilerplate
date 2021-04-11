import { EventTypes, TestHelpers } from 'fyord';
import { DataBindingComponent, Keys } from './data-binding';

describe('DataBindingComponent', () => {
  let classUnderTest: DataBindingComponent;

  beforeEach(() => {
    classUnderTest = new DataBindingComponent(false);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();
    classUnderTest.Behavior();

    setTimeout(() => {
      const input = document.getElementById(classUnderTest.Ids(Keys.Input)) as HTMLInputElement;
      input.value = 'a';
      TestHelpers.EmitKeyEventAtElement(input, 'a', EventTypes.Input);
    });

    const outputUpdatedToInputOnInput = await TestHelpers.TimeLapsedCondition(() => {
      return classUnderTest['outputLabel'].innerHTML === 'a';
    });

    expect(outputUpdatedToInputOnInput).toBeTruthy();
  });
});
