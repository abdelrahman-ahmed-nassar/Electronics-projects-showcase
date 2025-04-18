export const translateSupabaseErrors = (error: string) => {
  if (!error) return null;
  switch (error) {
    case "anonymous_provider_disabled":
      return "Anonymous provider is disabled.";
    case "bad_code_verifier":
      return "Bad code verifier.";
    case "bad_json":
      return "Bad JSON.";
    case "bad_jwt":
      return "Bad JWT.";
    case "bad_oauth_callback":
      return "Bad OAuth callback.";
    case "bad_oauth_state":
      return "Bad OAuth state.";
    case "captcha_failed":
      return "CAPTCHA failed.";
    case "conflict":
      return "Conflict.";
    case "email_address_invalid":
      return "Email address is invalid.";
    case "email_address_not_authorized":
      return "Email address is not authorized.";
    case "email_conflict_identity_not_deletable":
      return "Email conflict: Identity is not deletable.";
    case "email_exists":
      return "Email already exists.";
    case "email_not_confirmed":
      return "Email is not confirmed.";
    case "email_provider_disabled":
      return "Email provider is disabled.";
    case "flow_state_expired":
      return "Flow state has expired.";
    case "flow_state_not_found":
      return "Flow state not found.";
    case "hook_payload_invalid_content_type":
      return "Hook payload is invalid content type.";
    case "hook_payload_over_size_limit":
      return "Hook payload is over size limit.";
    case "hook_timeout":
      return "Hook has timed out.";
    case "identity_already_exists":
      return "Identity already exists.";
    case "identity_not_found":
      return "Identity not found.";
    case "insufficient_aal":
      return "Insufficient AAL.";
    case "invite_not_found":
      return "Invite not found.";
    case "invalid_credentials":
      return "Invalid credentials.";
    case "manual_linking_disabled":
      return "Manual linking is disabled.";
    case "mfa_challenge_expired":
      return "MFA challenge has expired.";
    case "mfa_factor_not_found":
      return "MFA factor not found.";
    case "mfa_verification_failed":
      return "MFA verification failed.";
    case "no_authorization":
      return "No authorization.";
    case "not_admin":
      return "Not admin.";
    case "oauth_provider_not_supported":
      return "OAuth provider is not supported.";
    case "otp_disabled":
      return "OTP is disabled.";
    case "otp_expired":
      return "OTP has expired.";
    case "over_email_send_rate_limit":
      return "Over email send rate limit.";
    case "phone_exists":
      return "Phone number already exists.";
    case "phone_not_confirmed":
      return "Phone number is not confirmed.";
    case "provider_disabled":
      return "Provider is disabled.";
    case "reauthentication_needed":
      return "Reauthentication is needed.";
    case "refresh_token_not_found":
      return "Refresh token not found.";
    case "request_timeout":
      return "Request has timed out.";
    case "same_password":
      return "Same password.";
    case "session_expired":
      return "Session has expired.";
    case "signup_disabled":
      return "Sign up is disabled.";
    case "user_already_exists":
      return "User already exists.";
    case "user_banned":
      return "User is banned.";
    case "user_not_found":
      return "User not found.";
    case "validation_failed":
      return "Validation failed.";
    case "weak_password":
      return "Weak password.";
    default:
      return "Unexpected error.";
  }
};
