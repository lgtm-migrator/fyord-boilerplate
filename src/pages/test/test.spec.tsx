import { Expect } from 'tsmockit';
import { RenderModes, Route, TestHelpers, Asap } from 'fyord';
import { Test } from './test';
import { Routes } from '../../routes';

describe('Test', () => {
  let classUnderTest: Test;
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new Test(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', async () => {
    const route = { href: Routes.Test } as Route;
    expect(await classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', async () => {
    const route = { path: '/not-found' } as Route;
    expect(await classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    await Expect(
      () => true, // returns the result of this function once truthy to the following function for assertions
      (m) => m.toBeTruthy());
  });
});
