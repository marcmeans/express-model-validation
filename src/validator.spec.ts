/* tslint:disable:no-any */
import * as sinon from 'sinon';
import * as chai from 'chai';
import { Validator } from './validator';

describe('Validator', () => {

	let _classUnderTest: Validator;
	let assert = sinon.assert;
	let expect = chai.expect;
	let _schema;

	describe('bind', () => {

		beforeEach(() => {
			_schema = { one: 1, two: 2 };

			_classUnderTest = new Validator();
		});

		it('should get version from package.json', (done) => {
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