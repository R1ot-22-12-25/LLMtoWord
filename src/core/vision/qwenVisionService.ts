import type { IQwenVisionService, VisionInput, VisionOptions, VisionRecognitionResult } from './types';

/**
 * 阿里千问 Qwen-VL 视觉数学公式识别服务实现
 * 基于 DashScope / OpenAI 兼容接口，提供高精度的图片公式 OCR 转换为 LaTeX
 */
export class QwenVisionService implements IQwenVisionService {
  private defaultModel = 'qwen2.5-vl-72b-instruct';
  private defaultBaseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  private defaultPrompt =
    '请将图片中的数学公式准确识别并转换为标准的 LaTeX 格式代码。仅输出 LaTeX 代码本身，不要包含任何 markdown 代码块标记 (如 ```latex)，不要包含任何寒暄或多余文字。若为行间公式无需添加 $$ 包裹。';

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return !!key && key.trim().length > 0;
  }

  public getApiKey(): string {
    return localStorage.getItem('LLMTOWORD_QWEN_API_KEY') || '';
  }

  public setApiKey(key: string): void {
    localStorage.setItem('LLMTOWORD_QWEN_API_KEY', key.trim());
  }

  public validateImage(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: '不支持的文件格式，仅支持 PNG、JPEG、WebP 格式图片' };
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: '图片文件大小不能超过 10MB' };
    }
    return { valid: true };
  }

  /**
   * 将图片输入转换为 Base64 Data URL
   */
  private async toDataUrl(input: VisionInput): Promise<string> {
    if (typeof input === 'string') {
      return input;
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('图片文件读取失败'));
      reader.readAsDataURL(input);
    });
  }

  /**
   * 调用 Qwen-VL API 执行公式图像识别
   */
  public async recognizeFormula(input: VisionInput, options?: VisionOptions): Promise<VisionRecognitionResult> {
    const startTime = performance.now();
    const apiKey = options?.apiKey || this.getApiKey();
    const model = options?.model || this.defaultModel;
    const baseUrl = (options?.baseUrl || this.defaultBaseUrl).replace(/\/+$/, '');
    const prompt = options?.prompt || this.defaultPrompt;
    const timeoutMs = options?.timeoutMs || 15000;

    if (!apiKey) {
      return {
        success: false,
        latex: '',
        durationMs: Math.round(performance.now() - startTime),
        error: '未配置 Qwen 视觉模型 API Key。请在设置中配置 DashScope API Key，或使用 Mock 模拟识别体验。'
      };
    }

    try {
      const imageDataUrl = await this.toDataUrl(input);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const requestBody = {
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: imageDataUrl }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 1024
      };

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Qwen API 请求失败，状态码: ${response.status}`);
      }

      const json = await response.json();
      let rawText = json.choices?.[0]?.message?.content || '';

      // 清理可能误返回的 markdown 代码块包裹
      rawText = rawText.replace(/```(?:latex|math|tex)?/gi, '').replace(/```/g, '').trim();

      return {
        success: true,
        latex: rawText,
        confidence: 0.98,
        durationMs: Math.round(performance.now() - startTime),
        modelUsed: model,
        rawResponse: json
      };
    } catch (err: any) {
      return {
        success: false,
        latex: '',
        durationMs: Math.round(performance.now() - startTime),
        error: err.name === 'AbortError' ? 'Qwen-VL 图片识别请求超时 (超过15秒)' : (err.message || '图片识别网络错误')
      };
    }
  }
}
