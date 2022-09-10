export class TokenOutputDTO {
  token: string;
  expire: number;

  constructor(token: string, expire: number) {
    this.token = token;
    this.expire = expire;
  }
}
