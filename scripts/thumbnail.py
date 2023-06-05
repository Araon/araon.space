import logging
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import requests
import json
import os
from io import BytesIO
import textwrap
import random

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')

# Load JSON data
with open('/home/araon/projects/araon.space/dist/blog.json') as file:
    json_data = json.load(file)

# Process each item in the JSON data
for item in json_data:
    # Extract necessary information
    # if top_image is a URL, then download it
    # if top_image is a local file, then open it
    if item['top_image'].startswith('http'):
        image_url = item['top_image']
        title = item['title']

    # Download the image from the URL
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content))

    # Darken the image
    enhancer = ImageEnhance.Brightness(image)
    darkened_image = enhancer.enhance(0.2)  # You can adjust the brightness value as per your requirement
    # add a blur to the image
    darkened_image = darkened_image.filter(ImageFilter.GaussianBlur(radius=5))

    # Create a drawing object
    draw = ImageDraw.Draw(darkened_image)

    # Define the maximum font size with respect to the image dimensions
    max_font_size = 150  # Adjust the maximum font size as per your requirement

    # Determine the maximum width and height for the text
    max_text_width = int(darkened_image.width * 0.8)  # Adjust the width percentage as per your requirement
    max_text_height = int(darkened_image.height * 0.8)  # Adjust the height percentage as per your requirement

    # Get a list of font files from the "fonts" folder
    fonts_folder = '/home/araon/projects/araon.space/scripts/fonts'
    font_files = os.listdir(fonts_folder)

    # Select a random font file from the list
    random_font_file = random.choice(font_files)

    # Construct the path to the randomly selected font file
    font_path = os.path.join(fonts_folder, random_font_file)

    # Iterate over font sizes from max to min to find the best fit
    for font_size in range(max_font_size, 0, -1):
        font = ImageFont.truetype(font_path, font_size)

        # Wrap the title text
        lines = textwrap.wrap(title, width=15)  # Adjust the width as per your requirement

        # Calculate the maximum width among the wrapped lines
        max_line_width = max([draw.textsize(line, font=font)[0] for line in lines])

        # Calculate the text position (left justified)
        text_x = int((darkened_image.width - max_line_width) / 2)  # Adjust the alignment as per your requirement
        text_y = int((darkened_image.height - font_size * len(lines)) / 2)



        # Add the wrapped text to the image
        for line in lines:
            draw.text((text_x, text_y), line, font=font, fill='white')
            text_y += font_size + 5  # Add a padding between lines
            
                # Check if the text fits within the maximum dimensions
        if max_line_width <= max_text_width and font_size * len(lines) <= max_text_height:
            break

        logging.debug(f'Font size: {font_size}, max line width: {max_line_width}, max text width: {max_text_width}, max text height: {max_text_height}, for file: {random_font_file}')



    # Save the modified image
    output_file = f'{item["url_title"]}.jpg'
    darkened_image.save(output_file)
    logging.info(f'Image saved: {output_file}, used font: {random_font_file} with dimensions: {darkened_image.width}x{darkened_image.height} and font size: {font_size} and location: {text_x},{text_y}')
