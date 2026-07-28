from PIL import Image
import colorsys

img_path = r"C:\Users\hp\.gemini\antigravity\scratch\gocart\assets\sentech_logo.png"
img = Image.open(img_path).convert("RGBA")

pixels = img.load()
width, height = img.size

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a < 10:
            continue
        
        # Convert RGB to HSV
        h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
        
        # If it's near white background (r,g,b all > 245)
        if r > 245 and g > 245 and b > 245:
            # keep white or transparent
            continue
            
        # Check if it's the blue color in "PLUS"
        # Blue usually has b > r and b > g, or hue in blue range (~0.55-0.65)
        is_blue = (b > r + 15 and b > g + 10) or (0.50 <= h <= 0.68 and s > 0.2)
        
        if is_blue:
            # Make blue vibrant
            new_r, new_g, new_b = int(0.11 * 255), int(0.44 * 255), int(0.88 * 255) # #1D70B8 / #2563EB
            pixels[x, y] = (new_r, new_g, new_b, a)
        else:
            # It's the light grey text / logo outline!
            # Darken it significantly to dark slate #1E293B or dark grey #0F172A
            # Calculate intensity relative to original
            # Darker original pixels stay dark, lighter original pixels become dark slate
            gray_factor = (r + g + b) / 3.0
            # Map 0..245 range to dark slate (0..40)
            target_v = int((gray_factor / 245.0) * 45) # 0 to 45
            pixels[x, y] = (target_v, target_v + 5, target_v + 15, a)

output_assets = r"C:\Users\hp\.gemini\antigravity\scratch\gocart\assets\sentech_logo.png"
output_public = r"C:\Users\hp\.gemini\antigravity\scratch\gocart\public\sentech_logo.png"

img.save(output_assets)
img.save(output_public)
print("Successfully enhanced logo contrast!")
