import * as chai from 'chai';
import { ErrorBuilder } from './errorbuilder';
import Joi = require('joi');

describe('ErrorBuilder', () => {

	let _classUnderTest: ErrorBuilder;
	let expect = chai.expect;
	let _schema;
	let joiOptions = {
		context: {},
		allowUnknown: true,
		abortEarly: false
	};

	describe('buildErrors', () => {

		beforeEach(() => {
			_schema = { first: Joi.string().required(), second: Joi.string().required() };

			_classUnderTest = new ErrorBuilder();
		});

		it('should translate joi errors', (done) => {
			let { error } = Joi.validate({}, _schema, joiOptions);

			let actual = _classUnderTest.buildErrors(error);

			expect(actual).to.contain({ field: 'first', messages: ['"first" is required'] });
			expect(actual).to.contain({ field: 'second', messages: ['"second" is required'] });

			done();
		});

	});
});
