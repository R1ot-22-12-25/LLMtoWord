#!/bin/bash
echo "========================================================"
echo "  LLMtoWord - 本地离线数学公式 OCR 服务启动器 (macOS / Linux)"
echo "  基于轻量级开源模型 LaTeX-OCR (pix2tex)"
echo "========================================================"

if ! command -v python3 &> /dev/null
then
    echo "[错误] 未检测到 python3，请先安装 Python 3.9+"
    exit 1
fi

echo "[1/2] 检查并安装依赖..."
pip3 install -r requirements.txt

echo "[2/2] 启动服务 (http://127.0.0.1:8000)..."
python3 app.py
