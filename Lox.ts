import Scanner from './Scanner.ts';

function print(msg: string) {
  return Deno.stdout.writeSync(new TextEncoder().encode(msg));
}

function println(msg: string) {
  return print(msg + '\n');
}

async function readLine() {
  const buf = new Uint8Array(1024);
  const n = await Deno.stdin.read(buf);
  if (n == null) {
    return n;
  }
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

export default class Lox {
  static hadError = false;

  static main(args = Deno.args) {
    if (args.length > 1) {
      println('Usage: jlox [script]');
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

    for (const token of tokens) {
      println(token.toString());
    }
  }

  public static error(line: number, message: string) {
    Lox.report(line, '', message);
  }

  private static report(line: number, where: string, message: string) {
    println('[line ' + line + '] Error' + where + ': ' + message);
    Lox.hadError = true;
  }
}
