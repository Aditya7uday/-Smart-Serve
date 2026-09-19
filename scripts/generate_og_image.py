"""One-off script to generate public/og-image.png. Not part of the app build."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
ORANGE_DARK = (255, 122, 0)
ORANGE_LIGHT = (255, 179, 92)
WHITE = (255, 255, 255)
GREEN = (46, 125, 50)

img = Image.new('RGB', (W, H))
px = img.load()
for y in range(H):
    t = y / H
    r = int(ORANGE_DARK[0] + (ORANGE_LIGHT[0] - ORANGE_DARK[0]) * t)
    g = int(ORANGE_DARK[1] + (ORANGE_LIGHT[1] - ORANGE_DARK[1]) * t)
    b = int(ORANGE_DARK[2] + (ORANGE_LIGHT[2] - ORANGE_DARK[2]) * t)
    for x in range(W):
        px[x, y] = (r, g, b)

draw = ImageDraw.Draw(img, 'RGBA')
draw.ellipse([W - 380, -220, W - 380 + 560, -220 + 560], fill=(255, 255, 255, 22))
draw.ellipse([-200, H - 260, -200 + 400, H - 260 + 400], fill=(255, 255, 255, 22))

logo_size = 90
logo_x, logo_y = 90, 110
draw.rounded_rectangle([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], radius=24, fill=WHITE)
font_logo = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 50)
bbox = draw.textbbox((0, 0), 'S', font=font_logo)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
draw.text((logo_x + logo_size / 2 - tw / 2 - bbox[0], logo_y + logo_size / 2 - th / 2 - bbox[1]), 'S', font=font_logo, fill=ORANGE_DARK)

font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 78)
draw.text((88, 236), 'Smart Serve', font=font_title, fill=WHITE)

font_tag = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 32)
tagline = 'Smart ordering. Faster service.'
tagline2 = 'Skip the line, order ahead from the campus canteen.'
draw.text((90, 336), tagline, font=font_tag, fill=(255, 255, 255, 235))
draw.text((90, 380), tagline2, font=font_tag, fill=(255, 255, 255, 235))

badge_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 24)
badge_text = 'Live at University Canteen'
bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
btw = bbox[2] - bbox[0]
badge_w = btw + 70
badge_x, badge_y = 90, 452
draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + 54], radius=27, fill=(255, 255, 255, 40), outline=(255, 255, 255, 90), width=2)
draw.ellipse([badge_x + 22, badge_y + 22, badge_x + 32, badge_y + 32], fill=GREEN)
draw.text((badge_x + 44, badge_y + 15), badge_text, font=badge_font, fill=WHITE)

img.save('public/og-image.png', 'PNG')
print('Saved public/og-image.png', img.size)
