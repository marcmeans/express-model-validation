import { RequestHandler } from 'express';
import Joi = require('joi');
import _ = require('lodash');
import { ValidationError } from './validation.error';

export class Validator {

	public bind(schema: {}): RequestHandler {
		if (!schema) {
			throw new Error('Please provide a validation schema');
		} else {
			return <RequestHandler>(req, res, next) => {
				let errors = [];
				let model = _.extend({}, req.body, req.params);
				req.body._model = model;
				this.validate(errors, req.body._model, schema);

				if (errors && errors.length === 0) { return next(); }

				return next(new ValidationError(errors, false));
			};
		}
	}

	private validate(errObj, model, schema): void {
		if (!model || !schema) { return; };

		let joiOptions = {
			context: model,
			allowUnknown: true,
			abortEarly: false
		};

		Joi.validate(model, schema, joiOptions, (errors, value) => {
			if (!errors || errors.details.length === 0) { return; }
			// build validation messages
			errors.details.forEach((error) => {
				let errorExists = _.find(errObj, (item: any) => {
					if (item && item.field === error.path) {
						item.messages.push(error.message);
						item.types.push(error.type);
						return item;
					}
					return;
				});

				if (!errorExists) {
					errObj.push({
						field: error.path,
						location: location,
						messages: [error.message],
						types: [error.type]
					});
				}

			});
		});
	}
}
export const validator = new Validator();