import type { ValidationResult, ValidationError } from '../types';

/**
 * LaTeX 公式语法校验与智能纠错建议
 */
export class LatexValidator {
  /**
   * 校验 LaTeX 语法的完整性与合法性
   */
  public static validate(latex: string): ValidationResult {
    const errors: ValidationError[] = [];

    if (!latex || !latex.trim()) {
      return { valid: true, errors: [] };
    }

    const trimmed = latex.trim();

    // 1. 括号配对校验 (大括号、中括号、小括号)
    this.checkBracketBalance(trimmed, errors);

    // 2. 环境配对校验 (\begin{env} 与 \end{env})
    this.checkEnvironmentBalance(trimmed, errors);

    // 3. 常见未完成命令检查 (例如末尾悬空的 \frac, ^, _)
    this.checkDanglingCommands(trimmed, errors);

    // 4. 字符上限提示
    if (trimmed.length > 2000) {
      errors.push({
        message: `公式字符数(${trimmed.length})超过建议上限(2000)，可能会影响Word渲染性能`,
        suggestion: '建议拆分为多个短公式或简化表达式'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 检查大括号与定界符配对
   */
  private static checkBracketBalance(str: string, errors: ValidationError[]): void {
    const stack: { char: string; index: number; line: number; col: number }[] = [];
    let line = 1;
    let col = 1;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const prevChar = i > 0 ? str[i - 1] : '';

      if (char === '\n') {
        line++;
        col = 1;
        continue;
      }

      // 如果是转义大括号 \{ 或 \}，跳过
      if (prevChar === '\\' && (char === '{' || char === '}')) {
        col++;
        continue;
      }

      if (char === '{') {
        stack.push({ char, index: i, line, col });
      } else if (char === '}') {
        if (stack.length === 0 || stack[stack.length - 1].char !== '{') {
          errors.push({
            message: `第 ${line} 行第 ${col} 列存在多余的闭合大括号 '}'`,
            line,
            column: col,
            suggestion: '请删除多余的右大括号，或在对应位置补齐左大括号 {'
          });
        } else {
          stack.pop();
        }
      }

      col++;
    }

    if (stack.length > 0) {
      const unclosed = stack[stack.length - 1];
      errors.push({
        message: `第 ${unclosed.line} 行第 ${unclosed.col} 列的左大括号 '{' 未闭合`,
        line: unclosed.line,
        column: unclosed.col,
        suggestion: `缺少 ${stack.length} 个闭合右大括号 '}'，请在公式末尾补全`
      });
    }
  }

  /**
   * 检查 \begin{...} 与 \end{...} 环境平衡
   */
  private static checkEnvironmentBalance(str: string, errors: ValidationError[]): void {
    const beginRegex = /\\begin\{([a-zA-Z*]+)\}/g;
    const endRegex = /\\end\{([a-zA-Z*]+)\}/g;

    const envStack: { name: string; index: number }[] = [];
    let match: RegExpExecArray | null;

    const events: { type: 'begin' | 'end'; name: string; index: number }[] = [];

    while ((match = beginRegex.exec(str)) !== null) {
      events.push({ type: 'begin', name: match[1], index: match.index });
    }
    while ((match = endRegex.exec(str)) !== null) {
      events.push({ type: 'end', name: match[1], index: match.index });
    }

    // 按字符位置排序
    events.sort((a, b) => a.index - b.index);

    for (const ev of events) {
      if (ev.type === 'begin') {
        envStack.push({ name: ev.name, index: ev.index });
      } else {
        if (envStack.length === 0) {
          errors.push({
            message: `出现未匹配的 \\end{${ev.name}}`,
            suggestion: `请检查是否有多余的 \\end{${ev.name}} 或缺少对应的 \\begin{${ev.name}}`
          });
        } else {
          const top = envStack[envStack.length - 1];
          if (top.name !== ev.name) {
            errors.push({
              message: `环境嵌套不匹配: \\begin{${top.name}} 却由 \\end{${ev.name}} 闭合`,
              suggestion: `请将 \\end{${ev.name}} 改为 \\end{${top.name}}`
            });
          }
          envStack.pop();
        }
      }
    }

    if (envStack.length > 0) {
      const unclosed = envStack.pop()!;
      errors.push({
        message: `环境 \\begin{${unclosed.name}} 未闭合`,
        suggestion: `请在公式末尾添加 \\end{${unclosed.name}}`
      });
    }
  }

  /**
   * 检查末尾悬空的运算符与命令
   */
  private static checkDanglingCommands(str: string, errors: ValidationError[]): void {
    const trimmed = str.trim();
    if (trimmed.endsWith('\\frac') || trimmed.endsWith('\\dfrac')) {
      errors.push({
        message: '分式命令 \\frac 缺少分子与分母参数',
        suggestion: '请添加分子分母，例如 \\frac{分子}{分母}'
      });
    } else if (trimmed.endsWith('^') || trimmed.endsWith('_')) {
      errors.push({
        message: '上标 (^) 或下标 (_) 缺少对应内容',
        suggestion: '请添加上下标内容，例如 x^2 或 a_{i}'
      });
    } else if (trimmed.endsWith('\\sqrt')) {
      errors.push({
        message: '根号命令 \\sqrt 缺少被开方数',
        suggestion: '请添加被开方数，例如 \\sqrt{x}'
      });
    }
  }
}
