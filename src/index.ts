import { RequestHandler, Request, Response, NextFunction } from 'express';
import { validatorMiddleware } from './validator.middleware';

export class Validator {

	public bind(schema: any): RequestHandler[] { // tslint:disable-line
		return [
			(req: Request, res: Response, next: NextFunction) => {
				if (!schema) {
					throw new Error('Please provide a validation schema');
				} else {
					req._schema = schema;
					return next();
				}
			},
			validatorMiddleware.bindModel,
			validatorMiddleware.validateModel];
	}

}
export const validator = new Validator();