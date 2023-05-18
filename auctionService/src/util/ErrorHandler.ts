

export class ErrorResponse {
  statusCode: number;
  body: string;
  headers: object

  constructor( message = 'An error occurred',statusCode = 500,) {
    const body = JSON.stringify({ message });
    
    this.statusCode = statusCode;
    this.body = body;
    this.headers = {
      'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json; charset=utf-8',
    };
  }

  
}


export function createError(_err : any ) : string{
  let err = _err;

  // if error not thrown by us
  if (!(err instanceof ErrorResponse)) {
    console.error(err);
    err = new ErrorResponse();
  }
  return JSON.stringify(err);
}