export type ErrorType = 
  | 'network'
  | 'authentication'
  | 'validation'
  | 'insufficient_balance'
  | 'tournament_full'
  | 'profile_incomplete'
  | 'unauthorized'
  | 'not_found'
  | 'backend_error'
  | 'unknown';

export interface ErrorMessage {
  title: string;
  message: string;
  action?: string;
}

export function getErrorMessage(error: any): ErrorMessage {
  const errorString = error?.message || error?.toString() || '';

  // Profile incomplete
  if (errorString.includes('Profile incomplete') || errorString.includes('profile')) {
    return {
      title: 'Profile Incomplete',
      message: 'Please complete your profile with your name and Free Fire UID before registering for tournaments.',
      action: 'Complete Profile',
    };
  }

  // Insufficient balance
  if (errorString.includes('Insufficient balance') || errorString.includes('balance')) {
    return {
      title: 'Insufficient Balance',
      message: 'You don\'t have enough funds in your wallet. Please deposit funds to continue.',
      action: 'Go to Wallet',
    };
  }

  // Tournament full
  if (errorString.includes('full') || errorString.includes('slots')) {
    return {
      title: 'Tournament Full',
      message: 'This tournament has reached maximum capacity. Try registering for another tournament.',
      action: 'Browse Tournaments',
    };
  }

  // Unauthorized
  if (errorString.includes('Unauthorized') || errorString.includes('permission')) {
    return {
      title: 'Access Denied',
      message: 'You don\'t have permission to perform this action. Please contact an administrator.',
      action: 'Go Back',
    };
  }

  // Authentication
  if (errorString.includes('authenticated') || errorString.includes('login')) {
    return {
      title: 'Authentication Required',
      message: 'Please log in to continue using Tournament Khelba.',
      action: 'Log In',
    };
  }

  // Network error
  if (errorString.includes('network') || errorString.includes('fetch') || errorString.includes('connection')) {
    return {
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
      action: 'Retry',
    };
  }

  // Not found
  if (errorString.includes('not found') || errorString.includes('404')) {
    return {
      title: 'Not Found',
      message: 'The requested resource could not be found. It may have been removed or doesn\'t exist.',
      action: 'Go Home',
    };
  }

  // Backend error
  if (errorString.includes('trap') || errorString.includes('backend')) {
    return {
      title: 'Server Error',
      message: 'An error occurred on the server. Our team has been notified. Please try again later.',
      action: 'Try Again',
    };
  }

  // Default unknown error
  return {
    title: 'Something Went Wrong',
    message: errorString || 'An unexpected error occurred. Please try again.',
    action: 'Try Again',
  };
}
