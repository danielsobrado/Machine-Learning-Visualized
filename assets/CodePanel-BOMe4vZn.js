import{m as a,k as e}from"./react-vendor-BeqvafmB.js";import{P as m,F as c,U as p}from"./icons-DpLmz3K_.js";function w(){const[s,n]=a.useState("gensim"),[d,r]=a.useState(null),l=(t,o)=>{navigator.clipboard.writeText(t),r(o),setTimeout(()=>r(null),2e3)},i={gensim:{title:"Gensim",description:"Most popular library for Word2Vec in Python",codes:[{title:"Train Word2Vec from Scratch",code:`from gensim.models import Word2Vec

# Sample corpus (list of tokenized sentences)
sentences = [
    ["the", "quick", "brown", "fox", "jumps"],
    ["the", "lazy", "dog", "sleeps"],
    ["the", "fox", "and", "dog", "are", "friends"],
    ["quick", "brown", "foxes", "jump", "high"],
]

# Train Skip-gram model
model = Word2Vec(
    sentences=sentences,
    vector_size=100,     # Embedding dimension
    window=5,            # Context window size
    min_count=1,         # Ignore words with freq < min_count
    sg=1,                # 1 = Skip-gram, 0 = CBOW
    workers=4,           # Parallel training threads
    epochs=10,           # Training iterations
)

# Get word vector
fox_vector = model.wv['fox']
print(f"Vector shape: {fox_vector.shape}")
print(f"First 5 dims: {fox_vector[:5]}")

# Find similar words
similar = model.wv.most_similar('fox', topn=5)
print("\\nMost similar to 'fox':")
for word, score in similar:
    print(f"  {word}: {score:.4f}")`},{title:"Word Analogies & Arithmetic",code:`from gensim.models import Word2Vec

# Load or train a model
model = Word2Vec.load("word2vec.model")  # Or train new one

# Word similarity
similarity = model.wv.similarity('dog', 'cat')
print(f"dog-cat similarity: {similarity:.4f}")

# Word analogies: king - man + woman = ?
# positive: words to add
# negative: words to subtract
result = model.wv.most_similar(
    positive=['king', 'woman'],
    negative=['man'],
    topn=3
)
print("\\nking - man + woman ≈")
for word, score in result:
    print(f"  {word}: {score:.4f}")

# Another analogy: Paris - France + Germany = ?
result = model.wv.most_similar(
    positive=['paris', 'germany'],
    negative=['france'],
    topn=3
)
print("\\nparis - france + germany ≈")
for word, score in result:
    print(f"  {word}: {score:.4f}")

# Doesn't match (odd one out)
odd = model.wv.doesnt_match(['cat', 'dog', 'bird', 'computer'])
print(f"\\nOdd one out: {odd}")`},{title:"Load Pre-trained Embeddings",code:`import gensim.downloader as api

# Download pre-trained Google News Word2Vec (3 billion words)
# Warning: This is ~1.6GB!
model = api.load('word2vec-google-news-300')

# Use it just like a trained model
print("Vector for 'computer':", model['computer'][:5])

# Analogies work better with more data
result = model.most_similar(
    positive=['king', 'woman'],
    negative=['man'],
    topn=1
)
print(f"\\nking - man + woman = {result[0][0]}")

# Other pre-trained models available:
# - glove-wiki-gigaword-100
# - glove-wiki-gigaword-200
# - glove-twitter-100
# - fasttext-wiki-news-subwords-300

# List all available models
print("\\nAvailable models:", list(api.info()['models'].keys())[:5])`},{title:"Save and Load Models",code:`from gensim.models import Word2Vec, KeyedVectors

# --- Save Options ---

# Option 1: Save full model (can continue training)
model.save("word2vec.model")

# Option 2: Save just the vectors (smaller file)
model.wv.save("word2vec.wordvectors")

# Option 3: Save in word2vec text format
model.wv.save_word2vec_format("word2vec.txt", binary=False)

# Option 4: Save in word2vec binary format (smaller)
model.wv.save_word2vec_format("word2vec.bin", binary=True)

# --- Load Options ---

# Load full model
model = Word2Vec.load("word2vec.model")

# Load just vectors (KeyedVectors)
wv = KeyedVectors.load("word2vec.wordvectors")

# Load word2vec format
wv = KeyedVectors.load_word2vec_format("word2vec.txt")
wv = KeyedVectors.load_word2vec_format("word2vec.bin", binary=True)

# Use loaded vectors
print(wv.most_similar('computer', topn=3))`}]},tensorflow:{title:"TensorFlow",description:"Low-level implementation with TensorFlow",codes:[{title:"Skip-gram with TensorFlow",code:`import tensorflow as tf
import numpy as np

# Hyperparameters
VOCAB_SIZE = 10000
EMBEDDING_DIM = 128
WINDOW_SIZE = 2
NUM_NEGATIVE_SAMPLES = 5

# Build Skip-gram model
class Word2Vec(tf.keras.Model):
    def __init__(self, vocab_size, embedding_dim, num_ns):
        super().__init__()
        self.target_embedding = tf.keras.layers.Embedding(
            vocab_size, embedding_dim,
            name="target_embedding"
        )
        self.context_embedding = tf.keras.layers.Embedding(
            vocab_size, embedding_dim,
            name="context_embedding"
        )
        self.dots = tf.keras.layers.Dot(axes=(3, 2))
        self.flatten = tf.keras.layers.Flatten()

    def call(self, pair):
        target, context = pair
        # Get embeddings
        target_emb = self.target_embedding(target)
        context_emb = self.context_embedding(context)
        # Dot product
        dots = self.dots([context_emb, target_emb])
        return self.flatten(dots)

# Create model
model = Word2Vec(VOCAB_SIZE, EMBEDDING_DIM, NUM_NEGATIVE_SAMPLES)
model.compile(
    optimizer='adam',
    loss=tf.keras.losses.CategoricalCrossentropy(from_logits=True)
)

# After training, extract embeddings
word_embeddings = model.target_embedding.get_weights()[0]`},{title:"Generate Training Data",code:`import tensorflow as tf

def generate_training_data(sequences, window_size, num_ns, vocab_size, seed=42):
    """Generate skip-gram training pairs with negative sampling"""

    targets, contexts, labels = [], [], []

    # Build sampling table for negative sampling
    sampling_table = tf.keras.preprocessing.sequence.make_sampling_table(
        vocab_size
    )

    for sequence in sequences:
        # Generate positive skip-gram pairs
        positive_pairs, _ = tf.keras.preprocessing.sequence.skipgrams(
            sequence,
            vocabulary_size=vocab_size,
            sampling_table=sampling_table,
            window_size=window_size,
            negative_samples=0  # Handle separately
        )

        for target_word, context_word in positive_pairs:
            context_class = tf.expand_dims(
                tf.constant([context_word], dtype="int64"), 1
            )

            # Negative sampling
            negative_samples, _, _ = tf.random.log_uniform_candidate_sampler(
                true_classes=context_class,
                num_true=1,
                num_sampled=num_ns,
                unique=True,
                range_max=vocab_size,
                seed=seed
            )

            # Build context: 1 positive + num_ns negatives
            context = tf.concat([
                tf.squeeze(context_class, 1), negative_samples
            ], 0)

            # Labels: 1 for positive, 0 for negatives
            label = tf.constant([1] + [0] * num_ns, dtype="int64")

            targets.append(target_word)
            contexts.append(context)
            labels.append(label)

    return targets, contexts, labels`}]},pytorch:{title:"PyTorch",description:"Word2Vec implementation with PyTorch",codes:[{title:"Skip-gram Model",code:`import torch
import torch.nn as nn
import torch.optim as optim
from collections import Counter
import numpy as np

class SkipGram(nn.Module):
    def __init__(self, vocab_size, embedding_dim):
        super(SkipGram, self).__init__()
        # Target word embedding
        self.target_embeddings = nn.Embedding(vocab_size, embedding_dim)
        # Context word embedding
        self.context_embeddings = nn.Embedding(vocab_size, embedding_dim)

        # Initialize weights
        self.target_embeddings.weight.data.uniform_(-0.5/embedding_dim, 0.5/embedding_dim)
        self.context_embeddings.weight.data.uniform_(-0.5/embedding_dim, 0.5/embedding_dim)

    def forward(self, target_word, context_word, negative_words):
        # Get embeddings
        target_emb = self.target_embeddings(target_word)  # [batch, emb_dim]
        context_emb = self.context_embeddings(context_word)  # [batch, emb_dim]
        neg_emb = self.context_embeddings(negative_words)  # [batch, num_neg, emb_dim]

        # Positive score: dot product
        pos_score = torch.sum(target_emb * context_emb, dim=1)  # [batch]
        pos_score = torch.clamp(pos_score, max=10, min=-10)
        pos_loss = -torch.log(torch.sigmoid(pos_score) + 1e-10)

        # Negative score
        neg_score = torch.bmm(neg_emb, target_emb.unsqueeze(2)).squeeze()  # [batch, num_neg]
        neg_score = torch.clamp(neg_score, max=10, min=-10)
        neg_loss = -torch.sum(torch.log(torch.sigmoid(-neg_score) + 1e-10), dim=1)

        return torch.mean(pos_loss + neg_loss)

# Training loop
model = SkipGram(vocab_size=10000, embedding_dim=100)
optimizer = optim.Adam(model.parameters(), lr=0.001)

for epoch in range(epochs):
    for target, context, negatives in dataloader:
        optimizer.zero_grad()
        loss = model(target, context, negatives)
        loss.backward()
        optimizer.step()

# Get learned embeddings
embeddings = model.target_embeddings.weight.data.numpy()`},{title:"CBOW Model",code:`import torch
import torch.nn as nn

class CBOW(nn.Module):
    def __init__(self, vocab_size, embedding_dim, context_size):
        super(CBOW, self).__init__()
        self.embeddings = nn.Embedding(vocab_size, embedding_dim)
        self.linear = nn.Linear(embedding_dim, vocab_size)
        self.context_size = context_size

    def forward(self, context_words):
        # context_words: [batch, 2*context_size]

        # Get embeddings for all context words
        embeds = self.embeddings(context_words)  # [batch, 2*ctx, emb_dim]

        # Average the embeddings
        avg_embed = torch.mean(embeds, dim=1)  # [batch, emb_dim]

        # Project to vocabulary
        out = self.linear(avg_embed)  # [batch, vocab_size]

        return out

# Training with CrossEntropyLoss
model = CBOW(vocab_size=10000, embedding_dim=100, context_size=2)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters())

for epoch in range(epochs):
    for context, target in dataloader:
        optimizer.zero_grad()
        output = model(context)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()`}]},analysis:{title:"Analysis & Visualization",description:"Analyze and visualize word embeddings",codes:[{title:"Visualize with t-SNE",code:`from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import numpy as np

def visualize_embeddings(model, words, perplexity=30):
    """Visualize word embeddings in 2D using t-SNE"""

    # Get vectors for selected words
    vectors = np.array([model.wv[word] for word in words])

    # Reduce to 2D
    tsne = TSNE(n_components=2, perplexity=perplexity, random_state=42)
    vectors_2d = tsne.fit_transform(vectors)

    # Plot
    plt.figure(figsize=(12, 10))
    plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], alpha=0)

    for i, word in enumerate(words):
        plt.annotate(
            word,
            xy=(vectors_2d[i, 0], vectors_2d[i, 1]),
            fontsize=12,
            alpha=0.8
        )

    plt.title('Word Embeddings Visualization (t-SNE)')
    plt.xlabel('Dimension 1')
    plt.ylabel('Dimension 2')
    plt.tight_layout()
    plt.savefig('word_embeddings.png', dpi=150)
    plt.show()

# Usage
words_to_plot = [
    'king', 'queen', 'prince', 'princess',
    'man', 'woman', 'boy', 'girl',
    'dog', 'cat', 'puppy', 'kitten',
    'paris', 'france', 'berlin', 'germany'
]
visualize_embeddings(model, words_to_plot)`},{title:"Evaluate Analogies",code:`def evaluate_analogy(model, analogy_file):
    """Evaluate model on analogy tasks"""

    correct = 0
    total = 0

    with open(analogy_file, 'r') as f:
        for line in f:
            if line.startswith(':'):  # Section header
                continue

            words = line.strip().lower().split()
            if len(words) != 4:
                continue

            a, b, c, expected = words

            # Skip if any word not in vocabulary
            if not all(w in model.wv for w in [a, b, c, expected]):
                continue

            # Predict: a - b + c = ?
            try:
                predicted = model.wv.most_similar(
                    positive=[a, c],
                    negative=[b],
                    topn=1
                )[0][0]

                if predicted == expected:
                    correct += 1
                total += 1
            except:
                continue

    accuracy = correct / total if total > 0 else 0
    print(f"Analogy accuracy: {accuracy:.2%} ({correct}/{total})")
    return accuracy

# Google analogy test set
# Download from: https://raw.githubusercontent.com/nicholas-leonard/word2vec/master/questions-words.txt
evaluate_analogy(model, 'questions-words.txt')`},{title:"Semantic Similarity Analysis",code:`from scipy.stats import spearmanr
import numpy as np

def analyze_similarity(model, word_pairs):
    """Compute cosine similarities for word pairs"""

    results = []
    for w1, w2 in word_pairs:
        if w1 in model.wv and w2 in model.wv:
            sim = model.wv.similarity(w1, w2)
            results.append({
                'word1': w1,
                'word2': w2,
                'similarity': sim
            })

    return results

# Example word pairs
pairs = [
    ('happy', 'joyful'),
    ('happy', 'sad'),
    ('dog', 'cat'),
    ('dog', 'computer'),
    ('king', 'queen'),
    ('man', 'woman'),
]

results = analyze_similarity(model, pairs)
for r in results:
    print(f"{r['word1']:12} - {r['word2']:12}: {r['similarity']:.4f}")

# Cluster analysis
from sklearn.cluster import KMeans

def cluster_words(model, words, n_clusters=5):
    """Cluster words based on embedding similarity"""
    vectors = np.array([model.wv[w] for w in words if w in model.wv])
    valid_words = [w for w in words if w in model.wv]

    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    clusters = kmeans.fit_predict(vectors)

    # Group by cluster
    clustered = {}
    for word, cluster in zip(valid_words, clusters):
        if cluster not in clustered:
            clustered[cluster] = []
        clustered[cluster].append(word)

    return clustered`}]}};return e.jsxs("div",{className:"space-y-6 pb-20",children:[e.jsxs("div",{className:"text-center",children:[e.jsxs("h2",{className:"text-3xl font-bold mb-2",children:[e.jsx("span",{className:"text-cyan-600",children:"Python"})," Code Examples"]}),e.jsx("p",{className:"text-gray-800",children:"Implement and use Word2Vec with popular libraries"})]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-2",children:Object.entries(i).map(([t,o])=>e.jsx("button",{onClick:()=>n(t),className:`px-4 py-2 rounded-lg transition-all ${s===t?"bg-cyan-600 text-white":"bg-white/10 text-gray-800 hover:text-white"}`,children:o.title},t))}),e.jsx("div",{className:"text-center text-gray-800",children:i[s].description}),e.jsx("div",{className:"space-y-6",children:i[s].codes.map((t,o)=>e.jsxs("div",{className:"bg-black/40 rounded-xl border border-white/10 overflow-hidden",children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(m,{size:16,className:"text-cyan-600"}),e.jsx("span",{className:"font-medium text-white",children:t.title})]}),e.jsx("button",{onClick:()=>l(t.code,o),className:"flex items-center gap-1 px-2 py-1 text-sm text-gray-800 hover:text-white transition-colors",children:d===o?e.jsxs(e.Fragment,{children:[e.jsx(c,{size:14,className:"text-green-400"}),e.jsx("span",{className:"text-green-400",children:"Copied!"})]}):e.jsxs(e.Fragment,{children:[e.jsx(p,{size:14}),"Copy"]})})]}),e.jsx("pre",{className:"p-4 overflow-x-auto text-sm",children:e.jsx("code",{className:"text-green-300",children:t.code})})]},o))}),e.jsxs("div",{className:"bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-6 border border-cyan-500/30",children:[e.jsx("h4",{className:"font-bold text-cyan-600 mb-4",children:"📦 Quick Install Commands"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"Gensim (recommended)"}),e.jsx("code",{className:"text-sm",children:"pip install gensim"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"TensorFlow"}),e.jsx("code",{className:"text-sm",children:"pip install tensorflow"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"PyTorch"}),e.jsx("code",{className:"text-sm",children:"pip install torch"})]}),e.jsxs("div",{className:"bg-black/30 rounded-lg p-3",children:[e.jsx("p",{className:"text-sm text-gray-800 mb-2",children:"Visualization"}),e.jsx("code",{className:"text-sm",children:"pip install matplotlib scikit-learn"})]})]})]})]})}export{w as default};
