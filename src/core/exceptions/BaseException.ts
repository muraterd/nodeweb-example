export class BaseException extends Error {
    constructor(public message: string, public innerException?: Error) {
        super(message)
    }
}