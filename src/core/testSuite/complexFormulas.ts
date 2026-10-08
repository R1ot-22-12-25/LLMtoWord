/**
 * 105+ 复杂公式结构测试用例定义
 * 涵盖多层嵌套分式、多重根号、多元微积分、多维矩阵、分段函数、物理学宏大方程组、超长复合公式等
 */

export interface ComplexTestCase {
  id: string;
  name: string;
  latex: string;
  category: string;
  expectedMinOmmlLength?: number;
}

export const COMPLEX_FORMULAS_TEST_CASES: ComplexTestCase[] = [
  // 1. 分式与多层连分式 (12例)
  {
    id: 'comp-001',
    name: '一元二次方程求根公式',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    category: '代数与分式'
  },
  {
    id: 'comp-002',
    name: '二阶多项式分式',
    latex: '\\frac{a x^2 + b x + c}{d x^2 + e x + f} = K',
    category: '代数与分式'
  },
  {
    id: 'comp-003',
    name: '三层嵌套连分式',
    latex: 'x = 1 + \\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + x}}}',
    category: '代数与分式'
  },
  {
    id: 'comp-004',
    name: '高阶繁分式 (cfrac)',
    latex: 'a_0 + \\cfrac{b_1}{a_1 + \\cfrac{b_2}{a_2 + \\cfrac{b_3}{a_3 + \\dots}}}',
    category: '代数与分式'
  },
  {
    id: 'comp-005',
    name: '双曲正切分式展开',
    latex: '\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}} = \\frac{e^{2x} - 1}{e^{2x} + 1}',
    category: '代数与分式'
  },
  {
    id: 'comp-006',
    name: '柯西中值定理比值式',
    latex: '\\frac{f(b) - f(a)}{g(b) - g(a)} = \\frac{f\'(\\xi)}{g\'(\\xi)}',
    category: '代数与分式'
  },
  {
    id: 'comp-007',
    name: '调和平均数公式',
    latex: 'H = \\frac{n}{\\sum_{i=1}^n \\frac{1}{x_i}} = \\frac{n}{\\frac{1}{x_1} + \\frac{1}{x_2} + \\dots + \\frac{1}{x_n}}',
    category: '代数与分式'
  },
  {
    id: 'comp-008',
    name: '复数极坐标分式商',
    latex: '\\frac{r_1(\\cos\\theta_1 + i\\sin\\theta_1)}{r_2(\\cos\\theta_2 + i\\sin\\theta_2)} = \\frac{r_1}{r_2}(\\cos(\\theta_1-\\theta_2) + i\\sin(\\theta_1-\\theta_2))',
    category: '代数与分式'
  },
  {
    id: 'comp-009',
    name: '偏微分链式法则分式',
    latex: '\\frac{\\partial z}{\\partial u} = \\frac{\\partial z}{\\partial x}\\frac{\\partial x}{\\partial u} + \\frac{\\partial z}{\\partial y}\\frac{\\partial y}{\\partial u}',
    category: '代数与分式'
  },
  {
    id: 'comp-010',
    name: '微商有限差分近似',
    latex: 'f\'(x) \\approx \\frac{f(x+h) - f(x-h)}{2h} - \\frac{h^2}{6} f^{(3)}(\\xi)',
    category: '代数与分式'
  },
  {
    id: 'comp-011',
    name: '拉普拉斯变换核分式',
    latex: '\\mathcal{L}\\{\\sin(\\omega t)\\} = \\frac{\\omega}{s^2 + \\omega^2}',
    category: '代数与分式'
  },
  {
    id: 'comp-012',
    name: '有理函数部分分式展开',
    latex: '\\frac{P(x)}{(x-a)(x^2+bx+c)} = \\frac{A}{x-a} + \\frac{Bx + C}{x^2+bx+c}',
    category: '代数与分式'
  },

  // 2. 根号与多层嵌套方根 (10例)
  {
    id: 'comp-013',
    name: '欧几里得空间距离公式',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}',
    category: '根号与几何'
  },
  {
    id: 'comp-014',
    name: '三层嵌套根号',
    latex: 'y = \\sqrt{1 + \\sqrt{2 + \\sqrt{3 + \\sqrt{x}}}}',
    category: '根号与几何'
  },
  {
    id: 'comp-015',
    name: 'n次开放带分数',
    latex: '\\sqrt[n]{\\frac{a^2 + b^2}{c^2 + d^2}} = \\left(\\frac{a^2 + b^2}{c^2 + d^2}\\right)^{\\frac{1}{n}}',
    category: '根号与几何'
  },
  {
    id: 'comp-016',
    name: '卡尔达诺三次方程实根式',
    latex: 'x = \\sqrt[3]{-\\frac{q}{2} + \\sqrt{\\frac{q^2}{4} + \\frac{p^3}{27}}} + \\sqrt[3]{-\\frac{q}{2} - \\sqrt{\\frac{q^2}{4} + \\frac{p^3}{27}}}',
    category: '根号与几何'
  },
  {
    id: 'comp-017',
    name: '海伦三角形面积公式',
    latex: 'S = \\sqrt{s(s-a)(s-b)(s-c)}, \\quad s = \\frac{a+b+c}{2}',
    category: '根号与几何'
  },
  {
    id: 'comp-018',
    name: '狭义相对论洛伦兹因子',
    latex: '\\gamma = \\frac{1}{\\sqrt{1 - \\frac{v^2}{c^2}}} = \\frac{1}{\\sqrt{1 - \\beta^2}}',
    category: '根号与几何'
  },
  {
    id: 'comp-019',
    name: '连续黄金分割根式表示',
    latex: '\\phi = \\sqrt{1 + \\sqrt{1 + \\sqrt{1 + \\sqrt{1 + \\dots}}}} = \\frac{1 + \\sqrt{5}}{2}',
    category: '根号与几何'
  },
  {
    id: 'comp-020',
    name: '多维超球面方程半径',
    latex: 'R = \\sqrt{\\sum_{k=1}^m (x_k - c_k)^2}',
    category: '根号与几何'
  },
  {
    id: 'comp-021',
    name: '复合根号乘除式',
    latex: '\\sqrt{a \\sqrt{b \\sqrt{c}}} = a^{\\frac{1}{2}} b^{\\frac{1}{4}} c^{\\frac{1}{8}}',
    category: '根号与几何'
  },
  {
    id: 'comp-022',
    name: '四次方程预解式根',
    latex: 'z = \\frac{1}{2} \\sqrt{u_1} + \\frac{1}{2} \\sqrt{u_2} + \\frac{1}{2} \\sqrt{u_3}',
    category: '根号与几何'
  },

  // 3. 微积分、级数、极限与变上限积分 (18例)
  {
    id: 'comp-023',
    name: '高斯正态分布积分',
    latex: '\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
    category: '高等微积分'
  },
  {
    id: 'comp-024',
    name: '格林公式闭合曲线积分',
    latex: '\\oint_{C} (P\\,dx + Q\\,dy) = \\iint_{D} \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dx\\,dy',
    category: '高等微积分'
  },
  {
    id: 'comp-025',
    name: '斯托克斯定理',
    latex: '\\oint_{\\partial \\Sigma} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_{\\Sigma} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}',
    category: '高等微积分'
  },
  {
    id: 'comp-026',
    name: '高斯散度定理',
    latex: '\\iiint_V (\\nabla \\cdot \\mathbf{F}) \\, dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S}',
    category: '高等微积分'
  },
  {
    id: 'comp-027',
    name: '泰勒多项式与拉格朗日余项',
    latex: 'f(x) = \\sum_{n=0}^{N} \\frac{f^{(n)}(a)}{n!} (x-a)^n + \\frac{f^{(N+1)}(\\xi)}{(N+1)!} (x-a)^{N+1}',
    category: '高等微积分'
  },
  {
    id: 'comp-028',
    name: '连续和求立方和定理',
    latex: '\\sum_{k=1}^n k^3 = \\left( \\frac{n(n+1)}{2} \\right)^2 = \\left( \\sum_{k=1}^n k \\right)^2',
    category: '高等微积分'
  },
  {
    id: 'comp-029',
    name: '伽马函数积分定义与性质',
    latex: '\\Gamma(z) = \\int_0^\\infty t^{z-1} e^{-t} dt, \\quad \\Gamma(z+1) = z\\Gamma(z)',
    category: '高等微积分'
  },
  {
    id: 'comp-030',
    name: '黎曼Zeta函数欧拉乘积公式',
    latex: '\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s} = \\prod_{p \\text{ 为素数}} \\frac{1}{1 - p^{-s}}',
    category: '高等微积分'
  },
  {
    id: 'comp-031',
    name: '傅里叶正反变换对',
    latex: '\\hat{f}(\\xi) = \\int_{-\\infty}^\\infty f(x) e^{-2\\pi i x \\xi} dx, \\quad f(x) = \\int_{-\\infty}^\\infty \\hat{f}(\\xi) e^{2\\pi i x \\xi} d\\xi',
    category: '高等微积分'
  },
  {
    id: 'comp-032',
    name: '留数定理积分',
    latex: '\\oint_{\\gamma} f(z) dz = 2\\pi i \\sum_{k=1}^n \\operatorname{Res}(f, a_k)',
    category: '高等微积分'
  },
  {
    id: 'comp-033',
    name: '柯西积分公式',
    latex: 'f^{(n)}(z_0) = \\frac{n!}{2\\pi i} \\oint_{C} \\frac{f(z)}{(z - z_0)^{n+1}} dz',
    category: '高等微积分'
  },
  {
    id: 'comp-034',
    name: '变上限积分求导公式',
    latex: '\\frac{d}{dx} \\left( \\int_{\\alpha(x)}^{\\beta(x)} f(t) dt \\right) = f(\\beta(x))\\beta\'(x) - f(\\alpha(x))\\alpha\'(x)',
    category: '高等微积分'
  },
  {
    id: 'comp-035',
    name: '双重无穷级数求和',
    latex: 'S = \\sum_{m=1}^\\infty \\sum_{n=1}^\\infty \\frac{1}{m^2 n^2 (m+n)}',
    category: '高等微积分'
  },
  {
    id: 'comp-036',
    name: '欧拉-麦克劳林求和公式',
    latex: '\\sum_{k=a}^b f(k) = \\int_a^b f(x) dx + \\frac{f(a)+f(b)}{2} + \\sum_{k=1}^m \\frac{B_{2k}}{(2k)!} (f^{(2k-1)}(b) - f^{(2k-1)}(a))',
    category: '高等微积分'
  },
  {
    id: 'comp-037',
    name: '斯特林阶乘渐近展开公式',
    latex: 'n! \\sim \\sqrt{2\\pi n} \\left( \\frac{n}{e} \\right)^n \\left( 1 + \\frac{1}{12n} + \\frac{1}{288n^2} \\right)',
    category: '高等微积分'
  },
  {
    id: 'comp-038',
    name: '两重要极限之一',
    latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to \\infty} \\left( 1 + \\frac{1}{x} \\right)^x = e',
    category: '高等微积分'
  },
  {
    id: 'comp-039',
    name: '洛必达法则不定式极限',
    latex: '\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f\'(x)}{g\'(x)} = L',
    category: '高等微积分'
  },
  {
    id: 'comp-040',
    name: '狄利克雷积分',
    latex: '\\int_0^\\infty \\frac{\\sin(\\omega t)}{t} dt = \\frac{\\pi}{2} \\operatorname{sgn}(\\omega)',
    category: '高等微积分'
  },

  // 4. 矩阵与线性代数 (20例)
  {
    id: 'comp-041',
    name: '2x2 平面旋转矩阵',
    latex: 'R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-042',
    name: '3x3 对称方阵行列式',
    latex: '\\det(A) = \\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-043',
    name: '矩阵乘法定义式 (bmatrix)',
    latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} ax + by \\\\ cx + dy \\end{bmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-044',
    name: '4x4 伴随矩阵 (Bmatrix)',
    latex: 'A^* = \\begin{Bmatrix} M_{11} & -M_{21} & M_{31} \\\\ -M_{12} & M_{22} & -M_{32} \\\\ M_{13} & -M_{23} & M_{33} \\end{Bmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-045',
    name: '分块对角矩阵',
    latex: 'M = \\begin{pmatrix} A & 0 \\\\ 0 & B \\end{pmatrix}, \\quad M^{-1} = \\begin{pmatrix} A^{-1} & 0 \\\\ 0 & B^{-1} \\end{pmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-046',
    name: '特征值与特征向量方程',
    latex: 'A \\mathbf{v} = \\lambda \\mathbf{v} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-047',
    name: '奇异值分解 (SVD)',
    latex: 'A = U \\Sigma V^T = \\sum_{i=1}^r \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T',
    category: '矩阵与线代'
  },
  {
    id: 'comp-048',
    name: '泡利矩阵列',
    latex: '\\sigma_x = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\; \\sigma_y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, \\; \\sigma_z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-049',
    name: '克莱姆法则解线性方程组',
    latex: 'x_i = \\frac{\\det(A_i)}{\\det(A)} = \\frac{|A_i|}{|A|}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-050',
    name: '投影算子矩阵外积',
    latex: 'P = \\mathbf{u}\\mathbf{u}^T = \\begin{pmatrix} u_1 \\\\ u_2 \\\\ u_3 \\end{pmatrix} \\begin{pmatrix} u_1 & u_2 & u_3 \\end{pmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-051',
    name: '雅可比矩阵 (Jacobian)',
    latex: 'J_F = \\begin{bmatrix} \\frac{\\partial f_1}{\\partial x_1} & \\cdots & \\frac{\\partial f_1}{\\partial x_n} \\\\ \\vdots & \\ddots & \\vdots \\\\ \\frac{\\partial f_m}{\\partial x_1} & \\cdots & \\frac{\\partial f_m}{\\partial x_n} \\end{bmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-052',
    name: '海森矩阵 (Hessian)',
    latex: 'H(f) = \\begin{pmatrix} \\frac{\\partial^2 f}{\\partial x_1^2} & \\frac{\\partial^2 f}{\\partial x_1 \\partial x_2} \\\\ \\frac{\\partial^2 f}{\\partial x_2 \\partial x_1} & \\frac{\\partial^2 f}{\\partial x_2^2} \\end{pmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-053',
    name: '相似对角化公式',
    latex: 'P^{-1} A P = \\Lambda = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\dots, \\lambda_n)',
    category: '矩阵与线代'
  },
  {
    id: 'comp-054',
    name: '三维叉积行列式表达',
    latex: '\\mathbf{u} \\times \\mathbf{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-055',
    name: '正交酉矩阵共轭转置',
    latex: 'U^{\\dagger} U = U U^{\\dagger} = I, \\quad \\langle U\\mathbf{x}, U\\mathbf{y} \\rangle = \\langle \\mathbf{x}, \\mathbf{y} \\rangle',
    category: '矩阵与线代'
  },
  {
    id: 'comp-056',
    name: '2x2 逆矩阵显式求法',
    latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-057',
    name: '正定二次型二次项展开',
    latex: 'Q(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} = \\sum_{i=1}^n \\sum_{j=1}^n a_{ij} x_i x_j > 0',
    category: '矩阵与线代'
  },
  {
    id: 'comp-058',
    name: '矩阵范数弗罗贝尼乌斯范数',
    latex: '\\|A\\|_F = \\sqrt{\\sum_{i=1}^m \\sum_{j=1}^n |a_{ij}|^2} = \\sqrt{\\operatorname{tr}(A^T A)}',
    category: '矩阵与线代'
  },
  {
    id: 'comp-059',
    name: '范德蒙行列式',
    latex: 'V = \\begin{vmatrix} 1 & x_1 & x_1^2 \\\\ 1 & x_2 & x_2^2 \\\\ 1 & x_3 & x_3^2 \\end{vmatrix} = (x_2 - x_1)(x_3 - x_1)(x_3 - x_2)',
    category: '矩阵与线代'
  },
  {
    id: 'comp-060',
    name: '若尔当标准型块矩阵',
    latex: 'J_k(\\lambda) = \\begin{pmatrix} \\lambda & 1 & 0 \\\\ 0 & \\lambda & 1 \\\\ 0 & 0 & \\lambda \\end{pmatrix}',
    category: '矩阵与线代'
  },

  // 5. 分段函数与方程组 (cases, aligned) (15例)
  {
    id: 'comp-061',
    name: '绝对值分段函数',
    latex: '|x| = \\begin{cases} x & \\text{若 } x \\ge 0 \\\\ -x & \\text{若 } x < 0 \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-062',
    name: '三段式符号函数 (sgn)',
    latex: '\\operatorname{sgn}(x) = \\begin{cases} 1 & x > 0 \\\\ 0 & x = 0 \\\\ -1 & x < 0 \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-063',
    name: '狄利克雷病态函数',
    latex: 'D(x) = \\begin{cases} 1 & x \\in \\mathbb{Q} \\\\ 0 & x \\in \\mathbb{R} \\setminus \\mathbb{Q} \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-064',
    name: '单位阶跃函数 (Heaviside)',
    latex: 'H(t) = \\begin{cases} 0 & t < 0 \\\\ \\frac{1}{2} & t = 0 \\\\ 1 & t > 0 \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-065',
    name: '三元一次方程组 (cases)',
    latex: '\\begin{cases} 2x + 3y - z = 1 \\\\ 4x - y + 2z = -3 \\\\ -x + 2y + 3z = 7 \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-066',
    name: '对齐多步推导 (aligned)',
    latex: '\\begin{aligned} (a+b)^3 &= (a+b)(a+b)^2 \\\\ &= (a+b)(a^2 + 2ab + b^2) \\\\ &= a^3 + 3a^2b + 3ab^2 + b^3 \\end{aligned}',
    category: '分段与方程组'
  },
  {
    id: 'comp-067',
    name: '斐波那契数列递归定义',
    latex: 'F_n = \\begin{cases} 0 & n = 0 \\\\ 1 & n = 1 \\\\ F_{n-1} + F_{n-2} & n \\ge 2 \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-068',
    name: '带复杂积分的分段势能',
    latex: 'V(r) = \\begin{cases} -V_0 & r \\le a \\\\ 0 & r > a \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-069',
    name: '双条件收敛域判定',
    latex: 'f(z) = \\begin{cases} \\sum_{n=0}^\\infty a_n z^n & |z| < R \\\\ \\infty & |z| \\ge R \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-070',
    name: '洛伦茨吸引子微分动力系统',
    latex: '\\begin{cases} \\frac{dx}{dt} = \\sigma (y - x) \\\\ \\frac{dy}{dt} = x(\\rho - z) - y \\\\ \\frac{dz}{dt} = xy - \\beta z \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-071',
    name: '支持向量机对偶优化约束',
    latex: '\\begin{cases} \\min_{\\mathbf{w}, b} \\frac{1}{2} \\|\\mathbf{w}\\|^2 + C \\sum_{i=1}^n \\xi_i \\\\ \\text{s.t. } y_i(\\mathbf{w}^T \\mathbf{x}_i + b) \\ge 1 - \\xi_i \\\\ \\xi_i \\ge 0 \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-072',
    name: '四段式样条插值函数',
    latex: 'S_i(x) = a_i + b_i(x - x_i) + c_i(x - x_i)^2 + d_i(x - x_i)^3',
    category: '分段与方程组'
  },
  {
    id: 'comp-073',
    name: '柯西-黎曼偏微分方程组',
    latex: '\\begin{cases} \\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y} \\\\ \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x} \\end{cases}',
    category: '分段与方程组'
  },
  {
    id: 'comp-074',
    name: '多元逻辑回归似然函数',
    latex: 'L(\\theta) = \\prod_{i=1}^m (h_\\theta(x^{(i)}))^{y^{(i)}} (1 - h_\\theta(x^{(i)}))^{1 - y^{(i)}}',
    category: '分段与方程组'
  },
  {
    id: 'comp-075',
    name: '动态规划贝尔曼最优化方程',
    latex: 'V^*(s) = \\max_{a} \\left\\{ R(s, a) + \\gamma \\sum_{s\'} P(s\' | s, a) V^*(s\') \\right\\}',
    category: '分段与方程组'
  },

  // 6. 现代物理学宏大方程 (15例)
  {
    id: 'comp-076',
    name: '爱因斯坦引力场方程',
    latex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
    category: '现代物理'
  },
  {
    id: 'comp-077',
    name: '麦克斯韦方程组之一 (高斯电场定律)',
    latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}',
    category: '现代物理'
  },
  {
    id: 'comp-078',
    name: '麦克斯韦方程组之二 (高斯磁场定律)',
    latex: '\\nabla \\cdot \\mathbf{B} = 0',
    category: '现代物理'
  },
  {
    id: 'comp-079',
    name: '麦克斯韦方程组之三 (法拉第电磁感应)',
    latex: '\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}',
    category: '现代物理'
  },
  {
    id: 'comp-080',
    name: '麦克斯韦方程组之四 (安培-麦克斯韦定律)',
    latex: '\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}',
    category: '现代物理'
  },
  {
    id: 'comp-081',
    name: '薛定谔含时波动方程',
    latex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\left( -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}, t) \\right) \\Psi(\\mathbf{r}, t)',
    category: '现代物理'
  },
  {
    id: 'comp-082',
    name: '狄拉克相对论波动方程',
    latex: '(i \\gamma^\\mu \\partial_\\mu - m) \\psi = 0',
    category: '现代物理'
  },
  {
    id: 'comp-083',
    name: '克莱因-戈登方程',
    latex: '\\left( \\frac{1}{c^2} \\frac{\\partial^2}{\\partial t^2} - \\nabla^2 + \\frac{m^2 c^2}{\\hbar^2} \\right) \\psi = 0',
    category: '现代物理'
  },
  {
    id: 'comp-084',
    name: '普朗克黑体辐射光谱辐射度定律',
    latex: 'B_\\lambda(T) = \\frac{2hc^2}{\\lambda^5} \\frac{1}{e^{\\frac{hc}{\\lambda k_B T}} - 1}',
    category: '现代物理'
  },
  {
    id: 'comp-085',
    name: '纳维-斯托克斯不可压缩流体方程',
    latex: '\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla) \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}',
    category: '现代物理'
  },
  {
    id: 'comp-086',
    name: '布莱克-斯科尔斯金融期权定价偏微分方程',
    latex: '\\frac{\\partial V}{\\partial t} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + r S \\frac{\\partial V}{\\partial S} - r V = 0',
    category: '现代物理'
  },
  {
    id: 'comp-087',
    name: '海森堡不确定性原理',
    latex: '\\sigma_x \\sigma_p \\ge \\frac{\\hbar}{2}, \\quad [\\hat{x}, \\hat{p}] = i\\hbar',
    category: '现代物理'
  },
  {
    id: 'comp-088',
    name: '质能关系与相对论动量能量关系',
    latex: 'E^2 = (p c)^2 + (m_0 c^2)^2',
    category: '现代物理'
  },
  {
    id: 'comp-089',
    name: '麦克斯韦应力张量',
    latex: '\\sigma_{ij} = \\varepsilon_0 \\left( E_i E_j - \\frac{1}{2} \\delta_{ij} E^2 \\right) + \\frac{1}{\\mu_0} \\left( B_i B_j - \\frac{1}{2} \\delta_{ij} B^2 \\right)',
    category: '现代物理'
  },
  {
    id: 'comp-090',
    name: '杨-米尔斯规范场强张量',
    latex: 'F_{\\mu\\nu} = \\partial_\\mu A_\\nu - \\partial_\\nu A_\\mu - i g [A_\\mu, A_\\nu]',
    category: '现代物理'
  },

  // 7. 概率统计与前沿机器学习 (10例)
  {
    id: 'comp-091',
    name: '多元高斯分布概率密度函数',
    latex: 'f(\\mathbf{x}) = \\frac{1}{\\sqrt{(2\\pi)^k |\\boldsymbol{\\Sigma}|}} \\exp\\left( -\\frac{1}{2} (\\mathbf{x} - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}) \\right)',
    category: '概率与统计'
  },
  {
    id: 'comp-092',
    name: '贝叶斯后验概率更新公式',
    latex: 'P(\\theta | D) = \\frac{P(D | \\theta) P(\\theta)}{P(D)} = \\frac{P(D | \\theta) P(\\theta)}{\\int P(D | \\theta\') P(\\theta\') d\\theta\'}',
    category: '概率与统计'
  },
  {
    id: 'comp-093',
    name: 'KL散度 (Kullback-Leibler)',
    latex: 'D_{\\text{KL}}(P \\parallel Q) = \\int_{-\\infty}^\\infty p(x) \\ln\\left( \\frac{p(x)}{q(x)} \\right) dx',
    category: '概率与统计'
  },
  {
    id: 'comp-094',
    name: 'Softmax 注意力机制公式',
    latex: '\\operatorname{Attention}(Q, K, V) = \\operatorname{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
    category: '概率与统计'
  },
  {
    id: 'comp-095',
    name: '泊松分布概率质量函数与矩母函数',
    latex: 'P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad M_X(t) = \\exp\\left( \\lambda (e^t - 1) \\right)',
    category: '概率与统计'
  },
  {
    id: 'comp-096',
    name: '中心极限定理标准化随机变量',
    latex: 'Z_n = \\frac{\\sum_{i=1}^n X_i - n\\mu}{\\sigma \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)',
    category: '概率与统计'
  },
  {
    id: 'comp-097',
    name: '信息熵香农公式',
    latex: 'H(X) = -\\sum_{i=1}^n P(x_i) \\log_2 P(x_i)',
    category: '概率与统计'
  },
  {
    id: 'comp-098',
    name: '卡方分布概率密度函数',
    latex: 'f(x; k) = \\frac{1}{2^{k/2} \\Gamma(k/2)} x^{k/2 - 1} e^{-x/2}, \\quad x > 0',
    category: '概率与统计'
  },
  {
    id: 'comp-099',
    name: '学生t分布密度函数',
    latex: 'f(t) = \\frac{\\Gamma\\left(\\frac{\\nu+1}{2}\\right)}{\\sqrt{\\pi\\nu}\\,\\Gamma\\left(\\frac{\\nu}{2}\\right)} \\left(1 + \\frac{t^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}',
    category: '概率与统计'
  },
  {
    id: 'comp-100',
    name: 'Beta分布归一化常数与密度',
    latex: 'f(x; \\alpha, \\beta) = \\frac{1}{\\mathrm{B}(\\alpha, \\beta)} x^{\\alpha-1} (1-x)^{\\beta-1}, \\quad \\mathrm{B}(\\alpha, \\beta) = \\frac{\\Gamma(\\alpha)\\Gamma(\\beta)}{\\Gamma(\\alpha+\\beta)}',
    category: '概率与统计'
  },

  // 8. 超长复合公式 (> 500 ~ 1000 字符极限测试) (6例)
  {
    id: 'comp-101',
    name: '多项式广义二项式定理大展开',
    latex: '(x_1 + x_2 + \\dots + x_m)^n = \\sum_{k_1+k_2+\\dots+k_m=n} \\frac{n!}{k_1! k_2! \\dots k_m!} x_1^{k_1} x_2^{k_2} \\dots x_m^{k_m} + \\prod_{j=1}^m \\left( 1 + \\frac{x_j}{j} \\right)',
    category: '超长极限结构'
  },
  {
    id: 'comp-102',
    name: '4阶高维偏微分波动守恒积分方程',
    latex: '\\int_{\\Omega} \\left( \\frac{\\partial^4 u}{\\partial t^4} + c^2 \\nabla^2 \\left( \\frac{\\partial^2 u}{\\partial t^2} \\right) + c^4 \\nabla^4 u \\right) d\\Omega = \\oint_{\\partial \\Omega} \\left( \\mathbf{F} \\cdot \\mathbf{n} + \\frac{\\partial \\mathbf{G}}{\\partial t} \\cdot \\mathbf{n} + \\nabla \\left( \\frac{\\partial u}{\\partial t} \\right) \\cdot \\mathbf{n} \\right) dS',
    category: '超长极限结构'
  },
  {
    id: 'comp-103',
    name: '复合张量克里斯托费尔联络计算展开',
    latex: '\\Gamma^k_{ij} = \\frac{1}{2} g^{kl} \\left( \\frac{\\partial g_{jl}}{\\partial x^i} + \\frac{\\partial g_{il}}{\\partial x^j} - \\frac{\\partial g_{ij}}{\\partial x^l} \\right) + \\frac{1}{4} \\sum_{m=1}^n \\sum_{p=1}^n g^{km} g^{lp} \\left( \\frac{\\partial g_{mp}}{\\partial x^i} \\frac{\\partial g_{lp}}{\\partial x^j} \\right)',
    category: '超长极限结构'
  },
  {
    id: 'comp-104',
    name: '多层分式积分根号复合超级公式 (>500字符)',
    latex: '\\Psi(x, y, z) = \\frac{\\sqrt[3]{\\int_0^1 \\frac{t^4 + 2t^2 + 1}{\\sqrt{1 - t^2}} dt} + \\sum_{k=1}^\\infty \\frac{(-1)^k}{k^2 + 1} \\cos(k x)}{\\left( \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} + \\frac{\\partial^2 f}{\\partial z^2} \\right)^{\\frac{1}{4}} + \\sqrt{1 + \\frac{x^2}{y^2 + \\frac{z^2}{1 + x^2}}}} + \\oint_C \\frac{e^{i z}}{z^2 + 4} dz',
    category: '超长极限结构'
  },
  {
    id: 'comp-105',
    name: '千字级宏大数学矩阵联立多行大公式 (>1000字符极限)',
    latex: '\\begin{pmatrix} \\frac{a_{11} x_1 + a_{12} x_2 + a_{13} x_3}{\\sqrt{b_{11}^2 + b_{12}^2}} & \\int_0^\\infty e^{-\\alpha t} \\cos(\\omega t) dt & \\sum_{n=1}^\\infty \\frac{1}{n^2} \\\\ \\prod_{k=1}^m \\left(1 - \\frac{x^2}{k^2 \\pi^2}\\right) & \\begin{vmatrix} c_{11} & c_{12} \\\\ c_{21} & c_{22} \\end{vmatrix} & \\frac{\\partial^2 \\psi}{\\partial x^2} + \\frac{\\partial^2 \\psi}{\\partial y^2} \\\\ \\sqrt[4]{\\frac{d_{11} + d_{12}}{d_{21} - d_{22}}} & \\lim_{z \\to z_0} \\frac{f(z) - f(z_0)}{z - z_0} & \\oint_{\\Gamma} \\frac{\\ln(w+1)}{w^2 + 1} dw \\end{pmatrix} = \\begin{bmatrix} \\lambda_1 & 0 & 0 \\\\ 0 & \\lambda_2 & 0 \\\\ 0 & 0 & \\lambda_3 \\end{bmatrix} \\begin{pmatrix} v_1 \\\\ v_2 \\\\ v_3 \\end{pmatrix} + \\begin{pmatrix} \\frac{-b + \\sqrt{b^2 - 4ac}}{2a} \\\\ \\frac{-b - \\sqrt{b^2 - 4ac}}{2a} \\\\ \\frac{c}{a} \\end{pmatrix}',
    category: '超长极限结构'
  },
  {
    id: 'comp-106',
    name: '广义相对论黎曼曲率张量与里奇曲率张量完备展开',
    latex: 'R^{\\rho}_{\\sigma\\mu\\nu} = \\partial_\\mu \\Gamma^\\rho_{\\nu\\sigma} - \\partial_\\nu \\Gamma^\\rho_{\\mu\\sigma} + \\Gamma^\\rho_{\\mu\\lambda} \\Gamma^\\lambda_{\\nu\\sigma} - \\Gamma^\\rho_{\\nu\\lambda} \\Gamma^\\lambda_{\\mu\\sigma}, \\quad R_{\\sigma\\nu} = R^{\\lambda}_{\\sigma\\lambda\\nu}, \\quad R = g^{\\sigma\\nu} R_{\\sigma\\nu}',
    category: '超长极限结构'
  }
];
