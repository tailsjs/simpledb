export class DBError extends Error {
    constructor({ code, message }) {
      super(message);
  
      this.message = message;
      this.code = code;
    }
};
export class ParamError extends Error {
    constructor({ code, message }) {
      super(message);
  
      this.message = message;
      this.code = code;
    }
}
