import { BaseException } from "./BaseException";

export class ValidationException extends BaseException {
    constructor(public fieldName: string, public errorMessage: string) {
        super(errorMessage)
    }
}