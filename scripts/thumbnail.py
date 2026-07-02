import logging
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import requests
import json
import os
from io import BytesIO
import textwrap
import random

logging.basicConfig(level=logging.INFO, format='%(message)s')

def process_image(item):
    if item['top_image'].startswith('http'):
        image_url = item['top_image']
        title = item['title']

    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content))

    enhancer = ImageEnhance.Brightness(image)
    darkened_image = enhancer.enhance(0.2)
    darkened_image = darkened_image.filter(ImageFilter.GaussianBlur(radius=5))

    draw = ImageDraw.Draw(darkened_image)

    max_font_size = 60
    max_text_width = int(darkened_image.width * 0.8)
    max_text_height = int(darkened_image.height * 0.8)

    fonts_folder = '/home/araon/projects/araon.space/scripts/fonts'
    font_files = os.listdir(fonts_folder)
    random_font_file = random.choice(font_files)
    font_path = os.path.join(fonts_folder, random_font_file)

    for font_size in range(max_font_size, 0, -1):
        font = ImageFont.truetype(font_path, font_size)
        lines = textwrap.wrap(title, width=len(title))
        max_line_width = max([draw.textsize(line, font=font)[0] for line in lines])
        text_x = int((darkened_image.width - max_line_width) / 2)
        text_y = int((darkened_image.height - font_size * len(lines)) / 2)

        for line in lines:
            draw.text((text_x, text_y), line, font=font, fill='white')
            text_y += font_size + 5

        if max_line_width <= max_text_width and font_size * len(lines) <= max_text_height:
            break

    output_file = f'{item["url_title"]}.jpg'
    darkened_image.save(output_file)
    logging.info(f'Image saved: {output_file}, used font: {random_font_file} with dimensions: {darkened_image.width}x{darkened_image.height} and font size: {font_size} and location: {text_x},{text_y}')

with open('/home/araon/projects/araon.space/dist/blog.json') as file:
    json_data = json.load(file)

print("Select an image to update:")
for index, item in enumerate(json_data, 1):
    print(f"{index}. {item['title']}")

choice = int(input("Enter the number of the image you want to update: "))

if 1 <= choice <= len(json_data):
    process_image(json_data[choice-1])
else:
    print("Invalid choice!")
