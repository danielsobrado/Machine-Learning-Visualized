import{m as s,k as e}from"./react-vendor-BeqvafmB.js";import{a1 as m,bg as p,C as g,n as u,R as x,G as b,W as f}from"./icons-DzQWnmqB.js";function h(){const[t,n]=s.useState("load"),[a,r]=s.useState(null),d=(i,o)=>{navigator.clipboard.writeText(i),r(o),setTimeout(()=>r(null),2e3)},l=[{id:"load",label:"Load GloVe",icon:m},{id:"use",label:"Use Embeddings",icon:p},{id:"train",label:"Train Custom",icon:g},{id:"visualize",label:"Visualization",icon:u}],c={load:[{title:"Load Pre-trained GloVe (Manual)",code:`import numpy as np

def load_glove_embeddings(glove_file):
    """Load GloVe vectors from file."""
    embeddings = {}
    with open(glove_file, 'r', encoding='utf-8') as f:
        for line in f:
            values = line.split()
            word = values[0]
            vector = np.asarray(values[1:], dtype='float32')
            embeddings[word] = vector
    return embeddings

# Download from: https://nlp.stanford.edu/projects/glove/
# glove.6B.zip contains 50d, 100d, 200d, 300d vectors
glove = load_glove_embeddings('glove.6B.100d.txt')

print(f"Loaded {len(glove)} words")
print(f"Vector size: {len(glove['the'])}")
print(f"'king' vector (first 5 dims): {glove['king'][:5]}")`},{title:"Load GloVe via Gensim",code:`from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors

# Convert GloVe format to Word2Vec format
glove_file = 'glove.6B.100d.txt'
word2vec_file = 'glove.6B.100d.word2vec.txt'
glove2word2vec(glove_file, word2vec_file)

# Load using Gensim (can now use familiar API)
model = KeyedVectors.load_word2vec_format(word2vec_file, binary=False)

# Use like Word2Vec
print(model.most_similar('king', topn=5))
print(model['computer'][:5])`},{title:"Load via Hugging Face / Torchtext",code:`# Using torchtext (PyTorch)
import torchtext
from torchtext.vocab import GloVe

# Download and cache GloVe embeddings
glove = GloVe(name='6B', dim=100)  # Options: 6B, 42B, 840B, twitter.27B

# Get vector for a word
king_vector = glove['king']
print(f"Shape: {king_vector.shape}")

# Get vectors for multiple words
words = ['king', 'queen', 'man', 'woman']
vectors = glove.get_vecs_by_tokens(words)
print(f"Batch shape: {vectors.shape}")

# Using spacy (alternative)
# python -m spacy download en_core_web_md
import spacy
nlp = spacy.load('en_core_web_md')  # Contains GloVe vectors
doc = nlp("king queen")
print(doc[0].vector.shape)  # (300,)`}],use:[{title:"Word Similarity",code:`import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def similarity(word1, word2, embeddings):
    """Compute cosine similarity between two words."""
    vec1 = embeddings[word1].reshape(1, -1)
    vec2 = embeddings[word2].reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]

def most_similar(word, embeddings, n=5):
    """Find most similar words."""
    if word not in embeddings:
        return []

    target = embeddings[word]
    similarities = []

    for w, vec in embeddings.items():
        if w != word:
            sim = np.dot(target, vec) / (np.linalg.norm(target) * np.linalg.norm(vec))
            similarities.append((w, sim))

    return sorted(similarities, key=lambda x: x[1], reverse=True)[:n]

# Usage
print(f"king-queen similarity: {similarity('king', 'queen', glove):.4f}")
print(f"king-car similarity: {similarity('king', 'car', glove):.4f}")
print("\\nMost similar to 'computer':")
for word, score in most_similar('computer', glove):
    print(f"  {word}: {score:.4f}")`},{title:"Word Analogies",code:`import numpy as np

def analogy(a, b, c, embeddings, n=5):
    """
    Find word d such that a:b :: c:d
    (a is to b as c is to d)

    Example: king:queen :: man:woman
    analogy('king', 'queen', 'man') → 'woman'
    """
    # d ≈ b - a + c
    vec = embeddings[b] - embeddings[a] + embeddings[c]

    # Find closest words (excluding a, b, c)
    exclude = {a, b, c}
    similarities = []

    for word, emb in embeddings.items():
        if word not in exclude:
            sim = np.dot(vec, emb) / (np.linalg.norm(vec) * np.linalg.norm(emb))
            similarities.append((word, sim))

    return sorted(similarities, key=lambda x: x[1], reverse=True)[:n]

# Classic analogies
print("king - man + woman =", analogy('king', 'man', 'woman', glove)[0])
print("paris - france + italy =", analogy('paris', 'france', 'italy', glove)[0])
print("bigger - big + small =", analogy('bigger', 'big', 'small', glove)[0])`},{title:"Use in Neural Network (PyTorch)",code:`import torch
import torch.nn as nn
import numpy as np

def create_embedding_layer(embeddings, vocab, freeze=True):
    """Create PyTorch embedding layer from GloVe."""
    embedding_dim = len(list(embeddings.values())[0])
    vocab_size = len(vocab)

    # Initialize with random vectors
    weights = np.random.randn(vocab_size, embedding_dim) * 0.01

    # Fill in GloVe vectors for known words
    for i, word in enumerate(vocab):
        if word in embeddings:
            weights[i] = embeddings[word]

    embedding = nn.Embedding(vocab_size, embedding_dim)
    embedding.weight = nn.Parameter(torch.FloatTensor(weights))

    if freeze:
        embedding.weight.requires_grad = False

    return embedding

# Example usage in a text classifier
class TextClassifier(nn.Module):
    def __init__(self, glove_embeddings, vocab, num_classes):
        super().__init__()
        self.embedding = create_embedding_layer(glove_embeddings, vocab, freeze=True)
        self.lstm = nn.LSTM(100, 128, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(256, num_classes)

    def forward(self, x):
        x = self.embedding(x)  # (batch, seq_len, 100)
        _, (h, _) = self.lstm(x)
        h = torch.cat([h[-2], h[-1]], dim=1)  # Concat bidirectional
        return self.fc(h)`}],train:[{title:"Train GloVe from Scratch (mittens)",code:`# Install: pip install mittens
from mittens import GloVe, Mittens
from collections import Counter
import numpy as np

# Build co-occurrence matrix from corpus
def build_cooccurrence(corpus, window_size=5):
    """Build word-word co-occurrence matrix."""
    # Get vocabulary
    words = [w for doc in corpus for w in doc.lower().split()]
    vocab = list(set(words))
    word2idx = {w: i for i, w in enumerate(vocab)}

    # Count co-occurrences
    cooc = np.zeros((len(vocab), len(vocab)))

    for doc in corpus:
        tokens = doc.lower().split()
        for i, word in enumerate(tokens):
            for j in range(max(0, i - window_size),
                           min(len(tokens), i + window_size + 1)):
                if i != j:
                    cooc[word2idx[word]][word2idx[tokens[j]]] += 1

    return cooc, vocab

# Sample corpus
corpus = [
    "the cat sat on the mat",
    "the dog sat on the log",
    "cats and dogs are pets",
    "the mat is on the floor"
]

cooc_matrix, vocab = build_cooccurrence(corpus)

# Train GloVe
glove = GloVe(n=50, max_iter=100)  # 50-dim vectors
embeddings = glove.fit(cooc_matrix)

# Create word->vector dictionary
word_vectors = {vocab[i]: embeddings[i] for i in range(len(vocab))}
print(f"Trained {len(word_vectors)} word vectors")`},{title:"Fine-tune GloVe (Mittens)",code:`from mittens import Mittens
import numpy as np

# Mittens: retrofit pre-trained GloVe on domain corpus
# Great for adapting to specialized vocabulary

# Load pre-trained GloVe
pretrained = load_glove_embeddings('glove.6B.100d.txt')

# Your domain corpus (e.g., medical, legal, scientific)
domain_corpus = [
    "the patient presented with acute symptoms",
    "diagnosis revealed chronic inflammation",
    "treatment included antibiotics and rest",
    # ... more domain-specific text
]

# Build co-occurrence from domain corpus
cooc_matrix, vocab = build_cooccurrence(domain_corpus)

# Extract pre-trained vectors for vocab (or random for OOV)
initial_embeddings = np.zeros((len(vocab), 100))
for i, word in enumerate(vocab):
    if word in pretrained:
        initial_embeddings[i] = pretrained[word]
    else:
        initial_embeddings[i] = np.random.randn(100) * 0.1

# Fine-tune with Mittens
mittens = Mittens(n=100, max_iter=100)
new_embeddings = mittens.fit(
    cooc_matrix,
    vocab=vocab,
    initial_embedding_dict=pretrained
)

print("Fine-tuned embeddings for domain vocabulary!")`}],visualize:[{title:"Visualize with t-SNE",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE

def visualize_embeddings(words, embeddings, perplexity=5):
    """Visualize word embeddings in 2D using t-SNE."""
    # Get vectors for selected words
    vectors = np.array([embeddings[w] for w in words if w in embeddings])
    valid_words = [w for w in words if w in embeddings]

    # Reduce to 2D
    tsne = TSNE(n_components=2, perplexity=perplexity, random_state=42)
    reduced = tsne.fit_transform(vectors)

    # Plot
    plt.figure(figsize=(12, 8))
    plt.scatter(reduced[:, 0], reduced[:, 1], alpha=0.6)

    for i, word in enumerate(valid_words):
        plt.annotate(word, (reduced[i, 0], reduced[i, 1]), fontsize=9)

    plt.title('GloVe Word Embeddings (t-SNE)')
    plt.xlabel('Dimension 1')
    plt.ylabel('Dimension 2')
    plt.tight_layout()
    plt.savefig('glove_tsne.png', dpi=150)
    plt.show()

# Visualize semantic clusters
words = [
    # Royalty
    'king', 'queen', 'prince', 'princess', 'royal',
    # Animals
    'dog', 'cat', 'horse', 'cow', 'bird',
    # Countries
    'france', 'germany', 'italy', 'spain', 'england',
    # Verbs
    'run', 'walk', 'jump', 'swim', 'fly'
]

visualize_embeddings(words, glove)`},{title:"Analogy Visualization",code:`import numpy as np
import matplotlib.pyplot as plt

def visualize_analogy(a, b, c, d, embeddings):
    """Visualize word analogy relationships."""
    # Get vectors
    words = [a, b, c, d]
    vecs = np.array([embeddings[w] for w in words])

    # Use PCA for 2D
    from sklearn.decomposition import PCA
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(vecs)

    # Plot
    fig, ax = plt.subplots(figsize=(10, 8))

    # Plot points
    colors = ['#8B5CF6', '#8B5CF6', '#06B6D4', '#06B6D4']
    for i, (word, color) in enumerate(zip(words, colors)):
        ax.scatter(reduced[i, 0], reduced[i, 1], c=color, s=200, zorder=5)
        ax.annotate(word, (reduced[i, 0], reduced[i, 1]), fontsize=14,
                    ha='center', va='bottom', fontweight='bold')

    # Draw relationship arrows
    ax.annotate('', xy=reduced[1], xytext=reduced[0],
                arrowprops=dict(arrowstyle='->', color='#8B5CF6', lw=2))
    ax.annotate('', xy=reduced[3], xytext=reduced[2],
                arrowprops=dict(arrowstyle='->', color='#06B6D4', lw=2))

    # Draw parallel lines
    ax.plot([reduced[0, 0], reduced[2, 0]], [reduced[0, 1], reduced[2, 1]],
            '--', color='gray', alpha=0.5)
    ax.plot([reduced[1, 0], reduced[3, 0]], [reduced[1, 1], reduced[3, 1]],
            '--', color='gray', alpha=0.5)

    ax.set_title(f'Analogy: {a} → {b} :: {c} → {d}', fontsize=14)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('analogy.png', dpi=150)
    plt.show()

# Visualize king:queen :: man:woman
visualize_analogy('king', 'queen', 'man', 'woman', glove)`}]};return e.jsxs("div",{className:"space-y-6 pb-20",children:[e.jsxs("div",{className:"text-center",children:[e.jsxs("h2",{className:"text-3xl font-bold mb-2",children:[e.jsx("span",{className:"gradient-text",children:"Python"})," Code Examples"]}),e.jsx("p",{className:"text-gray-800",children:"Load, use, and train GloVe embeddings"})]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-2",children:l.map(i=>{const o=i.icon;return e.jsxs("button",{onClick:()=>n(i.id),className:`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${t===i.id?"bg-violet-600 text-white":"bg-white/10 text-gray-800 hover:bg-white/20"}`,children:[e.jsx(o,{size:16}),i.label]},i.id)})}),e.jsx("div",{className:"space-y-6",children:c[t].map((i,o)=>e.jsxs("div",{className:"bg-black/30 rounded-xl border border-white/10 overflow-hidden",children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10",children:[e.jsxs("span",{className:"flex items-center gap-2 text-violet-400 font-medium",children:[e.jsx(x,{size:16}),i.title]}),e.jsx("button",{onClick:()=>d(i.code,o),className:"flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors",children:a===o?e.jsxs(e.Fragment,{children:[e.jsx(b,{size:14,className:"text-green-400"}),"Copied"]}):e.jsxs(e.Fragment,{children:[e.jsx(f,{size:14}),"Copy"]})})]}),e.jsx("pre",{className:"p-4 overflow-x-auto text-sm",children:e.jsx("code",{className:"text-gray-700 mono",children:i.code})})]},o))}),e.jsxs("div",{className:"bg-gradient-to-r from-violet-900/20 to-cyan-900/20 rounded-xl p-6 border border-violet-500/30",children:[e.jsx("h4",{className:"text-lg font-bold text-violet-400 mb-4",children:"📦 Quick Install Commands"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium text-sm mb-1",children:"Core Libraries"}),e.jsx("code",{className:"text-xs text-gray-800",children:"pip install numpy gensim scikit-learn"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium text-sm mb-1",children:"Visualization"}),e.jsx("code",{className:"text-xs text-gray-800",children:"pip install matplotlib seaborn"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium text-sm mb-1",children:"Training GloVe"}),e.jsx("code",{className:"text-xs text-gray-800",children:"pip install mittens"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium text-sm mb-1",children:"PyTorch Integration"}),e.jsx("code",{className:"text-xs text-gray-800",children:"pip install torch torchtext"})]})]})]}),e.jsxs("div",{className:"bg-black/30 rounded-xl p-6 border border-white/10",children:[e.jsx("h4",{className:"text-lg font-bold text-violet-400 mb-4",children:"🔗 Download Pre-trained GloVe"}),e.jsxs("p",{className:"text-gray-700 mb-4 text-sm",children:["Download from Stanford NLP: ",e.jsx("a",{href:"https://nlp.stanford.edu/projects/glove/",target:"_blank",rel:"noopener noreferrer",className:"text-violet-400 hover:underline",children:"nlp.stanford.edu/projects/glove/"})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-3 text-sm",children:[e.jsxs("div",{className:"bg-white/5 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium",children:"glove.6B.zip (822 MB)"}),e.jsx("p",{className:"text-gray-700",children:"Wikipedia 2014 + Gigaword 5"}),e.jsx("p",{className:"text-gray-700",children:"50d, 100d, 200d, 300d"})]}),e.jsxs("div",{className:"bg-white/5 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium",children:"glove.42B.300d.zip (1.9 GB)"}),e.jsx("p",{className:"text-gray-700",children:"Common Crawl (42B tokens)"}),e.jsx("p",{className:"text-gray-700",children:"300d vectors only"})]}),e.jsxs("div",{className:"bg-white/5 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium",children:"glove.840B.300d.zip (2.0 GB)"}),e.jsx("p",{className:"text-gray-700",children:"Common Crawl (840B tokens)"}),e.jsx("p",{className:"text-gray-700",children:"300d vectors only"})]}),e.jsxs("div",{className:"bg-white/5 rounded-lg p-3",children:[e.jsx("p",{className:"text-cyan-600 font-medium",children:"glove.twitter.27B.zip (1.4 GB)"}),e.jsx("p",{className:"text-gray-700",children:"Twitter (27B tokens)"}),e.jsx("p",{className:"text-gray-700",children:"25d, 50d, 100d, 200d"})]})]})]})]})}export{h as default};
