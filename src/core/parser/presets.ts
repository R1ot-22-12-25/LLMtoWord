import type { FormulaPreset } from '../types';

export const FORMULA_PRESETS: FormulaPreset[] = [
  // 基础代数
  {
    id: 'p-quad',
    name: '一元二次方程求根公式',
    category: 'algebra',
    categoryName: '基础代数',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: '标准二次方程 ax^2 + bx + c = 0 的解析解'
  },
  {
    id: 'p-binomial',
    name: '二项式展开定理',
    category: 'algebra',
    categoryName: '基础代数',
    latex: '(x + y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k',
    description: '多项式正整数次幂的标准组合数求和'
  },
  {
    id: 'p-cubic-sum',
    name: '立方求和公式',
    category: 'algebra',
    categoryName: '基础代数',
    latex: '\\sum_{k=1}^n k^3 = \\left( \\frac{n(n+1)}{2} \\right)^2',
    description: '连续自然数立方和等于前n项和的平方'
  },
  {
    id: 'p-cfrac',
    name: '经典连分式',
    category: 'algebra',
    categoryName: '基础代数',
    latex: 'x = a_0 + \\cfrac{1}{a_1 + \\cfrac{1}{a_2 + \\cfrac{1}{a_3 + \\dots}}}',
    description: '多层连续分数表达形式'
  },

  // 高等微积分与特殊函数
  {
    id: 'p-hypergeo',
    name: '高斯超几何函数 (2F1)',
    category: 'calculus',
    categoryName: '高等微积分',
    latex: '{}_2F_1(a, b; c; z) = \\sum_{n=0}^{\\infty} \\frac{(a)_n (b)_n}{(c)_n} \\frac{z^n}{n!}',
    description: '包含级数展开、Pochhammer符号与分式乘积的标准超几何函数'
  },
  {
    id: 'p-gauss-int',
    name: '高斯概率积分',
    category: 'calculus',
    categoryName: '高等微积分',
    latex: '\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
    description: '正态分布与实分析核心积分'
  },
  {
    id: 'p-taylor',
    name: '泰勒展开式与拉格朗日余项',
    category: 'calculus',
    categoryName: '高等微积分',
    latex: 'f(x) = \\sum_{n=0}^N \\frac{f^{(n)}(a)}{n!} (x-a)^n + \\frac{f^{(N+1)}(\\xi)}{(N+1)!} (x-a)^{N+1}',
    description: '多项式局部逼近光滑函数'
  },
  {
    id: 'p-fourier',
    name: '傅里叶反变换公式',
    category: 'calculus',
    categoryName: '高等微积分',
    latex: 'f(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} F(\\omega) e^{i \\omega t} d\\omega',
    description: '连续信号的频域至时域逆变换'
  },
  {
    id: 'p-cauchy',
    name: '柯西高阶导数积分公式',
    category: 'calculus',
    categoryName: '高等微积分',
    latex: 'f^{(n)}(z_0) = \\frac{n!}{2\\pi i} \\oint_C \\frac{f(z)}{(z - z_0)^{n+1}} dz',
    description: '复变函数全纯性核心定理'
  },

  // 线性代数
  {
    id: 'p-rot-mat',
    name: '二维平面旋转矩阵',
    category: 'linear_algebra',
    categoryName: '线性代数',
    latex: 'R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}',
    description: '坐标系逆时针旋转变换矩阵'
  },
  {
    id: 'p-svd',
    name: '奇异值分解 (SVD)',
    category: 'linear_algebra',
    categoryName: '线性代数',
    latex: 'A = U \\Sigma V^T = \\sum_{i=1}^r \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T',
    description: '矩阵低秩近似与降维基石'
  },
  {
    id: 'p-det3',
    name: '3×3 矩阵行列式展开',
    category: 'linear_algebra',
    categoryName: '线性代数',
    latex: '\\det(A) = \\begin{vmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{vmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)',
    description: '三阶方阵行列式代数余子式计算'
  },

  // 现代物理
  {
    id: 'p-maxwell',
    name: '麦克斯韦电磁感应旋度方程',
    category: 'physics',
    categoryName: '现代物理',
    latex: '\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}',
    description: '法拉第电磁感应定律的微分形式'
  },
  {
    id: 'p-schrodinger',
    name: '薛定谔含时波动方程',
    category: 'physics',
    categoryName: '现代物理',
    latex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\left( -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}, t) \\right) \\Psi(\\mathbf{r}, t)',
    description: '量子力学微观状态演化基础偏微分方程'
  },
  {
    id: 'p-einstein',
    name: '爱因斯坦引力场方程',
    category: 'physics',
    categoryName: '现代物理',
    latex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
    description: '广义相对论时空弯曲与能量动量张量关系'
  },
  {
    id: 'p-navier-stokes',
    name: '纳维-斯托克斯流体动力方程',
    category: 'physics',
    categoryName: '现代物理',
    latex: '\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla) \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}',
    description: '不可压缩粘性牛顿流体动力守恒方程'
  },

  // 结构与复杂分段
  {
    id: 'p-cases',
    name: '三段式分段函数',
    category: 'structures',
    categoryName: '分段与环境',
    latex: 'f(x) = \\begin{cases} x^2 + 2x & x < 0 \\\\ 1 & x = 0 \\\\ \\frac{\\sin x}{x} & x > 0 \\end{cases}',
    description: '带条件的 cases 分段定义'
  },
  {
    id: 'p-aligned',
    name: '多步对齐代数推导',
    category: 'structures',
    categoryName: '分段与环境',
    latex: '\\begin{aligned} (a+b)^3 &= (a+b)(a^2 + 2ab + b^2) \\\\ &= a^3 + 2a^2b + ab^2 + a^2b + 2ab^2 + b^3 \\\\ &= a^3 + 3a^2b + 3ab^2 + b^3 \\end{aligned}',
    description: 'aligned 环境下的多行等号对齐'
  },

  // 概率与AI
  {
    id: 'p-attention',
    name: 'Transformer 缩放点积注意力',
    category: 'complex',
    categoryName: 'AI与概率',
    latex: '\\operatorname{Attention}(Q, K, V) = \\operatorname{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
    description: '大型语言模型核心自注意力机制公式'
  },
  {
    id: 'p-multivariate-normal',
    name: '多元高斯分布概率密度',
    category: 'complex',
    categoryName: 'AI与概率',
    latex: 'p(\\mathbf{x}) = \\frac{1}{\\sqrt{(2\\pi)^d |\\boldsymbol{\\Sigma}|}} \\exp\\left( -\\frac{1}{2} (\\mathbf{x} - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}) \\right)',
    description: '连续型多维随机向量正态联合分布'
  }
];
