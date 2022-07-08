export class Constants {
  public static Config = {
    Admin: {
      LoginRoute: '/admin',
      ContentRoute: '/content'
    },
    Firebase: {
      ApiKey: 'AIzaSyCFCXNn4OPznWqCE2Kr3-VbOIhwcVcoQ8w',
      DatabaseURL: 'https://tsb-cms.firebaseio.com'
    },
    Session: {
      Key: 'session',
      TimeoutWarningPoint: 60 * 5,
      TimeoutPollFrequency: 1 * 60 * 1000,
      TimeoutDismissKey: 'userDismissedSessionTimeout'
    }
  }

  public static ExternalEndpoints = {
    EmailAuthentication: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${Constants.Config.Firebase.ApiKey}`,
    RefreshAuthentication: `https://securetoken.googleapis.com/v1/token?key=${Constants.Config.Firebase.ApiKey}`
  }
}
