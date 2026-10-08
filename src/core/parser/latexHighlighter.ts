/**
 * LaTeX 语法高亮分词器
 * 用于在多行编辑框中为 LaTeX 关键字、环境、变量、符号添加专业代码着色
 */

export interface Token {
  type: 'command' | 'bracket' | 'operator' | 'number' | 'symbol' | 'comment' | 'text' | 'whitespace';
  value: string;
}

export class LatexHighlighter {
  /**
   * 将 LaTeX 源码切分为 Token 流
   */
  public static tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const len = code.length;

    while (i < len) {
      const char = code[i];

      // 1. 空白字符
      if (/\s/.test(char)) {
        let ws = '';
        while (i < len && /\s/.test(code[i])) {
          ws += code[i];
          i++;
        }
        tokens.push({ type: 'whitespace', value: ws });
        continue;
      }

      // 2. 注释 (% 开头到行尾)
      if (char === '%') {
        let comment = '';
        while (i < len && code[i] !== '\n') {
          comment += code[i];
          i++;
        }
        tokens.push({ type: 'comment', value: comment });
        continue;
      }

      // 3. LaTeX 命令 (\alpha, \frac, \begin 等)
      if (char === '\\') {
        let cmd = '\\';
        i++;
        if (i < len) {
          if (/[a-zA-Z]/.test(code[i])) {
            while (i < len && /[a-zA-Z]/.test(code[i])) {
              cmd += code[i];
              i++;
            }
          } else {
            // 特殊单字符命令 (如 \, \: \; \! \{ \} \\)
            cmd += code[i];
            i++;
          }
        }
        tokens.push({ type: 'command', value: cmd });
        continue;
      }

      // 4. 定界符与括号
      if (/[{}[\]()|]/.test(char)) {
        tokens.push({ type: 'bracket', value: char });
        i++;
        continue;
      }

      // 5. 运算符与数学符号
      if (/[+\-*/=<>^_\&~]/.test(char)) {
        tokens.push({ type: 'operator', value: char });
        i++;
        continue;
      }

      // 6. 数字
      if (/\d/.test(char)) {
        let num = '';
        while (i < len && /[\d.]/.test(code[i])) {
          num += code[i];
          i++;
        }
        tokens.push({ type: 'number', value: num });
        continue;
      }

      // 7. 普通字母与文本
      let text = '';
      while (
        i < len &&
        !/\s/.test(code[i]) &&
        code[i] !== '\\' &&
        code[i] !== '%' &&
        !/[{}[\]()|]/.test(code[i]) &&
        !/[+\-*/=<>^_\&~]/.test(code[i]) &&
        !/\d/.test(code[i])
      ) {
        text += code[i];
        i++;
      }
      if (text) {
        tokens.push({ type: 'text', value: text });
      }
    }

    return tokens;
  }

  /**
   * 将 Token 转换为带颜色类的 HTML 字符串
   */
  public static highlightToHtml(code: string): string {
    const tokens = this.tokenize(code);
    return tokens
      .map(t => {
        const escaped = this.escapeHtml(t.value);
        switch (t.type) {
          case 'command':
            return `<span class="text-blue-600 font-semibold">${escaped}</span>`;
          case 'bracket':
            return `<span class="text-amber-600 font-bold">${escaped}</span>`;
          case 'operator':
            return `<span class="text-purple-600 font-medium">${escaped}</span>`;
          case 'number':
            return `<span class="text-emerald-600">${escaped}</span>`;
          case 'comment':
            return `<span class="text-slate-400 italic">${escaped}</span>`;
          case 'whitespace':
            return escaped;
          default:
            return `<span class="text-slate-800">${escaped}</span>`;
        }
      })
      .join('');
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
