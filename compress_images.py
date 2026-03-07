import os
from PIL import Image

IMAGE_DIR = "images"
MAX_WIDTH = 1920
JPEG_QUALITY = 85
PNG_OPTIMIZE = True

SKIP = {"vid.mp4"}

results = []

def get_size_kb(path):
    return os.path.getsize(path) / 1024

def compress_image(filepath):
    original_size = get_size_kb(filepath)
    filename = os.path.basename(filepath)

    try:
        img = Image.open(filepath)
        img.load()  # Force full load to catch corrupt data early
    except Exception as e:
        print(f"  SKIP (error loading: {e}): {filepath}")
        return None

    try:
        # Resize if wider than MAX_WIDTH, keep aspect ratio
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_height = int(img.height * ratio)
            img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

        ext = os.path.splitext(filepath)[1].lower()

        if ext in (".jpg", ".jpeg"):
            # Convert RGBA to RGB if needed
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(filepath, "JPEG", quality=JPEG_QUALITY, optimize=True)
        elif ext == ".png":
            img.save(filepath, "PNG", optimize=PNG_OPTIMIZE)
        else:
            print(f"  SKIP (unsupported format): {filepath}")
            return None
    except Exception as e:
        print(f"  ERROR (skipping: {e}): {filepath}")
        return None

    new_size = get_size_kb(filepath)
    reduction = ((original_size - new_size) / original_size) * 100 if original_size > 0 else 0
    results.append((filepath, original_size, new_size, reduction))
    print(f"  {filename}: {original_size:.0f} KB -> {new_size:.0f} KB ({reduction:.1f}% smaller)")

def walk_and_compress(directory):
    for root, dirs, files in os.walk(directory):
        for f in files:
            if f in SKIP:
                continue
            filepath = os.path.join(root, f)
            compress_image(filepath)

print("Compressing images...\n")
walk_and_compress(IMAGE_DIR)

print("\n" + "=" * 60)
total_before = sum(r[1] for r in results)
total_after = sum(r[2] for r in results)
total_reduction = ((total_before - total_after) / total_before) * 100 if total_before > 0 else 0
print(f"TOTAL: {total_before:.0f} KB -> {total_after:.0f} KB ({total_reduction:.1f}% smaller)")
print(f"Saved: {(total_before - total_after) / 1024:.1f} MB")
print(f"Files processed: {len(results)}")
