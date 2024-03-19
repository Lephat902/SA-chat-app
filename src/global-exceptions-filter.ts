import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpStatus,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof HttpException) {
            console.log('HTTP EXCEPTION', exception);
            const responseObj: any = exception.getResponse();
            // Check if the message field is a string and convert it to an array
            if (responseObj instanceof Object && typeof responseObj.message === 'string') {
                responseObj.message = [responseObj.message];
            }
            response.status(exception.getStatus()).json(responseObj);
            return;
        }

        const DEFAULT_ERROR_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;
        try {
            if (exception.error?.statusCode !== undefined) {
                response.status(exception.error.statusCode).json(exception.error.message);
                console.log('CAN BE CATEGORIZED AS HTTP EXCEPTION');
            } else {
                console.log(exception);
                console.log('UNABLE TO HANDLE THIS ERROR');
                response.status(DEFAULT_ERROR_STATUS).json(JSON.stringify(exception));
            }
        } catch (e) {
            console.log(exception);
            throw new InternalServerErrorException(JSON.stringify(exception));
        }
    }
}