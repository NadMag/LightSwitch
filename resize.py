import os
import argparse
from PIL import Image


def resize_image(filepath, target_width, target_height, quality=80, overwrite=False):
    """Resizes a single image and saves it as JPG with specified compression."""
    try:
        with Image.open(filepath) as img:
            img = img.resize((target_width, target_height), Image.LANCZOS)

            if overwrite:
                base, ext = os.path.splitext(filepath)  # Needed in case of overwrite
                output_filepath = f'{base}.jpg'  # Overwrite the original
            else:
                base, ext = os.path.splitext(filepath)
                output_filepath = f"{base}_resized.jpg"  # New file

            try:
                img = img.convert("RGB")
                img.save(output_filepath, "JPEG", quality=quality)
                print(f"Resized and saved: {filepath} -> {output_filepath}")

            except OSError as e:
                if "cannot write file as JPEG" in str(e):
                    try:
                        img.convert('RGB').save(output_filepath, "JPEG", quality=quality)
                        print(f"Resized and saved: {filepath} -> {output_filepath}")
                    except Exception as e2:
                        print(f"Error: Could not resize and save (conversion needed ){filepath}: {e2}")
                else:
                     print(f"Error saving {filepath}: {e}")

    except (IOError, OSError) as e:
        print(f"Error processing {filepath}: {e}")



def resize_images_recursively(directory, target_width, target_height, quality=80, overwrite=False):
    """Recursively scans a directory and resizes all supported images."""

    if not os.path.isdir(directory):
        print(f"Error: '{directory}' is not a valid directory.")
        return

    supported_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp'}

    for root, _, files in os.walk(directory):  # Use os.walk for recursion
        for filename in files:
            filepath = os.path.join(root, filename)
            _, ext = os.path.splitext(filename)
            ext = ext.lower()
            if ext in supported_extensions:
                resize_image(filepath, target_width, target_height, quality, overwrite)

    print("Image resizing completed.")


def main():
    parser = argparse.ArgumentParser(description="Recursively resize images in a directory.")
    parser.add_argument("directory", help="Path to the directory containing images.")
    parser.add_argument("width", type=int, help="Target width for the resized images.")
    parser.add_argument("height", type=int, help="Target height for the resized images.")
    parser.add_argument("-q", "--quality", type=int, default=80,
                        help="JPEG compression quality (0-100, default: 80).")
    parser.add_argument("-o", "--overwrite", action="store_true",
                        help="Overwrite the original images. If not specified, saves as a new file.")

    args = parser.parse_args()

    resize_images_recursively(args.directory, args.width, args.height, args.quality, args.overwrite)


if __name__ == "__main__":
    main()