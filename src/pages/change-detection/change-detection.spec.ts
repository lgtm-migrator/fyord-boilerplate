import { Mock } from 'tsmockit';
import { IEventStore } from 'tsbase/Patterns/EventStore/IEventStore';
import { IObservable } from 'tsbase/Patterns/Observable/IObservable';
import { Strings } from 'tsbase/Functions/Strings';
import { TestHelpers } from '../../fjord/utilities/tests/testHelpers.spec';
import { RenderModes, Route } from '../../fjord/module';
import { ChangeDetectionPage, Keys } from './change-detection';
import { Routes } from '../routes';

type TestState = {
  userAge: number
};

const initialState = {
  userAge: 30
};

describe('ChangeDetectionPage', () => {
  let classUnderTest: ChangeDetectionPage;
  const pageMocks = TestHelpers.GetPageMocks();
  const mockStore = new Mock<IEventStore<TestState>>();
  const mockObservable = new Mock<IObservable<TestState>>();

  beforeEach(() => {
    mockObservable.Setup(o => o.Subscribe(() => null));
    mockStore.Setup(s => s.GetStateAt(Strings.Empty), initialState.userAge);
    mockStore.Setup(s => s.ObservableAt(Strings.Empty), mockObservable.Object);
    pageMocks.mockApp.Setup(a => a.Store, mockStore.Object);

    classUnderTest = new ChangeDetectionPage(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      pageMocks.mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', () => {
    const route = { path: Routes.ChangeDetection } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: Routes.HashParams } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render html', async () => {
    expect(await classUnderTest.Html()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    mockStore.Setup(s => s.SetStateAt(0, Strings.Empty));
    const renderedComponent = document.createElement('div');
    renderedComponent.innerHTML = await classUnderTest.Render();
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Id), renderedComponent);
    const incrementButton = document.createElement('button');
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Ids(Keys.Increment)), incrementButton);
    const decrementButton = document.createElement('button');
    pageMocks.mockDocument.Setup(d => d.getElementById(classUnderTest.Ids(Keys.Decrement)), decrementButton);

    classUnderTest.Behavior();

    setTimeout(() => {
      incrementButton.click();
      decrementButton.click();
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return mockStore.TimesMemberCalled(s => s.SetStateAt(0, Strings.Empty)) === 2;
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
