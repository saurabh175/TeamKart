import os 
from email.message import EmailMessage
import smtpd
import ssl 
import smtplib
email_sender = "arthbohra@gmail.com"
email_password = 'jjicwddtpzjpxlmi'
email_receiver = "saduri@berkeley.edu"
ssl._create_default_https_context = ssl._create_unverified_context


def message_send(body, recipient):
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = recipient
    em['Subject'] = "Check out Son of a Tailor!"
    em.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
        server.login(email_sender, email_password)
        server.sendmail(email_sender, recipient, em.as_string())
