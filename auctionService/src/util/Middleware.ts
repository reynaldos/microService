import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

export default handler => middy(handler)
  .use([
    httpJsonBodyParser(), //automatically parse stringified event body
    httpEventNormalizer(), //automatically adjust api gateway eventhandler to reduce room for error
    httpErrorHandler() //provides clean error handling
  ]) ;
