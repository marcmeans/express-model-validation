import Joi = require('joi');

export class ErrorBuilder {

	public buildErrors(joiErrors: Joi.ValidationError): Array<{ field: string, messages: string[] }> {
		let translatedErrors = [];
		joiErrors.details.forEach((error) => {
			translatedErrors.push({
				field: error.path,
				messages: [error.message]
			});
		});
		return translatedErrors;
	}
}
export const errorBuilder = new ErrorBuilder();