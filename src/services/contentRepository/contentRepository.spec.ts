import { Mock, Times } from 'tsmockit';
import { HttpClient } from 'tsbase/Net/Http/HttpClient';
import { ISerializer } from 'tsbase/Utility/Serialization/ISerializer';
import { IAuthenticationService } from '../authentication/AuthenticationService';
import { ContentRepository, IContentRepository } from './contentRepository';
import { FirebaseLoginResponse } from '../authentication/models/FirebaseLoginResponse';
import { Strings } from 'tsbase/System/Strings';
import { Content } from '../../models/content';

const testJsonContent = '{\
  "fake" : {\
    "body" : "<strong>Fake</strong>",\
    "description" : "This page doesn\'t exist",\
    "title" : "Fake"\
  }\
}';

describe('ContentRepository', () => {
  const mockHttpClient = new Mock<HttpClient>();
  const mockSerializer = new Mock<ISerializer>();
  const mockAuthenticationService = new Mock<IAuthenticationService>();
  let classUnderTest: IContentRepository;

  const session = new FirebaseLoginResponse();
  session.IdToken = 'fakeToken';
  const successfulHttpResponse = { ok: true, status: 200, statusText: 'OK' };
  const failedHttpResponse = { ok: false, status: 400, statusText: 'Bad Request' };

  function resetClassUnderTest() {
    ContentRepository.Destroy();
    mockSerializer.Setup(s => s.Serialize(Content, {}), JSON.parse(testJsonContent));
    mockAuthenticationService.Setup(s => s.RefreshSession(false));

    classUnderTest = ContentRepository.Instance(
      mockHttpClient.Object,
      mockSerializer.Object,
      mockAuthenticationService.Object);

    classUnderTest['cache'] = {};
  }

  beforeEach(() => {
    resetClassUnderTest();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get content when it exists', async () => {
    mockHttpClient.Setup(c => c.Get(Strings.Empty), { body: testJsonContent });
    resetClassUnderTest();

    const result = await classUnderTest.Get(Content, Strings.Empty);

    mockSerializer.Verify(s => s.Serialize(Content, testJsonContent), Times.Once);
    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value).toEqual(JSON.parse(testJsonContent));
  });

  it('should return a failed result when content does not exist', async () => {
    mockHttpClient.Setup(c => c.Get(Strings.Empty), { body: null });
    resetClassUnderTest();

    const result = await classUnderTest.Get(Content, Strings.Empty);

    mockSerializer.Verify(s => s.Serialize(Content, testJsonContent), Times.Never);
    expect(result.IsSuccess).toBeFalsy();
    expect(result.Value).toBeFalsy();
  });

  it('should get raw content without serializing when content exists', async () => {
    mockHttpClient.Setup(c => c.Get(Strings.Empty), { ok: true, body: 'test' });
    resetClassUnderTest();

    const result = await classUnderTest.GetRaw(Strings.Empty);

    mockSerializer.Verify(s => s.Serialize(Content, testJsonContent), Times.Never);
    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value).toEqual('test');
  });

  it('should return a failed result for raw content when it does not exists', async () => {
    mockHttpClient.Setup(c => c.Get(Strings.Empty), 'null');
    resetClassUnderTest();

    const result = await classUnderTest.GetRaw(Strings.Empty);

    mockSerializer.Verify(s => s.Serialize(Content, testJsonContent), Times.Never);
    expect(result.IsSuccess).toBeFalsy();
    expect(result.Value).toBeFalsy();
  });

  it('should successfully save a string value at path', async () => {
    const stringToSave = 'test';
    mockAuthenticationService.Setup(s => s.Session, session);
    mockHttpClient.Setup(c => c.Put(Strings.Empty, stringToSave), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(stringToSave, '/test');

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should successfully save an object value at path', async () => {
    const objectToSave = JSON.parse(testJsonContent);
    mockAuthenticationService.Setup(s => s.Session, session);
    mockHttpClient.Setup(c => c.Put(Strings.Empty, objectToSave), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(objectToSave, '/test');

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should successfully delete value at path', async () => {
    mockAuthenticationService.Setup(s => s.Session, session);
    mockHttpClient.Setup(c => c.Delete(Strings.Empty), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(null, '/test');

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should attempt to delete value at path when no session exists', async () => {
    mockAuthenticationService.Setup(s => s.Session, null);
    mockHttpClient.Setup(c => c.Delete(Strings.Empty), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(null, '/test');

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should return a failed result when a failing response is returned', async () => {
    const stringToSave = 'test';
    mockAuthenticationService.Setup(s => s.Session, session);
    mockHttpClient.Setup(c => c.Put(Strings.Empty, stringToSave), failedHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(stringToSave, '/test');

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain('Failed with status code: 400 | text: Bad Request');
  });

  it('should attempt to send request without auth param if no session available', async () => {
    const stringToSave = 'test';
    mockAuthenticationService.Setup(s => s.Session, null);
    mockHttpClient.Setup(c => c.Put(Strings.Empty, stringToSave), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(stringToSave, '/test');

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should clean path when set to /content', async () => {
    const stringToSave = 'test';
    mockAuthenticationService.Setup(s => s.Session, null);
    mockHttpClient.Setup(c => c.Put(Strings.Empty, stringToSave), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(stringToSave, '/content');

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should clean path when set to /', async () => {
    const stringToSave = 'test';
    mockAuthenticationService.Setup(s => s.Session, null);
    mockHttpClient.Setup(c => c.Put(Strings.Empty, stringToSave), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(stringToSave, '/');

    expect(result.IsSuccess).toBeTruthy();
  });

  it('should clean path when it begins with //', async () => {
    const stringToSave = 'test';
    mockAuthenticationService.Setup(s => s.Session, null);
    mockHttpClient.Setup(c => c.Put(Strings.Empty, stringToSave), successfulHttpResponse);
    resetClassUnderTest();

    const result = await classUnderTest.SaveAtPath(stringToSave, '//test');

    expect(result.IsSuccess).toBeTruthy();
  });

});
