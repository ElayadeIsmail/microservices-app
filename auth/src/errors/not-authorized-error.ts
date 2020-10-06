import { CustomError } from './custom-error';
import { NotFoundError } from './not-found-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Not  authorized');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: 'Not  authorized',
      },
    ];
  }
}
