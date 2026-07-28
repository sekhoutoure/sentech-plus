from PIL import Image

img_path = r"C:\Users\hp\.gemini\antigravity\scratch\gocart\assets\sentech_logo.png"
img = Image.open(img_path).convert("RGBA")

pixels = img.load()
width, height = img.size

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # If pixel is white or near-white background (r > 240 and g > 240 and b > 240)
        if r > 240 and g > 240 and b > 240:
            pixels[x, y] = (255, 255, 255, 0) # transparent!

output_assets = r"C:\Users\hp\.gemini\antigravity\scratch\gocart\assets\sentech_logo.png"
output_public = r"C:\Users\hp\.gemini\antigravity\scratch\gocart\public\sentech_logo.png"

img.save(output_assets)
img.save(output_public)
print("Transparent background applied!")
