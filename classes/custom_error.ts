
class CustomError extends Error {
        satusCode?: number;

    constructor(message: string, satusCode?: number) {
        super(message);
        this.satusCode = this.satusCode
    }
}
export { CustomError };