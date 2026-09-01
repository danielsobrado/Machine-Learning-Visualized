import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPanel() {
    const [query, setQuery] = useState('apple pie recipe');

    // Mock documents with TF-IDF style vectors (simplified)
    const documents = [
        {
            id: 1,
            title: 'How to Bake the Perfect Apple Pie',
            features: { apple: 10, pie: 10, recipe: 8, bake: 5, computer: 0, tech: 0, phone: 0 }
        },
        {
            id: 2,
            title: 'Apple Inc Company History',
            features: { apple: 8, pie: 0, recipe: 0, bake: 0, computer: 6, tech: 7, phone: 5 }
        },
        {
            id: 3,
            title: 'Classic Pie Recipes and Desserts',
            features: { apple: 3, pie: 9, recipe: 10, bake: 6, computer: 0, tech: 0, phone: 0 }
        },
        {
            id: 4,
            title: 'Smartphone Technology Review',
            features: { apple: 2, pie: 0, recipe: 0, bake: 0, computer: 5, tech: 10, phone: 9 }
        }
    ];

    // Simple query vector based on word presence
    const getQueryVector = (q) => {
        const words = q.toLowerCase().split(' ');
        return {
            apple: words.includes('apple') ? 10 : 0,
            pie: words.includes('pie') ? 10 : 0,
            recipe: words.includes('recipe') ? 10 : 0,
            bake: words.includes('bake') ? 10 : 0,
            computer: words.includes('computer') ? 10 : 0,
            tech: words.includes('tech') ? 10 : 0,
            phone: words.includes('phone') ? 10 : 0
        };
    };

    const calculateSimilarity = (docVec, queryVec) => {
        const dotProduct = Object.keys(docVec).reduce((sum, key) => sum + docVec[key] * queryVec[key], 0);
        const magDoc = Math.sqrt(Object.values(docVec).reduce((sum, val) => sum + val ** 2, 0));
        const magQuery = Math.sqrt(Object.values(queryVec).reduce((sum, val) => sum + val ** 2, 0));
        return magDoc === 0 || magQuery === 0 ? 0 : dotProduct / (magDoc * magQuery);
    };

    const queryVec = getQueryVector(query);

    // Calculate scores
    const results = documents.map(doc => ({
        ...doc,
        score: calculateSimilarity(doc.features, queryVec)
    })).sort((a, b) => b.score - a.score);

    // Prepare bar chart data
    const chartData = results.map(r => ({
        name: `Doc ${r.id}`,
        score: (r.score * 100).toFixed(1),
        fullTitle: r.title
    }));

    return (
        <div className="p-8 h-full flex flex-col items-center">
            <div className="max-w-3xl w-full text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    Search Engine
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                    How does Google rank pages? It calculates similarity between your query and billions of documents.
                </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-8">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-800" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your search query..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white text-lg focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                </div>
                <p className="text-xs text-slate-800 mt-2 text-center">
                    Try: "apple pie recipe", "apple computer", "tech phone", "bake"
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
                {/* Results Ranking */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-slate-700 mb-4 text-center">Search Results (Ranked by Similarity)</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                            <Tooltip
                                itemStyle={{ color: '#22d3ee' }}
                            />
                            <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : index === 1 ? '#a855f7' : '#64748b'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Document List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 mb-4">Document Previews</h3>
                    {results.map((doc, idx) => (
                        <div
                            key={doc.id}
                            className={`p-4 rounded-xl border-2 transition-all ${idx === 0
                                    ? 'bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 border-cyan-500 shadow-lg shadow-cyan-500/20'
                                    : idx === 1
                                        ? 'bg-purple-900/20 border-purple-700/50'
                                        : 'bg-slate-800/50 border-slate-700'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-2xl font-bold ${idx === 0 ? 'text-cyan-400' : idx === 1 ? 'text-purple-400' : 'text-slate-500'}`}>
                                        #{idx + 1}
                                    </span>
                                    <h4 className="font-bold text-slate-200">{doc.title}</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-800">Document {doc.id}</span>
                                <div className="text-right">
                                    <div className={`text-2xl font-mono font-bold ${idx === 0 ? 'text-cyan-400' : idx === 1 ? 'text-purple-400' : 'text-slate-400'}`}>
                                        {(doc.score * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-slate-700">Relevance</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
