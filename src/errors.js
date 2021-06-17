// TODO: replace with eth-rpc-errors
export class ClientError extends Error {
  constructor(message, code = -32601) {
    super(message);
    this.code = code;
  }
}

export class ServerError extends Error {
  constructor(message, code = -32601) {
    super(message);
    this.code = code;
  }
}
