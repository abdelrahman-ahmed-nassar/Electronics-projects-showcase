const messages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
  INVALID_PASSWORD: "Current password is incorrect.",
  USER_ALREADY_EXISTS: "An account with this email already exists.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "An account with this email already exists.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
  PASSWORD_TOO_LONG: "Password is too long.",
  SAME_PASSWORD: "New password must be different from the current password.",
  INVALID_EMAIL: "Email address is invalid.",
  EMAIL_NOT_VERIFIED: "Email is not verified.",
  USER_NOT_FOUND: "User not found.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
};

export const translateAuthErrors = (error: string) => {
  if (!error) return null;
  return messages[error] ?? error;
};
