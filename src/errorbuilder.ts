import Joi = require('joi');
import _ = require('lodash');

export class ErrorBuilder {

	public buildErrors(joiErrors: Joi.ValidationError): Array<{ field: string, messages: string[] }> {
		let translatedErrors;
		joiErrors.details.forEach((error) => {
			let errorExists = _.find(translatedErrors, (item: any) => {
				if (item && item.field === error.path) {
					item.messages.push(error.message);
					return item;
				}
				return;
			});

			if (!errorExists) {
				translatedErrors.push({
					field: error.path,
					messages: [error.message]
				});
			}
		});
		return translatedErrors;
	}
}
export const errorBuilder = new ErrorBuilder();