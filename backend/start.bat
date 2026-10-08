@echo off
title LLMtoWord - Local OCR Service
echo ========================================================
echo   LLMtoWord - Local Vision Formula OCR Service
echo ========================================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python 3.9+ and add to PATH.
    pause
    exit /b
)

echo [1/2] Checking dependencies...
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

echo.
echo [2/2] Starting FastAPI server on http://127.0.0.1:8000 ...
echo [INFO] You can keep this window open while using the web app.
echo.
python app.py
pause
