import { RenderModes, Route, TestHelpers, Asap } from 'fyord';
import { GenericResult } from 'tsbase/Patterns/Result/GenericResult';
import { Mock } from 'tsmockit';
import { IContentRepository } from '../../services/contentRepository/contentRepository';
import { Content } from './content';

describe('Content', () => {
  let classUnderTest: Content;
  const pageMocks = TestHelpers.GetComponentMocks();
  const mockContentRepository = new Mock<IContentRepository>();

  beforeEach(() => {
    pageMocks.mockRouter.Setup(r => r.UseClientRouting());
    mockContentRepository.Setup(r => r.GetRaw(''), new GenericResult('{}'));

    classUnderTest = new Content(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      mockContentRepository.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', async () => {
    const route = { path: '/content' } as Route;
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

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
