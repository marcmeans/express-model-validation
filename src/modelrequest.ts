import {Request} from 'express';

export interface IModelRequest extends Request {
	_model: any; // tslint:disable-line:no-any
	_schema: any; // tslint:disable-line:no-any
}