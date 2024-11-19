import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/entities/role.entity';
import { Observable } from 'rxjs';

/**
 * A guard that determines whether the current user is authorized to access a route based on roles.
 * It uses metadata provided by the `Roles` decorator to compare the required roles with the user's roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Initializes the RolesGuard with a Reflector for accessing metadata.
   * @param {Reflector} reflector - A utility to get metadata set by decorators.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the request can proceed based on the user's roles.
   * Checks if the user has at least one of the required roles specified in the `Roles` decorator.
   *
   * @param {ExecutionContext} context - The execution context representing the current request.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - Whether the request can proceed.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve roles metadata for the current route handler
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // No roles specified; allow unrestricted access
      return true;
    }

    // Retrieve the request object and extract the user from it
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If there is no authenticated user, deny access
    if (!user) {
      return false; // Typically results in an UnauthorizedException being thrown
    }

    // Check if the user has any of the required roles
    return user.roles.some((role: Role) => roles.includes(role.name));
  }
}
