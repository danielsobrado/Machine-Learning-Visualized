import{m as n,k as e}from"./react-vendor-BeqvafmB.js";import{O as l,E as m,S as p}from"./icons-1QYjeR5M.js";function x(){const[i,s]=n.useState("sklearn"),[c,a]=n.useState(null),d=(t,r)=>{navigator.clipboard.writeText(t),a(r),setTimeout(()=>a(null),2e3)},o={sklearn:{title:"scikit-learn",description:"Most common library for traditional ML in Python",codes:[{title:"Bag of Words with CountVectorizer",code:`from sklearn.feature_extraction.text import CountVectorizer

# Sample documents
documents = [
    "The cat sat on the mat",
    "The dog chased the cat",
    "The cat and the dog played"
]

# Create Bag of Words vectorizer
vectorizer = CountVectorizer()

# Fit and transform documents to BoW matrix
bow_matrix = vectorizer.fit_transform(documents)

# Get vocabulary (feature names)
print("Vocabulary:", vectorizer.get_feature_names_out())
# Output: ['and', 'cat', 'chased', 'dog', 'mat', 'on', 'played', 'sat', 'the']

# Convert to dense array and print
print("\\nBoW Matrix:")
print(bow_matrix.toarray())
# Each row = document, each column = word count

# Get word index mapping
print("\\nWord to Index:", vectorizer.vocabulary_)`},{title:"TF-IDF with TfidfVectorizer",code:`from sklearn.feature_extraction.text import TfidfVectorizer

documents = [
    "The cat sat on the mat",
    "The dog chased the cat",
    "The cat and the dog played"
]

# Create TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()

# Fit and transform
tfidf_matrix = tfidf_vectorizer.fit_transform(documents)

print("Vocabulary:", tfidf_vectorizer.get_feature_names_out())
print("\\nTF-IDF Matrix (dense):")
print(tfidf_matrix.toarray().round(3))

# Notice: 'the' has 0 weight (appears in all docs, IDF=0)

# Get IDF values for each term
idf_values = dict(zip(
    tfidf_vectorizer.get_feature_names_out(),
    tfidf_vectorizer.idf_
))
print("\\nIDF values:", {k: round(v, 3) for k, v in idf_values.items()})`},{title:"Text Classification Pipeline",code:`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Training data
texts = [
    "I love this movie, it's amazing!",
    "Great film, really enjoyed it",
    "Terrible movie, waste of time",
    "Awful, I hated every minute",
    "Best movie I've seen all year",
    "Boring and disappointing"
]
labels = [1, 1, 0, 0, 1, 0]  # 1=positive, 0=negative

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.3, random_state=42
)

# Create pipeline: TF-IDF → Naive Bayes
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        max_features=1000,      # Limit vocabulary size
        ngram_range=(1, 2),     # Include bigrams
        stop_words='english'    # Remove stop words
    )),
    ('classifier', MultinomialNB())
])

# Train
pipeline.fit(X_train, y_train)

# Predict
predictions = pipeline.predict(X_test)
print(classification_report(y_test, predictions))

# Predict on new text
new_text = ["This movie was absolutely fantastic!"]
print(f"Prediction: {'Positive' if pipeline.predict(new_text)[0] else 'Negative'}")`},{title:"Document Similarity with TF-IDF",code:`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

documents = [
    "Machine learning is a subset of artificial intelligence",
    "Deep learning uses neural networks for AI tasks",
    "The cat sat on the warm mat",
    "Artificial intelligence includes machine learning methods"
]

# Create TF-IDF vectors
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(documents)

# Calculate cosine similarity between all document pairs
similarity_matrix = cosine_similarity(tfidf_matrix)

print("Document Similarity Matrix:")
print(np.round(similarity_matrix, 3))

# Find most similar documents
def find_similar(doc_idx, n=2):
    scores = similarity_matrix[doc_idx]
    similar_idx = np.argsort(scores)[::-1][1:n+1]  # Exclude self
    return [(idx, scores[idx]) for idx in similar_idx]

print("\\nMost similar to Doc 0:")
for idx, score in find_similar(0):
    print(f"  Doc {idx} (similarity: {score:.3f}): {documents[idx][:50]}...")`}]},numpy:{title:"NumPy (From Scratch)",description:"Build BoW and TF-IDF from scratch",codes:[{title:"Bag of Words from Scratch",code:`import numpy as np
import re
from collections import Counter

def preprocess(text):
    """Lowercase and remove punctuation"""
    text = text.lower()
    text = re.sub(r'[^a-z\\s]', '', text)
    return text.split()

def build_vocabulary(documents):
    """Build vocabulary from all documents"""
    all_words = []
    for doc in documents:
        all_words.extend(preprocess(doc))
    return sorted(set(all_words))

def create_bow_vector(document, vocabulary):
    """Create BoW vector for a single document"""
    tokens = preprocess(document)
    counts = Counter(tokens)
    return np.array([counts.get(word, 0) for word in vocabulary])

def create_bow_matrix(documents):
    """Create BoW matrix for all documents"""
    vocab = build_vocabulary(documents)
    vectors = [create_bow_vector(doc, vocab) for doc in documents]
    return np.array(vectors), vocab

# Example usage
documents = [
    "The cat sat on the mat",
    "The dog chased the cat",
    "The cat and the dog played"
]

bow_matrix, vocab = create_bow_matrix(documents)

print("Vocabulary:", vocab)
print("\\nBoW Matrix:")
print(bow_matrix)`},{title:"TF-IDF from Scratch",code:`import numpy as np
import re
from collections import Counter

def preprocess(text):
    return re.sub(r'[^a-z\\s]', '', text.lower()).split()

def compute_tf(document, vocabulary):
    """Term Frequency: count / total words"""
    tokens = preprocess(document)
    counts = Counter(tokens)
    total = len(tokens)
    return np.array([counts.get(w, 0) / total for w in vocabulary])

def compute_idf(documents, vocabulary):
    """Inverse Document Frequency: log(N / df)"""
    N = len(documents)
    tokenized = [set(preprocess(doc)) for doc in documents]

    idf = []
    for word in vocabulary:
        df = sum(1 for doc_tokens in tokenized if word in doc_tokens)
        idf.append(np.log(N / df) if df > 0 else 0)
    return np.array(idf)

def compute_tfidf(documents):
    """Compute TF-IDF matrix"""
    # Build vocabulary
    all_words = []
    for doc in documents:
        all_words.extend(preprocess(doc))
    vocab = sorted(set(all_words))

    # Compute IDF once
    idf = compute_idf(documents, vocab)

    # Compute TF-IDF for each document
    tfidf_matrix = []
    for doc in documents:
        tf = compute_tf(doc, vocab)
        tfidf = tf * idf
        tfidf_matrix.append(tfidf)

    return np.array(tfidf_matrix), vocab, idf

# Example
documents = [
    "The cat sat on the mat",
    "The dog chased the cat",
    "The cat and the dog played"
]

tfidf_matrix, vocab, idf_values = compute_tfidf(documents)

print("Vocabulary:", vocab)
print("\\nIDF values:", dict(zip(vocab, np.round(idf_values, 3))))
print("\\nTF-IDF Matrix:")
print(np.round(tfidf_matrix, 3))`},{title:"Cosine Similarity from Scratch",code:`import numpy as np

def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two vectors"""
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)

    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot_product / (norm1 * norm2)

def pairwise_cosine_similarity(matrix):
    """Compute cosine similarity between all pairs of rows"""
    n_docs = matrix.shape[0]
    similarity = np.zeros((n_docs, n_docs))

    for i in range(n_docs):
        for j in range(n_docs):
            similarity[i, j] = cosine_similarity(matrix[i], matrix[j])

    return similarity

# Example with TF-IDF vectors
tfidf_matrix = np.array([
    [0.0, 0.4, 0.0, 0.0, 0.4, 0.4, 0.0, 0.4, 0.0],
    [0.0, 0.4, 0.5, 0.4, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 0.4, 0.0, 0.4, 0.0, 0.0, 0.5, 0.0, 0.0]
])

print("Pairwise Cosine Similarity:")
sim_matrix = pairwise_cosine_similarity(tfidf_matrix)
print(np.round(sim_matrix, 3))

# Find most similar documents
print("\\nDoc 0 is most similar to:", np.argmax(sim_matrix[0, 1:]) + 1)`}]},nltk:{title:"NLTK",description:"Natural Language Toolkit for advanced preprocessing",codes:[{title:"Advanced Preprocessing",code:`import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer

# Download required resources (run once)
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')

text = "The cats were running quickly through the beautiful gardens"

# Tokenization
tokens = word_tokenize(text.lower())
print("Tokens:", tokens)

# Remove stop words
stop_words = set(stopwords.words('english'))
filtered = [w for w in tokens if w not in stop_words and w.isalpha()]
print("After stopword removal:", filtered)

# Stemming (cuts words to root)
stemmer = PorterStemmer()
stemmed = [stemmer.stem(w) for w in filtered]
print("After stemming:", stemmed)

# Lemmatization (finds dictionary form)
lemmatizer = WordNetLemmatizer()
lemmatized = [lemmatizer.lemmatize(w) for w in filtered]
print("After lemmatization:", lemmatized)`},{title:"NLTK with sklearn Pipeline",code:`import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer

class LemmaTokenizer:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def __call__(self, doc):
        tokens = word_tokenize(doc.lower())
        return [
            self.lemmatizer.lemmatize(t)
            for t in tokens
            if t.isalpha() and t not in self.stop_words
        ]

# Create TF-IDF with custom tokenizer
vectorizer = TfidfVectorizer(tokenizer=LemmaTokenizer())

documents = [
    "The cats were running through gardens",
    "Dogs are chasing the running cats",
    "Beautiful gardens have many flowers"
]

tfidf_matrix = vectorizer.fit_transform(documents)

print("Vocabulary:", vectorizer.get_feature_names_out())
print("\\nTF-IDF Matrix:")
print(tfidf_matrix.toarray().round(3))`}]},spacy:{title:"spaCy",description:"Industrial-strength NLP library",codes:[{title:"spaCy Preprocessing",code:`import spacy

# Load English model (run: python -m spacy download en_core_web_sm)
nlp = spacy.load('en_core_web_sm')

text = "The cats were running quickly through the beautiful gardens"

# Process text
doc = nlp(text)

# Tokenization with POS tags
print("Token | Lemma | POS | Stop Word")
print("-" * 40)
for token in doc:
    print(f"{token.text:12} | {token.lemma_:12} | {token.pos_:6} | {token.is_stop}")

# Get clean tokens (lemmatized, no stopwords, no punctuation)
clean_tokens = [
    token.lemma_.lower()
    for token in doc
    if not token.is_stop and token.is_alpha
]
print("\\nClean tokens:", clean_tokens)`},{title:"spaCy Custom Vectorizer",code:`import spacy
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.feature_extraction.text import TfidfVectorizer

nlp = spacy.load('en_core_web_sm')

class SpacyTokenizer:
    def __call__(self, doc):
        parsed = nlp(doc)
        return [
            token.lemma_.lower()
            for token in parsed
            if not token.is_stop and token.is_alpha
        ]

# Use with sklearn
vectorizer = TfidfVectorizer(tokenizer=SpacyTokenizer())

documents = [
    "Machine learning algorithms are improving quickly",
    "Deep neural networks learned complex patterns",
    "The cat sat on the comfortable mat"
]

tfidf = vectorizer.fit_transform(documents)

print("Features:", vectorizer.get_feature_names_out())
print("\\nSparse TF-IDF shape:", tfidf.shape)

# Get document similarity
from sklearn.metrics.pairwise import cosine_similarity
sim = cosine_similarity(tfidf)
print("\\nDocument Similarity:")
print(sim.round(3))`}]}};return e.jsxs("div",{className:"space-y-6 pb-20",children:[e.jsxs("div",{className:"text-center",children:[e.jsxs("h2",{className:"text-3xl font-bold mb-2",children:[e.jsx("span",{className:"text-purple-600",children:"Python"})," Code Examples"]}),e.jsx("p",{className:"text-gray-800",children:"Implement BoW and TF-IDF with popular libraries"})]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-2",children:Object.entries(o).map(([t,r])=>e.jsx("button",{onClick:()=>s(t),className:`px-4 py-2 rounded-lg transition-all ${i===t?"bg-purple-600 text-white":"bg-white/10 text-gray-800 hover:text-white"}`,children:r.title},t))}),e.jsx("div",{className:"text-center text-gray-800",children:o[i].description}),e.jsx("div",{className:"space-y-6",children:o[i].codes.map((t,r)=>e.jsxs("div",{className:"bg-black/40 rounded-xl border border-white/10 overflow-hidden",children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(l,{size:16,className:"text-purple-600"}),e.jsx("span",{className:"font-medium text-white",children:t.title})]}),e.jsx("button",{onClick:()=>d(t.code,r),className:"flex items-center gap-1 px-2 py-1 text-sm text-gray-800 hover:text-white transition-colors",children:c===r?e.jsxs(e.Fragment,{children:[e.jsx(m,{size:14,className:"text-green-400"}),e.jsx("span",{className:"text-green-400",children:"Copied!"})]}):e.jsxs(e.Fragment,{children:[e.jsx(p,{size:14}),"Copy"]})})]}),e.jsx("pre",{className:"p-4 overflow-x-auto text-sm",children:e.jsx("code",{className:"text-green-300",children:t.code})})]},r))}),e.jsxs("div",{className:"bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30",children:[e.jsx("h4",{className:"font-bold text-purple-600 mb-4",children:"📦 Quick Install Commands"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"scikit-learn"}),e.jsx("code",{className:"text-sm",children:"pip install scikit-learn"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"NLTK"}),e.jsx("code",{className:"text-sm",children:"pip install nltk"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"spaCy"}),e.jsx("code",{className:"text-sm",children:"pip install spacy && python -m spacy download en_core_web_sm"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"All dependencies"}),e.jsx("code",{className:"text-sm",children:"pip install numpy pandas scikit-learn nltk spacy"})]})]})]})]})}export{x as default};
