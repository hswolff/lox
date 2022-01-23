import TokenType from './TokenType.ts';

export default class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public literal: string | number | undefined,
    public line: number
  ) {}

  toString() {
    return this.type + ' ' + this.lexeme + ' ' + this.literal;
  }
}
