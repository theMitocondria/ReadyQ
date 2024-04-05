from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

import os
import sys

import openai
from langchain.chains import ConversationalRetrievalChain, RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.llms import OpenAI
from langchain.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Enable to save to disk & reuse the model (for repeated queries on the same data)
PERSIST = "FALSE"

query = None
if len(sys.argv) > 1:
  query = sys.argv[1]

if PERSIST and os.path.exists("persist"):
  print("Reusing index...\n")
  vectorstore = Chroma(persist_directory="persist", embedding_function=OpenAIEmbeddings())
  index = VectorStoreIndexWrapper(vectorstore=vectorstore)
else:
  loader = TextLoader("1.txt") # Use this line if you only need data.txt
  # loader = DirectoryLoader("data/")
  print(loader)
  if PERSIST:
    index = VectorstoreIndexCreator(vectorstore_kwargs={"persist_directory":"persist"}).from_loaders([loader])
  else:
    index = VectorstoreIndexCreator().from_loaders([loader])

chain = ConversationalRetrievalChain.from_llm(
  llm=ChatOpenAI(model="gpt-3.5-turbo"),
  retriever=index.vectorstore.as_retriever(search_kwargs={"k": 1}),
)
chat_history = []

app = Flask(__name__)
CORS(app)
@app.route('/chatbot', methods=['POST'])
def process_data():
  print(chat_history)
  response= chain({"question": request.get_json()['message'] , "chat_history": chat_history})
  #return response['answer']
  return jsonify({'response': response['answer']})
if __name__ == '__main__':
    app.run(debug=True)
