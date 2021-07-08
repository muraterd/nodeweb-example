export class LoginResult {
    status: LoginResult.LoginStatus;
    user: any;
}

export namespace LoginResult {
    export enum LoginStatus {
        Success,
        User_Not_Found,
        Wrong_Password,
        User_Not_Activated
    }
}