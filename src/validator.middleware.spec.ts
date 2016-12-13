import * as sinon from 'sinon';
import * as chai from 'chai';
import { ValidatorMiddleware } from './validator.middleware';
import Joi = require('joi');
import _ = require('lodash');
import { errorBuilder } from './errorBuilder';

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

	describe('validateModel', () => {

		let _translatedModel, _translatedErrors;

		beforeEach(() => {
			_translatedModel = { x: 1, y: 'q' };
			_translatedErrors = { what: 1, who: 2, why: 3 };
			Joi.validate = sinon
				.stub()
				.returns({ error: undefined, value: _translatedModel });
			errorBuilder.buildErrors = sinon.stub().returns(_translatedErrors);
			_req = {
				body: {
					_model: { m: 1 },
					_schema: { s: 2 }
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

		it('should call validate on Joi with the model, schema, and default options', (done) => {

			_classUnderTest.validateModel(_req, _res, _next);

			assert.calledOnce(<sinon.SinonSpy>Joi.validate);
			assert.calledWith(<sinon.SinonSpy>Joi.validate,
				{ m: 1 },
				{ s: 2 },
				{
					context: { m: 1 },
					allowUnknown: true,
					abortEarly: false
				});

			done();
		});

		it('should set model and call next when no errors are returned from Joi', (done) => {

			_classUnderTest.validateModel(_req, _res, _next);

			expect(_req.body._model).equals(_translatedModel);

			assert.calledOnce(_next);
			assert.calledWith(_next, );

			done();
		});

		it('should set model and call next when no error details returned from Joi', (done) => {
			Joi.validate = sinon
				.stub()
				.returns({ error: { details: [] }, value: _translatedModel });

			_classUnderTest.validateModel(_req, _res, _next);

			expect(_req.body._model).equals(_translatedModel);

			assert.calledOnce(_next);
			assert.calledWith(_next, );

			done();
		});

		it('should call buildErrors with joi errors when joi returns errors', (done) => {
			let localError = { details: [{ err: 1, er2: 'abc' }] };
			Joi.validate = sinon
				.stub()
				.returns({ error: localError, value: _translatedModel });

			_classUnderTest.validateModel(_req, _res, _next);

			assert.calledWith(<sinon.SinonSpy>errorBuilder.buildErrors, localError);

			done();
		});

		it('should return 400 with built errors when joi returns errors', (done) => {
			let localError = { details: [{ err: 1, er2: 'abc' }] };
			Joi.validate = sinon
				.stub()
				.returns({ error: localError, value: _translatedModel });

			_classUnderTest.validateModel(_req, _res, _next);

			assert.calledOnce(<sinon.SinonSpy>_res.status);
			assert.calledWith(<sinon.SinonSpy>_res.status, 400);
			assert.calledOnce(<sinon.SinonSpy>_res.send);
			assert.calledWith(<sinon.SinonSpy>_res.send, { message: 'Bad Request', errors: _translatedErrors });

			done();
		});

	});

});