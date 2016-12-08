/* tslint:disable:no-any */
import * as sinon from 'sinon';
import * as chai from 'chai';
import { Validator } from './validator';
import Joi = require('joi');

describe('Validator', () => {

	let _classUnderTest: Validator;
	//let assert = sinon.assert;
	let expect = chai.expect;
	let _schema, _errors, _value;

	describe('bind', () => {

		beforeEach(() => {
			_schema = { one: 1, two: 2 };

			_errors = undefined;
			_value =
			Joi.validate = sinon.stub().yields(_errors, _value);

			_classUnderTest = new Validator();
		});

		it('should pass', (done) => {
			_classUnderTest.bind(_schema);

			done();
		});

		it('should throw an error if no schema provided', (done) => {
			let err = 'Please provide a validation schema';

			expect(_classUnderTest.bind.bind(undefined)).to.throw(err);

			done();
		});

	});

});
/* tslint:enable:no-any */