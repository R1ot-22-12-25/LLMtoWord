"""
LLMtoWord - 本地轻量化数学公式视觉识别 Sidecar 服务
基于开源模型 rapid-latex-ocr (ONNX CPU) / LaTeX-OCR (pix2tex)
默认使用轻量级 Rapid-Latex-OCR (ONNX 架构)，纯 CPU 笔记本秒级推理，无需独立显卡
"""

import os
import time
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageChops

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

# 全局模型实例
ocr_model = None
model_engine = "none"
model_name = "未加载"


def get_ocr_model():
    """按需延迟加载模型，优先使用速度更快的 rapid_latex_ocr (ONNX)，次选 pix2tex"""
    global ocr_model, model_engine, model_name
    if ocr_model is not None:
        return ocr_model, model_engine

    # 1. 优先尝试 rapid-latex-ocr (ONNX，轻量且在 CPU 上极快)
    try:
        from rapid_latex_ocr import LaTeXOCR
        print("[LLMtoWord] 正在加载轻量化 ONNX 公式识别模型 (rapid-latex-ocr)...")
        ocr_model = LaTeXOCR()
        model_engine = "rapid"
        model_name = "Rapid-LaTeX-OCR (ONNX CPU)"
        print("[LLMtoWord] Rapid-LaTeX-OCR 加载成功，已就绪！")
        return ocr_model, model_engine
    except ImportError:
        pass
    except Exception as e:
        print(f"[LLMtoWord] rapid-latex-ocr 加载提示: {e}")

    # 2. 次选 pix2tex
    try:
        from pix2tex.cli import LatexOCR
        print("[LLMtoWord] 正在加载 pix2tex (LaTeX-OCR)...")
        ocr_model = LatexOCR()
        model_engine = "pix2tex"
        model_name = "pix2tex (LaTeX-OCR)"
        print("[LLMtoWord] pix2tex 模型加载成功，已就绪！")
        return ocr_model, model_engine
    except ImportError:
        pass
    except Exception as e:
        print(f"[LLMtoWord] pix2tex 加载提示: {e}")

    raise RuntimeError(
        "未检测到 OCR 模型依赖，请安装: pip install rapid-latex-ocr 或 pip install pix2tex"
    )


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


def trim_whitespace(im: Image.Image, padding: int = 12) -> Image.Image:
    """自动裁剪公式四周多余的白边，降低 OCR 干扰并提升推理速度"""
    try:
        rgb_im = im.convert("RGB")
        bg = Image.new("RGB", rgb_im.size, rgb_im.getpixel((0, 0)))
        diff = ImageChops.difference(rgb_im, bg)
        bbox = diff.getbbox()
        if bbox:
            w, h = rgb_im.size
            crop_box = (
                max(0, bbox[0] - padding),
                max(0, bbox[1] - padding),
                min(w, bbox[2] + padding),
                min(h, bbox[3] + padding),
            )
            return rgb_im.crop(crop_box)
    except Exception:
        pass
    return im


@app.post("/api/ocr")
async def recognize_formula(file: UploadFile = File(...)):
    """
    图片数学公式识别接口
    接收上传的公式截图，返回标准 LaTeX 代码
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="仅支持图片文件格式 (PNG, JPEG, WebP)")

    start_time = time.perf_counter()

    try:
        # 读取图片内容
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # 智能裁切周围过宽的空白边距
        trimmed_image = trim_whitespace(image)

        # 获取模型并执行推理
        model, engine = get_ocr_model()

        if engine == "rapid":
            # 将处理后的图片转为字节传给 rapid_latex_ocr
            buf = io.BytesIO()
            trimmed_image.save(buf, format="PNG")
            latex_result, _ = model(buf.getvalue())
        else:
            latex_result = model(trimmed_image)

        # 清洗结果
        if latex_result:
            latex_result = str(latex_result).strip()
            # 去除可能的外层多余定界符
            if latex_result.startswith("$") and latex_result.endswith("$") and len(latex_result) > 2:
                latex_result = latex_result[1:-1].strip()

        duration_ms = round((time.perf_counter() - start_time) * 1000)

        return {
            "success": True,
            "latex": latex_result,
            "duration_ms": duration_ms,
            "model": model_name,
            "image_size": f"{trimmed_image.width}x{trimmed_image.height}"
        }

    except Exception as err:
        return {
            "success": False,
            "latex": "",
            "error": f"识别推理异常: {str(err)}",
            "duration_ms": round((time.perf_counter() - start_time) * 1000),
            "model": model_name
        }


if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 60)
    print("  LLMtoWord 本地离线 OCR 微服务启动中...")
    print("  服务监听地址: http://127.0.0.1:8000")
    print("  API 文档地址: http://127.0.0.1:8000/docs")
    print("=" * 60 + "\n")
    uvicorn.run(app, host="127.0.0.1", port=8000)
