export class ResponseError extends Error {

    constructor(m: string, status?: number) {
        super(m);
        if (!status) status = 500;
        Object.setPrototypeOf(this, ResponseError.prototype);
    }

}
