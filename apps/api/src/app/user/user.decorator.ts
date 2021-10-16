import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TheUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user
  }
);
