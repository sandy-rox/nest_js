/**
 * Structure of the response returned when a user successfully logs in.
 * Contains the access token and optionally the refresh token.
 */
export interface LoginResponse {
  /**
   * The access token issued to the user upon successful login.
   * This token is used for authenticating the user in subsequent requests.
   */
  accessToken: string;

  /**
   * The refresh token issued to the user (optional).
   * This token is used to refresh the access token when it expires.
   * It may not always be included in the response, depending on the authentication flow.
   */
  refreshToken?: string;
}
