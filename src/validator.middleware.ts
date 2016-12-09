import { RequestHandler } from 'express';
import Joi = require('joi');
import _ = require('lodash');

export class ValidatorMiddleware {

	public bindModel(req, res, next): RequestHandler {

		let model = _.extend({}, req.body, req.params);
		req.body._model = model;

		return next();
	}

	public validateModel(req, res, next): RequestHandler {

		let errors = [];
		ValidatorMiddleware.validate(errors, req.body._model, req.params._schema);

		if (errors.length === 0) {
			return next();
		} else {
			return res.status(400).send({ message: 'Bad Request', errors: errors });
		}
	}

	private static validate(errObj: any[], model: any, schema: any): void{
		if (!model || !schema) { return; };

		let joiOptions = {
			context: model,
			allowUnknown: true,
			abortEarly: false
		};

		let { error, value } = Joi.validate(model, schema, joiOptions);

		if (!error || error.details.length === 0) {
			_.assignIn(model, value);
			return;
		}

		error.details.forEach((error) => {
			let errorExists = _.find(errObj, (item: any) => {
				if (item && item.field === error.path) {
					item.messages.push(error.message);
					return item;
				}
				return;
			});

			if (!errorExists) {
				errObj.push({
					field: error.path,
					messages: [error.message]
				});
			}
		});
	}

}
export const validatorMiddleware = new ValidatorMiddleware();