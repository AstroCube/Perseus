export class ResponseError extends Error {

    public status: number;

    constructor(m: string, status?: number) {
        super(m);
        this.status = status ? status : 500;
        Object.setPrototypeOf(this, ResponseError.prototype);
    }

}
