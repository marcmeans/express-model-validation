import { RequestHandler } from 'express';
import { validatorMiddleware } from './validator.middleware';

export class Validator {

	public bind(schema: any /* tslint:disable-line */): RequestHandler[] {
		return [
			(req, res, next) => {
				if (!schema) {
					throw new Error('Please provide a validation schema');
				} else {
					req.body._schema = schema;
					return next();
				}
			},
			validatorMiddleware.bindModel,
			validatorMiddleware.validateModel];
	}

}
export const validator = new Validator();