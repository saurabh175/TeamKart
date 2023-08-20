import json


class Product:
    def __init__(self, title, desc, material, link, image):
        self.title = title
        self.desc = desc
        self.material = material
        self.link = link
        self.image = image


def create_product_object(product_string):
    # Split the string by newlines to get individual lines
    lines = product_string.split('\n')

    # Initialize variables to store attribute values
    title = ''
    desc = ''
    material = ''
    link = ''
    image = ''

    # Iterate over each line and extract attribute values
    for line in lines:
        if line.startswith("Title:"):
            title = line.replace("Title: ", '')
        elif line.startswith("Description:"):
            desc = line.replace("Description: ", '')
        elif line.startswith("Material:"):
            material = line.replace("Material: ", '')
        elif line.startswith("Link:"):
            link = line.replace("Link: ", '')
        elif line.startswith("Image Link:"):
            image = line.replace("Image Link: ", '')

    # Create and return the Product object
    return Product(title, desc, material, link, image)


class ProductEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Product):
            return obj.__dict__  # Convert Product object to a dictionary
        return super().default(obj)
