export class User {
  constructor(private email: string, private token: string, private localId: string, private expirationdate: Date){}

  get expireDate(): any {
    return this.expirationdate;
  }

  get userToken(): any {
    //can check expiration date and then get refresh token here.
    return this.token;
  }
}
