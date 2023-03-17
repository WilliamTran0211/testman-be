import { SetMetadata } from '@nestjs/common';

export const Resource = (...resource: string[]) =>
    SetMetadata('resource', resource);

export const Permissions = (...permission: string[]) =>
    SetMetadata('permission', permission);
