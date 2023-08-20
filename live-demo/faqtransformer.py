from reportlab.pdfgen import canvas

# Read the FAQ content from the text file
with open("faq.txt", "r",  encoding="utf-8") as file:
    faq = file.readlines()

# Create a PDF canvas
pdf_canvas = canvas.Canvas("pdfs/faq.pdf")

# Set the font and font size
pdf_canvas.setFont("Helvetica", 12)

# Set the position for the first line
x = 50
y = 800

# Set the line spacing
line_spacing = 15

# Maximum characters per line
max_characters = 80

# Flag to indicate if the previous line was a header
previous_line_was_header = False

# Iterate through each line of the FAQ content
for line in faq:
    if line.strip().isupper():
        # Create a new page for the header
        pdf_canvas.showPage()
        y = 800
        previous_line_was_header = True
    else:
        if previous_line_was_header:
            # Move up one line before writing the content
            y -= line_spacing
            previous_line_was_header = False

        if len(line) > max_characters:
            # Split line into multiple lines
            lines = [line[i:i + max_characters] for i in range(0, len(line), max_characters)]
            for l in lines:
                pdf_canvas.drawString(x, y, l.strip())
                y -= line_spacing
        else:
            pdf_canvas.drawString(x, y, line.strip())
            y -= line_spacing

# Save the PDF file
pdf_canvas.save()

print("FAQ saved to faq.pdf")

