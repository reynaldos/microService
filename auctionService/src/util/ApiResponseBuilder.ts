import { APIGatewayProxyResult } from 'aws-lambda';


export const BuildApiGatewayResponseJSON = (
	statusCode: number,
	response: object
): APIGatewayProxyResult => {
	return {
		statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(response),
	};
};

export const BuildApiGatewayHTMLResponse = (
	statusCode: number,
	response: string
): APIGatewayProxyResult => {
	return {
		statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'text/html; charset=utf-8',
		},
		body: response,
	};
};