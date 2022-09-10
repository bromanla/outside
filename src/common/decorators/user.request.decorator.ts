import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// decorator retrieves the user from the express request
export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
