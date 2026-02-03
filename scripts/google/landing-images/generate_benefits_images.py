#!/usr/bin/env python3
"""
Generador de imágenes para landing pages usando Imagen 4.0 de Google.
Basado en el skill landing-image-generator.
"""

import os
import sys
import yaml
import base64
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("❌ Error: google-genai no está instalado")
    print("💡 Ejecuta: pip install google-genai")
    sys.exit(1)


def generate_image(client, prompt, aspect_ratio="4:3"):
    """Genera una imagen usando Imagen 4.0"""
    try:
        response = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio=aspect_ratio,
                safety_filter_level="block_low_and_above",
            ),
        )

        if response.generated_images and len(response.generated_images) > 0:
            return response.generated_images[0].image
        return None
    except Exception as e:
        print(f"❌ Error generando imagen: {e}")
        return None


def save_image(image_data, output_path):
    """Guarda la imagen generada"""
    try:
        # Crear directorio si no existe
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        # Guardar imagen
        with open(output_path, "wb") as f:
            f.write(image_data.image_bytes)

        return True
    except Exception as e:
        print(f"❌ Error guardando imagen: {e}")
        return False


def main():
    # Verificar API key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY no está configurada")
        print("💡 Crea un archivo .env con: GEMINI_API_KEY=tu-api-key")
        sys.exit(1)

    # Verificar argumentos
    if len(sys.argv) < 2:
        print("Uso: python generate_benefits_images.py <prompts.yaml>")
        sys.exit(1)

    prompts_file = sys.argv[1]

    # Cargar prompts
    try:
        with open(prompts_file, "r") as f:
            data = yaml.safe_load(f)
    except Exception as e:
        print(f"❌ Error cargando prompts: {e}")
        sys.exit(1)

    images = data.get("images", [])
    if not images:
        print("❌ No se encontraron imágenes en el archivo YAML")
        sys.exit(1)

    print(f"🎨 Generando {len(images)} imágenes para Benefits section...")
    print(f"💰 Costo estimado: ~${len(images) * 0.04:.2f} USD\n")

    # Inicializar cliente
    client = genai.Client(api_key=api_key)

    # Generar cada imagen
    generated = []
    failed = []

    for idx, img_config in enumerate(images, 1):
        img_id = img_config.get("id", f"image-{idx}")
        prompt = img_config.get("prompt", "")
        output = img_config.get("output", "")
        aspect_ratio = img_config.get("aspect_ratio", "4:3")

        print(f"[{idx}/{len(images)}] Generando: {img_id}")
        print(f"   📁 Output: {output}")

        # Generar imagen
        image_data = generate_image(client, prompt, aspect_ratio)

        if image_data:
            # Guardar imagen
            if save_image(image_data, output):
                print(f"   ✅ Guardada: {output}\n")
                generated.append(output)
            else:
                print(f"   ❌ Error guardando\n")
                failed.append(img_id)
        else:
            print(f"   ❌ Error generando\n")
            failed.append(img_id)

    # Resumen
    print("\n" + "=" * 50)
    print("📊 RESUMEN")
    print("=" * 50)
    print(f"✅ Generadas: {len(generated)}/{len(images)}")
    print(f"❌ Fallidas: {len(failed)}")

    if generated:
        print("\n📁 Imágenes generadas:")
        for path in generated:
            print(f"   - {path}")

    if failed:
        print("\n⚠️  Imágenes fallidas:")
        for img_id in failed:
            print(f"   - {img_id}")
        sys.exit(1)

    print("\n🎉 ¡Todas las imágenes generadas exitosamente!")


if __name__ == "__main__":
    main()
