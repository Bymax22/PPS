export function getFriendlyAuthError(error?: string, role?: string) {
  if (!error) return 'Unable to sign in. Please check your details and try again.'

  switch (error) {
    case 'CredentialsSignin':
      if (role === 'ADMIN') {
        return 'Admin sign in failed. Please check your email, password, and confirm you are using an administrator account.'
      }
      return 'We could not sign you in with those credentials. Check your email and password and try again.'
    case 'AccessDenied':
      return 'Access denied. You do not have permission to sign in with this account.'
    case 'Verification':
      return 'Sign in verification failed. Please try again or contact support.'
    case 'OAuthSignin':
      return 'Sign in failed while connecting to the authentication provider. Please try again.'
    case 'OAuthCallback':
      return 'There was a problem verifying your sign-in. Try again in a moment.'
    case 'OAuthCreateAccount':
      return 'Unable to create an account with the provider. Please try another sign-in method.'
    case 'EmailCreateAccount':
      return 'Unable to create your account with that email address. Please try again.'
    case 'Callback':
      return 'There was a problem processing your sign in request. Please try again.'
    default:
      return error.replace(/_/g, ' ')
  }
}
