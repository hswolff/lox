import { println } from '../utils.ts';

class GenerateAst {
  public static main(args = Deno.args) {
    if (args.length != 1) {
      println('Usage: generate_ast <output directory>');
      Deno.exit(64);
    }

    const outputDir = args[0];

    this.defineAst(outputDir, 'Expr', [
      'Binary   = public left: Expr, public operator: Token, public right: Expr',
      'Grouping = public expression: Expr',
      'Literal  = public value: any',
      'Unary    = public operator: Token, public right: Expr',
    ]);
  }

  private static defineAst(
    outputDir: string,
    baseName: string,
    types: string[]
  ) {
    const path = outputDir + '/' + baseName + '.ts';
    const encoder = new TextEncoder();

    let content = 'import Token from "./Token.ts";\n\n';
    content += `export abstract class ${baseName} {`;
    // The base accept() method.
    content += '\n  abstract accept<R>(visitor: Visitor<R>): R;';
    content += '\n}\n';

    content = this.defineVisitor(content, baseName, types);

    // The AST classes.
    for (const type of types) {
      const className = type.split('=')[0].trim();
      const fields = type.split('=')[1].trim();
      content = this.defineType(content, baseName, className, fields);
    }

    Deno.writeFile(path, encoder.encode(content));
  }

  private static defineVisitor(
    content: string,
    baseName: string,
    types: string[]
  ) {
    content += '\nexport interface Visitor<R> {';

    for (const type of types) {
      const typeName = type.split('=')[0].trim();
      content +=
        '\n  visit' +
        typeName +
        baseName +
        '(' +
        baseName.toLowerCase() +
        ': ' +
        typeName +
        '): R;';
    }

    content += '\n}\n';

    return content;
  }

  private static defineType(
    content: string,
    baseName: string,
    className: string,
    fieldList: string
  ) {
    content += '\nexport class ' + className + ' extends ' + baseName + ' {';

    // Constructor.
    content += '\n  constructor(' + fieldList + ') {';
    content += '\n    super();';
    content += '\n  }';

    content += `\n
  accept<R>(visitor: Visitor<R>) {
    return visitor.visit${className + baseName}(this);
  }`;

    content += '\n}\n';

    return content;
  }
}

GenerateAst.main();
