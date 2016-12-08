import * as sinon from 'sinon';
import * as chai from 'chai';
import { ValidatorMiddleware } from './validator.middleware';
import Joi = require('joi');
import _ = require('lodash');

describe('Validator', () => {

	let _classUnderTest: ValidatorMiddleware;
	let assert = sinon.assert;
	let expect = chai.expect;
	let _req, _res, _next;

	describe('bindModel', () => {

		beforeEach(() => {
			_req = {
				body: {
					bodyProp: 'one'
				},
				params: {
					paramProp: 'two'
				}
			};
			let sspy = sinon.spy();
			_res = <any>{
				status: sinon.stub().returns({ send: sspy }),
				send: sspy
			};
			_next = sinon.spy();

			_classUnderTest = new ValidatorMiddleware();
		});

		it('should place param and body properties on _model', (done) => {
			let expected = _.extend({}, _req.body, _req.params);

			_classUnderTest.bindModel(_req, _res, _next);

			expect(_req.body._model).contain(expected);
			done();
		});

		it('should call next', (done) => {
			_classUnderTest.bindModel(_req, _res, _next);

			assert.calledOnce(_next);
			assert.calledWithExactly(_next);

			done();
		});

	});

	describe('validateModel', () =>{

		beforeEach(()=>{

		});

		it('should call validate on ', (done)=>{
			done();
		});

	});

});