import { TestHelpers } from 'fyord';
import { RandomNumberComponent } from './random-number';

describe('RandomNumberComponent', () => {
  let classUnderTest: RandomNumberComponent;

  beforeEach(() => {
    classUnderTest = new RandomNumberComponent();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should add click event listener to new number button', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    setTimeout(() => {
      const newRandomNumberButton = document.querySelector('button') as HTMLButtonElement;
      newRandomNumberButton.click();
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => classUnderTest.Element !== null);
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
