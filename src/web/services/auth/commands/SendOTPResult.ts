export class SendOTPResult {
  status: SendOTPResult.Status;
}

export namespace SendOTPResult {
  export enum Status {
    Success,
    Failed
  }
}
