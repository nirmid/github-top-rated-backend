class CustomError extends Error {
  statusCode?: number;

  constructor(message: string, satusCode?: number) {
    super(message);
    this.statusCode = this.statusCode;
  }
}
export { CustomError };
