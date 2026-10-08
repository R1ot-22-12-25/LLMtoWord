"""
LLMtoWord - 本地轻量化数学公式视觉识别 Sidecar 服务
基于开源模型 LaTeX-OCR (pix2tex) / UniMERNet
默认使用轻量级 pix2tex (~110MB 权重)，纯 CPU 笔记本约 0.2~0.4s 秒级推理，无需独立显卡
"""

import os
import time
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI(
    title="LLMtoWord Local Vision OCR API",
    description="本地离线数学公式 OCR 识别微服务，专为 LLMtoWord 前端中间件提供离线算力支撑",
    version="1.0.0"
)

# 允许跨域请求 (让前端 Web 界面无论部署在本地还是云端都能访问)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局模型实例延迟加载
ocr_model = None
model_name = "pix2tex (LaTeX-OCR)"


def get_ocr_model():
    """按需延迟加载模型，避免启动时卡顿"""
    global ocr_model, model_name
    if ocr_model is None:
        try:
            print("[LLMtoWord] 正在加载轻量化公式识别模型 pix2tex (LaTeX-OCR)...")
            from pix2tex.cli import LatexOCR
            ocr_model = LatexOCR()
            print("[LLMtoWord] 模型加载完毕，已就绪！")
        except ImportError:
            raise RuntimeError(
                "未检测到 pix2tex 依赖包，请运行: pip install pix2tex[gui] 安装"
            )
        except Exception as e:
            raise RuntimeError(f"模型加载失败: {str(e)}")
    return ocr_model


@app.get("/api/health")
async def health_check():
    """健康检查与探活接口 (前端自动嗅探本地服务是否已启动)"""
    return {
        "status": "ok",
        "service": "LLMtoWord-Local-OCR",
        "model": model_name,
        "is_model_loaded": ocr_model is not None,
        "timestamp": time.time()
    }


@app.post("/api/ocr")
async def recognize_formula(file: UploadFile = File(...)):
    """
    图片数学公式识别接口
    接收上传的公式截图，返回标准 LaTeX 代码
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="仅支持图片文件格式 (PNG, JPEG, WebP)")

    start_time = time.perf_now() if hasattr(time, 'perf_now') else time.time()

    try:
        # 读取图片内容
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # 获取模型并执行推理
        model = get_ocr_model()
        latex_result = model(image)

        # 简单清洗
        if latex_result:
            latex_result = latex_result.strip()
            # 去除可能的外层多余定界符
            if latex_result.startswith("$") and latex_result.endsWith("$") and len(latex_result) > 2:
                latex_result = latex_result[1:-1].strip()

        duration_ms = round((time.time() - start_time) * 1000)

        return {
            "success": True,
            "latex": latex_result,
            "duration_ms": duration_ms,
            "model": model_name,
            "image_size": f"{image.width}x{image.height}"
        }

    except Exception as err:
        return {
            "success": False,
            "latex": "",
            "error": f"识别推理异常: {str(err)}",
            "duration_ms": round((time.time() - start_time) * 1000),
            "model": model_name
        }


if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("  LLMtoWord 本地离线 OCR 微服务启动中...")
    print("  服务监听地址: http://127.0.0.1:8000")
    print("  API 文档地址: http://127.0.0.1:8000/docs")
    print("="*60 + "\n")
    uvicorn.run(app, host="127.0.0.1", port=8000)
