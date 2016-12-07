import * as _ from 'lodash';

export class ValidationError extends Error {

	constructor(
		private _errors,
		private _flatten) {

		super('validation error');
		(<any>Error).captureStackTrace(this, this.constructor);
		this.name = 'ValidationError';
	}

	public toString(): string {
		return JSON.stringify(this.toJSON());
	}

	public toJSON(): { status: number, statusText: string, errors: any[] } {
		return {
			status: 400,
			statusText: 'Bad Request',
			errors: this._flatten ? _.flatten(_.map(this._errors, 'messages')) : this._errors,
		};
	}

}