import { RequestHandler } from 'express';

export interface Validator {
	bind(schema: any): RequestHandler[];
}