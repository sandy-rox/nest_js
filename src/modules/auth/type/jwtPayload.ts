import { Role } from '../../users/entities/role.entity';

/**
 * Payload structure for the access token.
 * This interface defines the data included in the access token payload.
 */
export interface AccessTokenPayload {
  /**
   * The unique ID of the user. This ID is used to identify the user in the system.
   */
  userId: number;

  /**
   * An array of roles assigned to the user.
   * Each role corresponds to a specific set of permissions granted to the user.
   */
  roles: Role[];
}

/**
 * Payload structure for the refresh token.
 * This interface defines the data included in the refresh token payload.
 */
export interface RefreshTokenPayload {
  /**
   * The unique ID of the user. The refresh token is tied to a specific user for reauthentication.
   */
  userId: number;
}
