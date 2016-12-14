import * as express from 'express';
import Joi = require('joi');
import _ = require('lodash');
import { errorBuilder } from './errorbuilder';

export class ValidatorMiddleware {

	public bindModel(req: express.Request, res: express.Response, next: express.NextFunction): void {
		let model = _.extend({}, req.body, req.params);
		req.body._model = model;
		next();
	}

	public validateModel(req: express.Request, res: express.Response, next: express.NextFunction): void {
		let model = req.body._model;
		let schema = req.body._schema;
		let joiOptions = {
			context: req,
			allowUnknown: true,
			abortEarly: false
		};

		let { error, value } = Joi.validate(model, schema, joiOptions);
		if (!error || error.details.length === 0) {
			req.body._model = value;
			next();
		} else {
			let errors = errorBuilder.buildErrors(error);
			res.status(400).send({ message: 'Bad Request', errors: errors });
		}
	}

}
export const validatorMiddleware = new ValidatorMiddleware();
