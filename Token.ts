import TokenType from './TokenType.ts';

export default class Token {
  constructor(
    private type: TokenType,
    private lexeme: string,
    private literal: string | number | undefined,
    private line: number
  ) {}

  toString() {
    return this.type + ' ' + this.lexeme + ' ' + this.literal;
  }
}
