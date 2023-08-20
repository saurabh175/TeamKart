from llama_index import SimpleDirectoryReader


def load_document():
    loader = SimpleDirectoryReader(
        'data', recursive=True, exclude_hidden=True)
    docs = loader.load_data()
    print(docs[0].text)
    return docs
