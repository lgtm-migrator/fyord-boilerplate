import { RenderModes, Route, TestHelpers, Asap } from 'fyord';
import { GenericResult } from 'tsbase/Patterns/Result/GenericResult';
import { Mock } from 'tsmockit';
import { Content } from '../../models/content';
import { IAuthentication } from '../../services/authentication/Authentication';
import { IContentRepository } from '../../services/contentRepository/contentRepository';
import { Default } from './default';

describe('Default', () => {
  let classUnderTest: Default;
  const pageMocks = TestHelpers.GetComponentMocks();
  const mockContentRepository = new Mock<IContentRepository>();
  const mockAuthentication = new Mock<IAuthentication>();

  beforeEach(() => {
    classUnderTest = new Default(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object,
      mockContentRepository.Object,
      mockAuthentication.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', async () => {
    mockContentRepository.Setup(r => r.Get(Content, '/default'), new GenericResult(new Content()));
    const route = { path: '/default' } as Route;
    expect(await classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return true for routes that do not match - as 404', async () => {
    mockContentRepository.Setup(r => r.Get(Content, '/default'), new GenericResult(
      {
        IsSuccess: false,
        Validate: () => false
      }
    ));
    const route = { path: '/not-found' } as Route;
    expect(await classUnderTest.Route(route)).toBeTruthy();
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
