import json
import requests
# import openai
# from openai.embeddings_utils import cosine_similarity
# # import matplotlib
# from langchain.embeddings import OpenAIEmbeddings
# embeddings = OpenAIEmbeddings(
#     openai_api_key="sk-d83f4bfe89msh2c35c0f026b5666p1bfa94jsnb9eba71c9060")
# openai.api_key = "sk-d83f4bfe89msh2c35c0f026b5666p1bfa94jsnb9eba71c9060"

base_url = "https://api.rapidapi.com/text-embeddings-api"

rapidapi_key = "YOUR_RAPIDAPI_KEY"
rapidapi_endpoint = "YOUR_RAPIDAPI_ENDPOINT"

previous_messages = []

def get_embeddings(text):
    headers = {
        "X-RapidAPI-Key": rapidapi_key,
        # Add any other required headers
    }
    params = {
        "text": text,
        # Add any other required parameters
    }
    
    response = requests.get(f"{base_url}/embeddings", headers=headers, params=params)
    if response.status_code == 200:
        embeddings = response.json()
        return embeddings
    else:
        print("Error:", response.status_code)
        return None

# def query(prompt):
#     completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=previous_messages + [
#                                               {"role": "user", "content": prompt}],  max_tokens=100, temperature=0.9)
#     completionText = completion.choices[0].message
#     print(completionText)
#     previous_messages.append({"role": "user", "content": prompt})
#     previous_messages.append({"role": "assistant", "content": completionText})
#     return completionText

def query(prompt):
    payload = {
        "messages": previous_messages + [{"role": "user", "content": prompt}],
        "model": "gpt-3.5-turbo",
        "max_tokens": 100,
        "temperature": 0.9,
    }
    
    headers = {
        "X-RapidAPI-Host": "gpt-chat.p.rapidapi.com",
        "X-RapidAPI-Key": rapidapi_key,
        "Content-Type": "application/json",
    }
    
    response = requests.post(rapidapi_endpoint, headers=headers, json=payload)
    response_data = response.json()
    completionText = response_data["choices"][0]["message"]["content"]
    
    print(completionText)
    previous_messages.append({"role": "user", "content": prompt})
    previous_messages.append({"role": "assistant", "content": completionText})
    return completionText

embeddings = get_embeddings()

def addInstructions():
    system_instructions = '''

You are a online shopping assistant with two tasks - answering questions about inventory and company policy or generating product bundles. 
Specifically, you are an online shopping assistant meant to guide users through the website of the company 'Son of a Tailor'.

It is your job to deduce whether the user is asking a question about the company's policy or is asking about potential products to buy.
For each case, follow the follow instructions respectively.

1. If the user is asking questions about the company's policies or general information
Answer the question using the company's FAQs data. 
Your response should follow the following format (under no circumstances should you recommend a product in this case):
FAQ Response: <response>
    
2. The user is looking for products to buy.
If you do not know the exact name of a product or it does not exist within the company's inventory, tell them that we do not offer it at the moment. Do not make up or reference products that are not directly from the data provided. 
Only provide the DKK and USD prices unless specified for a different currency.
Don't just build outfits based on your general knowledge - only base your oufits on the product list you were given. Don't make up the names of products that you don't have access to. We only sell tops. 
If a product has more than one color available, suggest a color but also say we have more colors.
Verify that the product bundles you are generating are adequate and are of the same type as the request being made and fit the appropriate criteria
If the user says some gibberish or something that is not a question or doesn't make sense, say that they have to clarify and you don't understand by saying I'm sorry, I don't understand. Could you please clarify what you are asking?
Keep your responses under 200 word. At the end of your response, list out each product that you chose from, why you chose that product, and confirm that the product was found in the list of products we inputted.
If the user provides you details about why they need something (region, reason, age), cater your results to this preference. 
        '''
    previous_messages.append(
        {"role": "system", "content": system_instructions})


def getProducts():
    products = []

    with open('data/output.json') as json_file:
        data = json.load(json_file)
        for p in data['body']:

            for color in p['Colors Available']:
                products.append("Title: " + color + " " + p['Title'] + "\nDescription: " + p['Description'] + "\nMaterial: " +
                                p['Colors Available'][color]['material'] +
                                "\nLink: " +
                                p['Colors Available'][color]['link']
                                + "\nImage Link: " + p['Colors Available'][color]['image link'] + "\n")
    return products


def process_text_file(file_path):
    with open(file_path, 'r',encoding="utf-8") as file:
        content = file.read()
        # Process the content as needed
        output_string = content.upper()  # Example: Convert the text to uppercase

    return output_string


def getEmbeddedProducts(products):
    embeds = {}
    faq_txt = process_text_file("faq.txt")
    faq_embeds = embeddings.embed_query(faq_txt)

    for p in products:
        embeds[p] = embeddings.embed_query(p)
    embeds['faq'] = embedFAQs()
    # export embeddings to a file
    with open('data/embeddings.json', 'w') as outfile:
        json.dump(embeds, outfile)

    with open('data/faq_embeddings.json', 'w') as outfile:
        json.dump(faq_embeds, outfile)

    return embeds


def findKNearestItems(query, k):

    embedding = embeddings.embed_query(query)
    products = getProducts()
    # create a dictionary with the product and the cosine similarity
    products_dict = {}
    with open('data/embeddings.json') as json_file:
        data = json.load(json_file)
        for p in data:
            products_dict[p] = cosine_similarity(data[p], embedding)

    sorted_products = sorted(products_dict.items(),
                             key=lambda x: x[1], reverse=True)
    # return the top k products
    return sorted_products[:k]


def buildPrompt(query):

    # create a string with the 10 nearest items ot the query
    nearest_string = ""

    for item in findKNearestItems(query, 10):
        nearest_string += item[0] + "\n"

    user_instructions = '''
    I want to shop from Son Of Tailor. 
    Here is my request: {query}
    
    Here are the ten best options I have found:
    {nearest_string}
    
    Out of these, what should I purchase?
    '''


# run this everytime you make a change to the embeddings
# getEmbeddedProducts(getProducts())
# kItems = findKNearestItems("I want a blue t-shirt", 10)


# for i in kItems:
#     print(i[0])

'''
llm = OpenAI(openai_api_key=op
'''

def embedFAQs():
    embeds = {}
    with open ('faq.txt') as faqs:
        faq = faqs.read()
        embedding = embeddings.embed_query(faq)
    embeds['faq'] = embedding
    with open('data/faq_embeddings.json', 'w') as outfile:
        json.dump(embeds, outfile)
    return embedding

getEmbeddedProducts(getProducts())


