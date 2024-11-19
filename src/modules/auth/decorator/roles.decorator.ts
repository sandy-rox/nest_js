import { SetMetadata } from '@nestjs/common';

/**
 * A custom decorator to define roles required for accessing a route or controller.
 * This decorator sets metadata with a key of 'roles' and a value of the specified roles array.
 * It can be used with a guard to restrict access based on roles.
 *
 * @param {string[]} roles - The roles allowed to access the route or controller.
 * @returns {CustomDecorator<string>} - A decorator function that sets metadata for the specified roles.
 *
 * Usage:
 * @Roles('admin', 'user')
 * @Controller('some-path')
 * export class SomeController {}
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
