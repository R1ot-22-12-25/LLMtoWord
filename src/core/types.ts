/**
 * 核心类型定义
 */

export interface ConversionResult {
  success: boolean;
  latex: string;
  cleanLatex: string;
  mathml: string;
  omml: string;
  wordHtml: string;
  durationMs: number;
  error?: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

export interface FormulaPreset {
  id: string;
  name: string;
  category: 'algebra' | 'calculus' | 'linear_algebra' | 'physics' | 'structures' | 'complex';
  categoryName: string;
  latex: string;
  description: string;
}

export interface ConversionMetrics {
  totalConversions: number;
  successfulConversions: number;
  failedConversions: number;
  averageDurationMs: number;
  lastDurationMs: number;
}

export interface ErrorReportData {
  latex: string;
  errorMessage: string;
  userAgent: string;
  timestamp: string;
  additionalInfo?: string;
}

export interface BenchmarkResult {
  symbolTestsTotal: number;
  symbolTestsPassed: number;
  complexTestsTotal: number;
  complexTestsPassed: number;
  totalTimeMs: number;
  accuracyRate: number;
  failures: { name: string; latex: string; reason: string }[];
}
