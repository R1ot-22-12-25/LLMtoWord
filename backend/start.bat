@echo off
chcp 65001 >nul
echo ========================================================
echo   LLMtoWord - 本地离线数学公式 OCR 服务启动器
echo   基于轻量级开源模型 LaTeX-OCR (pix2tex)
echo ========================================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Python 环境，请先安装 Python 3.9+ 并勾选 Add to PATH。
    pause
    exit /b
)

echo [1/2] 正在检查依赖环境...
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

echo.
echo [2/2] 正在启动 FastAPI 本地服务 (http://127.0.0.1:8000)...
echo 服务启动后，前端 Web 界面会自动检测并连接此服务。
echo.
python app.py
pause
