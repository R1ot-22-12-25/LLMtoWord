/**
 * 视觉公式识别服务接口与数据结构
 * 专为集成千问视觉模型 (Qwen-VL / Qwen2.5-VL) 设计
 */

export type VisionInput = File | Blob | string;

export interface VisionOptions {
  apiKey?: string;
  model?: 'qwen-vl-plus' | 'qwen-vl-max' | 'qwen2.5-vl-72b-instruct' | string;
  baseUrl?: string;
  prompt?: string;
  timeoutMs?: number;
}

export interface VisionRecognitionResult {
  success: boolean;
  latex: string;
  confidence?: number;
  durationMs: number;
  modelUsed?: string;
  rawResponse?: any;
  error?: string;
}

export interface IQwenVisionService {
  /**
   * 识别图片中的数学公式并输出 LaTeX 代码
   */
  recognizeFormula(input: VisionInput, options?: VisionOptions): Promise<VisionRecognitionResult>;

  /**
   * 检查服务是否已配置并可用
   */
  isConfigured(): boolean;

  /**
   * 验证图片有效性 (大小、格式限制)
   */
  validateImage(file: File): { valid: boolean; error?: string };
}
