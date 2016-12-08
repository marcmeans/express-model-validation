import { RequestHandler } from 'express';
import Joi = require('joi');
import _ = require('lodash');

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

				if (errors.length === 0) { return next(); }
				return res.status(400).send({ message: 'Bad Request', errors: errors});
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

		let { error, value } = Joi.validate(model, schema, joiOptions);

		if (!error || error.details.length === 0) {
			_.assignIn(model, value); // joi responses are parsed into JSON
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
export const validator = new Validator();