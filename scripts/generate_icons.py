#!/usr/bin/env python3
"""
Enhanced PWA Icon Generator
Generates all required icon sizes from the logo image with high quality
"""

from pathlib import Path

try:
    from PIL import Image, ImageOps, ImageFilter, ImageEnhance
except ImportError as exc:
    raise SystemExit("Pillow is required: install with 'python -m pip install pillow'") from exc

SRC = Path('public/assets/logo/logo.jpg')
OUT_DIR = Path('public')  # Changed to output directly to public folder
BACKGROUND = (76, 175, 80, 255)  # #4CAF50 theme color
SIZES = [512, 384, 192, 152, 144, 128, 96, 72]  # Standard PWA icon sizes
APPLE_SIZES = [180]  # Apple touch icon


def generate_icons():
    """Generate all PWA-compliant icons from logo"""
    if not SRC.exists():
        raise SystemExit(f'❌ Source logo not found: {SRC}')

    print(f"🎨 Generating PWA icons from {SRC}...")
    
    # Load and enhance the image
    image = Image.open(SRC).convert('RGBA')
    
    # Enhance sharpness for better quality
    enhancer = ImageEnhance.Sharpness(image)
    image = enhancer.enhance(1.2)
    
    square_size = max(image.size)

    # Create square canvas with theme background
    canvas = Image.new('RGBA', (square_size, square_size), BACKGROUND)
    offset = ((square_size - image.width) // 2, (square_size - image.height) // 2)
    canvas.paste(image, offset, image if image.mode == 'RGBA' else None)

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Generate standard icons
    print("\n📱 Creating standard PWA icons...")
    for size in SIZES:
        resized = canvas.resize((size, size), Image.LANCZOS)
        # Apply subtle sharpening
        resized = resized.filter(ImageFilter.SHARPEN)
        icon_path = OUT_DIR / f'icon-{size}x{size}.png'
        resized.save(icon_path, 'PNG', optimize=True, quality=95)
        print(f"   ✓ {icon_path.name}")

    # Generate maskable icon with safe zone (80% of size)
    print("\n🎭 Creating maskable icon...")
    maskable_size = 512
    safe_zone = int(maskable_size * 0.75)
    
    maskable = Image.new('RGBA', (maskable_size, maskable_size), BACKGROUND)
    logo_resized = canvas.resize((safe_zone, safe_zone), Image.LANCZOS)
    logo_resized = logo_resized.filter(ImageFilter.SHARPEN)
    
    offset = ((maskable_size - safe_zone) // 2, (maskable_size - safe_zone) // 2)
    maskable.paste(logo_resized, offset, logo_resized)
    
    maskable_path = OUT_DIR / 'icon-512x512-maskable.png'
    maskable.save(maskable_path, 'PNG', optimize=True, quality=95)
    print(f"   ✓ {maskable_path.name}")

    # Generate Apple Touch Icon
    print("\n🍎 Creating Apple Touch Icon...")
    for size in APPLE_SIZES:
        resized = canvas.resize((size, size), Image.LANCZOS)
        resized = resized.filter(ImageFilter.SHARPEN)
        apple_path = OUT_DIR / f'apple-touch-icon.png'
        resized.save(apple_path, 'PNG', optimize=True, quality=95)
        print(f"   ✓ {apple_path.name}")

    # Generate favicon.ico (multi-size)
    print("\n🔖 Creating favicon...")
    favicon_sizes = [16, 32, 48]
    favicon_images = []
    for size in favicon_sizes:
        fav_img = canvas.resize((size, size), Image.LANCZOS)
        # Convert to RGB for ICO format
        bg = Image.new('RGB', (size, size), (76, 175, 80))
        bg.paste(fav_img, (0, 0), fav_img if fav_img.mode == 'RGBA' else None)
        favicon_images.append(bg)
    
    favicon_path = OUT_DIR / 'favicon.ico'
    favicon_images[0].save(
        favicon_path,
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=favicon_images[1:]
    )
    print(f"   ✓ {favicon_path.name}")
    
    total_icons = len(SIZES) + len(APPLE_SIZES) + 2  # +2 for maskable and favicon
    print(f"\n✅ Successfully generated {total_icons} icons in {OUT_DIR}/")
    print("\n📋 Summary:")
    print(f"   - Standard icons: {len(SIZES)} sizes")
    print(f"   - Maskable icon: 512x512px (PWA compliant)")
    print(f"   - Apple Touch Icon: 180x180px")
    print(f"   - Favicon: Multi-size ICO (16, 32, 48)")


if __name__ == '__main__':
    generate_icons()
