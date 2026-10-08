import mml2ommlXslRaw from '../../assets/MML2OMML.xsl?raw';

/**
 * 微软官方 MML2OMML.XSL XSLT 转换引擎 (浏览器原生 XSLTProcessor)
 * 能够将标准 MathML 转换为 Microsoft Office 原生高保真 OMML
 */
export class XsltEngine {
  private static xsltProcessor: XSLTProcessor | null = null;
  private static isInitialized = false;
  private static initError: string | null = null;

  /**
   * 初始化并预编译 XSLT 样式表
   */
  public static init(): boolean {
    if (this.isInitialized) {
      return this.xsltProcessor !== null;
    }

    try {
      if (typeof window === 'undefined' || typeof XSLTProcessor === 'undefined') {
        this.initError = '当前运行环境不支持 XSLTProcessor';
        this.isInitialized = true;
        return false;
      }

      const parser = new DOMParser();
      const xslDoc = parser.parseFromString(mml2ommlXslRaw, 'text/xml');

      // 检查 XML 解析错误
      const parserError = xslDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('解析 MML2OMML.XSL 失败: ' + parserError.textContent);
      }

      const processor = new XSLTProcessor();
      processor.importStylesheet(xslDoc);
      this.xsltProcessor = processor;
      this.isInitialized = true;
      return true;
    } catch (e: any) {
      this.initError = e.message || String(e);
      this.isInitialized = true;
      console.warn('XSLTProcessor 初始化失败，将切换至纯 JS 转换备用引擎:', this.initError);
      return false;
    }
  }

  /**
   * 将 MathML 字符串转换为 OMML 字符串
   */
  public static transform(mathmlStr: string): string {
    if (!this.isInitialized) {
      this.init();
    }

    if (!this.xsltProcessor) {
      throw new Error(this.initError || 'XSLTProcessor 不可用');
    }

    let mathml = mathmlStr.trim();
    // 确保包含标准命名空间，以便 XSLT 的 xmlns:mml 能够精准匹配
    if (!mathml.includes('xmlns="http://www.w3.org/1998/Math/MathML"')) {
      mathml = mathml.replace(/<math([^>]*)>/, '<math xmlns="http://www.w3.org/1998/Math/MathML"$1>');
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(mathml, 'text/xml');

    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('MathML XML 解析错误: ' + parserError.textContent);
    }

    const transformedDoc = this.xsltProcessor.transformToDocument(xmlDoc);
    const serializer = new XMLSerializer();
    let omml = serializer.serializeToString(transformedDoc);

    // 清理与规范化 OMML 根标签与命名空间
    omml = this.normalizeOmmlOutput(omml);

    return omml;
  }

  /**
   * 规范化 OMML 输出格式，确保 Word 能够无缝兼容
   */
  private static normalizeOmmlOutput(omml: string): string {
    let result = omml.trim();

    // 移除 XML 声明 (<?xml ...?>)
    result = result.replace(/^<\?xml[^>]*\?>\s*/i, '');

    // 确保根标签拥有标准 Office Math 命名空间
    if (!result.includes('xmlns:m=')) {
      result = result.replace(
        /<m:oMath(\s|>)/,
        '<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"$1'
      );
    }

    return result;
  }

  /**
   * 检查当前环境是否支持 XSLTProcessor
   */
  public static isSupported(): boolean {
    if (!this.isInitialized) {
      this.init();
    }
    return this.xsltProcessor !== null;
  }
}
