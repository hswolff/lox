import { println, print, readLine } from './utils.ts';
import Scanner from './Scanner.ts';
import Token from './Token.ts';
import TokenType from './TokenType.ts';
import Parser from './Parser.ts';
import AstPrinter from './AstPrinter.ts';

export default class Lox {
  static hadError = false;

  static main(args = Deno.args) {
    if (args.length > 1) {
      println('Usage: dlox [script]');
      Deno.exit(64);
    } else if (args.length === 1) {
      Lox.runFile(args[0]);
    } else {
      Lox.runPrompt();
    }
  }

  private static async runFile(path: string) {
    const decoder = new TextDecoder('utf-8');
    const data = await Deno.readFile(await Deno.realPath(path));

    Lox.run(decoder.decode(data));

    if (Lox.hadError) {
      Deno.exit(65);
    }
  }

  private static async runPrompt() {
    for (;;) {
      print('> ');
      const line = await readLine();
      if (line == null) {
        break;
      }

      Lox.run(line);

      Lox.hadError = false;
    }
  }

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    const parser = new Parser(tokens);
    const expression = parser.parse();

    // Stop if there was a syntax error.
    if (Lox.hadError) return;

    println(new AstPrinter().print(expression));

    // for (const token of tokens) {
    //   println(token.toString());
    // }
  }

  public static error(lineOrToken: number | Token, message: string) {
    if (typeof lineOrToken === 'number') {
      const line = lineOrToken;
      Lox.report(line, '', message);
    } else {
      const token = lineOrToken;
      if (token.type == TokenType.EOF) {
        Lox.report(token.line, ' at end', message);
      } else {
        Lox.report(token.line, " at '" + token.lexeme + "'", message);
      }
    }
  }

  private static report(line: number, where: string, message: string) {
    println('[line ' + line + '] Error' + where + ': ' + message);
    Lox.hadError = true;
  }
}
