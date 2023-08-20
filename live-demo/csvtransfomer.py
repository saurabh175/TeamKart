import csv
import json
from reportlab.pdfgen import canvas

def convert_csv_to_json(csv_file, json_file):
    data = {
        "body": []
    }

    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)

        for row in reader:
            title = row['title']
            color = row['Color']

            # Check if title object already exists
            title_obj = next((item for item in data['body'] if item['Title'] == title), None)

            if title_obj:
                # Title object already exists, append color to "Colors Available"
                if color not in title_obj['Colors Available']:
                    title_obj['Colors Available'][color] = {
                        "link": row['link'],
                        "material": row['material'],
                        "image link": row['image_link'],
                    }
            else:
                # Create a new title object
                item = {
                    "Title": title,
                    "Colors Available": {
                        color: {
                            "link": row['link'],
                            "material": row['material'],
                            "image link": row['image_link'],
                        }
                    },
                    "Sleeves": row['Sleeves'],
                    "Price in Different Currencies": {
                        "DKK": None,
                        "USD": None,
                        "CHF": None,
                        "GBP": None,
                        "AUD": None,
                        "SED": None,
                        "SGD": None,
                        "EUR": None,
                        "CAD": None
                    },
                    "Description": row['description'],
                    "Availability": row['availability'],
                    "Neck Shape": row['Necks']
                }
                data['body'].append(item)

            currencies = ['DKK', 'USD', 'CHF', 'GBP', 'AUD', 'SED', 'SGD', 'EUR', 'CAD']
            for currency in currencies:
                currencyA = "Price in " + currency
                if row[currencyA]:
                    title_obj = next((item for item in data['body'] if item['Title'] == title), None)
                    if title_obj:
                        title_obj['Price in Different Currencies'][currency] = int(row[currencyA])



    with open(json_file, 'w', encoding="utf-8") as output_file:
        json.dump(data, output_file, indent=4)

    # Generate PDF
    pdf_file = 'pdfs/output.pdf'
    c = canvas.Canvas(pdf_file)
    for item in data["body"]:
        c.setFont("Helvetica", 6)
        c.drawString(100, 700, "Title: " + item['Title'])
        c.drawString(100, 690, "Sleeves: " + item['Sleeves'])
        c.drawString(100, 680, "Description: " + item['Description'])
        c.drawString(100, 670, "Availability: " + item['Availability'])
        c.drawString(100, 660, "Neck Shape: " + item['Neck Shape'])

        c.drawString(100, 640, "Colors Available:")
        color_y = 620
        for color, color_info in item['Colors Available'].items():
            c.drawString(120, color_y, "Color: " + color)
            c.drawString(140, color_y - 20, "Link: " + color_info['link'])
            c.drawString(140, color_y - 40, "Material: " + color_info['material'])
            c.drawString(140, color_y - 60, "Image Link: " + color_info['image link'])
            color_y -= 80

        c.drawString(100, 500, "Price in Different Currencies:")
        price_y = 480
        for currency, price in item['Price in Different Currencies'].items():
            c.drawString(120, price_y, currency + ": " + str(price))
            price_y -= 20

        c.showPage()

    c.save()

    print("Conversion completed. JSON data written to", json_file)
    print("PDF file generated as", pdf_file)


# Example usage
csv_file = 'SOT_Products_refined.csv'
json_file = 'pdfs/output.pdf'
convert_csv_to_json(csv_file, json_file)
