import { Response, NextFunction } from 'express';
import Joi = require('joi');
import _ = require('lodash');
import { errorBuilder } from './errorbuilder';
import { IModelRequest } from './modelrequest';

export class ValidatorMiddleware {

	public bindModel(req: IModelRequest, res: Response, next: NextFunction): void {
		let model = _.extend({}, req.body, req.params, req.query);
		req._model = model;
		next();
	}

	public validateModel(req: IModelRequest, res: Response, next: NextFunction): void {
		let model = req._model;
		let schema = req._schema;
		let joiOptions = {
			context: req,
			allowUnknown: true,
			abortEarly: false
		};

		let { error, value } = Joi.validate(model, schema, joiOptions);
		if (!error || error.details.length === 0) {
			req._model = value;
			next();
		} else {
			let errors = errorBuilder.buildErrors(error);
			res.status(400).send({ message: 'Bad Request', errors: errors });
		}
	}

}
export const validatorMiddleware = new ValidatorMiddleware();
