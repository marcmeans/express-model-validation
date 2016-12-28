declare module Express {
	export interface Request {
		_model: any; // tslint:disable-line:no-any
		_schema: any; // tslint:disable-line:no-any
	}
}