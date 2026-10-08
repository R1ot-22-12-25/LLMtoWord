import type { IQwenVisionService, VisionInput, VisionOptions, VisionRecognitionResult } from './types';

/**
 * 本地轻量化 OCR Sidecar 服务适配器
 * 连接本地 Python 后端服务 (LaTeX-OCR pix2tex / UniMERNet)
 * 默认端点: http://127.0.0.1:8000/api/ocr
 */
export class LocalVisionService implements IQwenVisionService {
  private defaultEndpoint = 'http://127.0.0.1:8000/api/ocr';
  private isOnline = false;

  public getEndpoint(): string {
    return localStorage.getItem('LLMTOWORD_LOCAL_OCR_ENDPOINT') || this.defaultEndpoint;
  }

  public setEndpoint(url: string): void {
    localStorage.setItem('LLMTOWORD_LOCAL_OCR_ENDPOINT', url.trim());
  }

  public isConfigured(): boolean {
    return this.isOnline;
  }

  public validateImage(file: File): { valid: boolean; error?: string } {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: '仅支持图片文件格式 (PNG, JPEG, WebP)' };
    }
    if (file.size > 20 * 1024 * 1024) {
      return { valid: false, error: '图片大小不能超过 20MB' };
    }
    return { valid: true };
  }

  /**
   * 探测本地 Sidecar 服务健康状况
   */
  public async checkHealth(): Promise<{ online: boolean; model?: string; error?: string }> {
    try {
      const endpoint = this.getEndpoint();
      const base = endpoint.replace(/\/api\/ocr\/?$/, '');
      const healthUrl = `${base}/api/health`;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1800);

      const resp = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timer);

      if (resp.ok) {
        const data = await resp.json();
        this.isOnline = true;
        return { online: true, model: data.model || 'LaTeX-OCR (pix2tex)' };
      }
      this.isOnline = false;
      return { online: false, error: `状态码 ${resp.status}` };
    } catch (err: any) {
      this.isOnline = false;
      return { online: false, error: err.message || '未连接到本地服务' };
    }
  }

  /**
   * 调用本地服务进行公式识别
   */
  public async recognizeFormula(input: VisionInput, options?: VisionOptions): Promise<VisionRecognitionResult> {
    const startTime = performance.now();
    const endpoint = options?.baseUrl || this.getEndpoint();

    try {
      const formData = new FormData();
      if (input instanceof File) {
        formData.append('file', input, input.name);
      } else if (input instanceof Blob) {
        formData.append('file', input, 'formula.png');
      } else if (typeof input === 'string') {
        // base64 to blob
        const res = await fetch(input);
        const blob = await res.blob();
        formData.append('file', blob, 'formula.png');
      }

      const controller = new AbortController();
      const timeoutMs = options?.timeoutMs || 10000;
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          latex: '',
          durationMs: Math.round(performance.now() - startTime),
          error: `本地服务响应异常 (${response.status}): ${errorText}`
        };
      }

      const result = await response.json();
      return {
        success: result.success,
        latex: result.latex || '',
        durationMs: Math.round(performance.now() - startTime),
        modelUsed: result.model || 'LaTeX-OCR (pix2tex)',
        error: result.error
      };
    } catch (err: any) {
      return {
        success: false,
        latex: '',
        durationMs: Math.round(performance.now() - startTime),
        error: `连接本地 OCR 服务失败: ${err.message || '请确认后端 app.py 服务是否已在 127.0.0.1:8000 启动'}`
      };
    }
  }
}
