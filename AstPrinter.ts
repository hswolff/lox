import * as Expr from './Expr.ts';
import Token from './Token.ts';
import TokenType from './TokenType.ts';
import { println } from './utils.ts';

class AstPrinter implements Expr.Visitor<string> {
  static main() {
    const expression = new Expr.Binary(
      new Expr.Unary(
        new Token(TokenType.MINUS, '-', undefined, 1),
        new Expr.Literal(123)
      ),
      new Token(TokenType.STAR, '*', undefined, 1),
      new Expr.Grouping(new Expr.Literal(45.67))
    );

    println(new AstPrinter().print(expression));
  }

  print(expr: Expr.Expr) {
    return expr.accept(this);
  }

  public visitBinaryExpr(expr: Expr.Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  public visitGroupingExpr(expr: Expr.Grouping): string {
    return this.parenthesize('group', expr.expression);
  }

  public visitLiteralExpr(expr: Expr.Literal): string {
    if (expr.value == null) return 'nil';
    return expr.value.toString();
  }

  public visitUnaryExpr(expr: Expr.Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr.Expr[]): string {
    let content = `(${name}`;

    for (const expr of exprs) {
      content += ' ';
      content += expr.accept(this);
    }
    content += ')';

    return content;
  }
}

AstPrinter.main();
