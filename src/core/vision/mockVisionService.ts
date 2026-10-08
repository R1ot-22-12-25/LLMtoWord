import type { IQwenVisionService, VisionInput, VisionOptions, VisionRecognitionResult } from './types';

/**
 * 视觉识别模拟服务 (Mock Qwen-VL)
 * 用于当前功能演示与开发调试，模拟真实的异步 OCR 识别过程
 */
export class MockVisionService implements IQwenVisionService {
  private sampleFormulas = [
    {
      label: '高斯超几何函数 (2F1)',
      latex: '{}_2F_1(a, b; c; z) = \\sum_{n=0}^{\\infty} \\frac{(a)_n (b)_n}{(c)_n} \\frac{z^n}{n!}'
    },
    {
      label: '一元二次方程求根公式',
      latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
    },
    {
      label: '高斯积分',
      latex: '\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}'
    },
    {
      label: '麦克斯韦电磁旋度方程',
      latex: '\\nabla \\times \\vec{\\mathbf{E}} = -\\frac{\\partial \\vec{\\mathbf{B}}}{\\partial t}'
    },
    {
      label: '薛定谔波动方程',
      latex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\left( -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}, t) \\right) \\Psi(\\mathbf{r}, t)'
    },
    {
      label: '欧拉恒等式',
      latex: 'e^{i\\pi} + 1 = 0'
    }
  ];

  public isConfigured(): boolean {
    return true;
  }

  public validateImage(file: File): { valid: boolean; error?: string } {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: '仅支持上传图片文件 (PNG, JPG, WebP 等)' };
    }
    return { valid: true };
  }

  public async recognizeFormula(_input: VisionInput, _options?: VisionOptions): Promise<VisionRecognitionResult> {
    const startTime = performance.now();

    // 模拟 800ms 网络与模型推理耗时
    await new Promise(resolve => setTimeout(resolve, 800));

    // 随机或者轮询返回一个逼真的数学公式
    const chosen = this.sampleFormulas[Math.floor(Math.random() * this.sampleFormulas.length)];

    return {
      success: true,
      latex: chosen.latex,
      confidence: 0.99,
      durationMs: Math.round(performance.now() - startTime),
      modelUsed: 'mock-qwen2.5-vl-demo'
    };
  }
}
