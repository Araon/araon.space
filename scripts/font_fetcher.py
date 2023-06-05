import requests
import os


def get_urls(content):
    '''
    Parses the css file and retrieves the font urls.
    Parameters: 
    content (string): The data which needs to be parsed for the font urls.
    Returns: 
    A list of urls.
    '''

    urls = []
    for i in range(len(content)):

        # read the content until you encounter url string
        # after you encounter the url string, scan the content until a closing parenthesis is encountered
        # store the fetched url in the urls list
        if content[i: i+3] == 'url':
            j = i + 4
            url = ''
            while content[j] != ')':
                url += content[j]
                j += 1
            urls.append(url)

    return urls


def fetch_data(urls):
    '''
    Downloads the font files from the `urls` list.
    Parameters: 
    urls (list): List of urls from which the font files have to be downloaded.
    Returns: 
    None
    '''

    # create a fonts directory if it doesn't exist
    if not os.path.exists('fonts'):
        os.mkdir('fonts')

    for index, url in enumerate(urls):

        # get the font's name from it url
        font_name = url.split('/')[-1]

        # download the font data from its url
        response = requests.get(url)

        # save the downloaded data to the font file
        with open(f'fonts/{font_name}', 'wb') as f:
            f.write(response.content)

        print(f'Downloaded {font_name}, {index + 1} of {len(urls)} fonts. ')

    return None


def main(method, src):
    '''
    Main Function for the app.
    Parameters: 
    method (string): Add link if the `src` is a HTTP/HTTPS link.
                     Add file if the `src` is a local CSS file.
    src (string):    Add the path of the link or the file, depending on the `method` parameter.
    Returns: 
    None
    '''

    if method == 'file':
        with open(src) as f:
            content = f.read()

    elif method == 'link':
        content = str(requests.get(src).content)

    # extract the urls from the content
    urls = get_urls(content)
    print(f'Fetched {len(urls)} urls.')

    # download the font files
    fetch_data(urls)

    return None

# uncomment the below method if src is an HTTP/HTTPS url
main(method='link', src='https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Montserrat:wght@600&family=Playfair+Display&family=Poppins:wght@500&family=Space+Mono&display=swap')

# uncomment the below method if src is a local CSS file
# main(method='file', src='fonts.css')