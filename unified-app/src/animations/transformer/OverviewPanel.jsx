import React, { useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle, Eye, Lightbulb, Plus } from 'lucide-react';

const palette = {
    embedding: {
        background: 'rgba(38, 66, 115, 0.08)',
        border: '#264273',
        color: '#264273'
    },
    position: {
        background: 'rgba(168, 90, 58, 0.1)',
        border: '#a85a3a',
        color: '#7c3f27'
    },
    encoder: {
        background: 'rgba(58, 106, 58, 0.1)',
        border: '#4f7d39',
        color: '#2f5d2f'
    },
    decoder: {
        background: 'rgba(38, 66, 115, 0.06)',
        border: '#3a5a96',
        color: '#264273'
    },
    projection: {
        background: 'rgba(168, 90, 58, 0.12)',
        border: '#a85a3a',
        color: '#7c3f27'
    },
    cross: {
        background: '#fff8e6',
        border: '#d89b1f',
        color: '#6b4a0c'
    }
};

const panelStyle = {
    background: 'var(--ds-panel)',
    border: 'var(--ds-border)',
    borderRadius: 2
};

const tileStyle = (tone, active = false) => ({
    background: active ? tone.border : tone.background,
    border: `1px solid ${tone.border}`,
    color: active ? 'var(--ds-paper)' : tone.color,
    borderRadius: 2
});

const stackStyle = (tone, active = false) => ({
    background: active ? tone.background : 'transparent',
    border: `2px dashed ${tone.border}`,
    borderRadius: 2
});

export default function OverviewPanel() {
    const [hoveredComponent, setHoveredComponent] = useState(null);

    const components = {
        input_embedding: {
            name: 'Input Embedding',
            description: 'Converts input tokens to dense vectors with d_model dimensions.',
            tone: palette.embedding,
            details: 'Each token ID looks up a learned vector. With vocabulary size V and hidden size d, this is a V x d table.'
        },
        positional_encoding: {
            name: 'Positional Encoding',
            description: 'Adds order information so the model can tell where each token sits.',
            tone: palette.position,
            details: 'The original Transformer used sine and cosine waves at different frequencies, then added those values to token embeddings.'
        },
        encoder_stack: {
            name: 'Encoder Stack (N x)',
            description: 'Repeated encoder layers read the whole input sequence in parallel.',
            tone: palette.encoder,
            details: 'Each encoder layer runs self-attention, adds a residual connection, normalizes, applies a feed-forward network, then normalizes again.'
        },
        decoder_stack: {
            name: 'Decoder Stack (N x)',
            description: 'Repeated decoder layers generate the output sequence one token at a time.',
            tone: palette.decoder,
            details: 'The decoder uses masked self-attention for previous output tokens, cross-attention to read encoder states, and a feed-forward block.'
        },
        output_embedding: {
            name: 'Output Embedding',
            description: 'Represents already-generated target tokens before the decoder predicts the next one.',
            tone: palette.embedding,
            details: 'During training, shifted target tokens become decoder inputs. Many implementations share this table with the final vocabulary projection.'
        },
        linear_softmax: {
            name: 'Linear + Softmax',
            description: 'Projects decoder states to vocabulary scores and probabilities.',
            tone: palette.projection,
            details: 'A linear layer maps d_model to vocab_size logits. Softmax turns those logits into a probability distribution over next tokens.'
        }
    };

    const renderBlock = (children, tone, active, extraClass = '') => (
        <div
            className={`${extraClass} cursor-pointer transition-all ${active ? 'scale-105' : ''}`}
            style={tileStyle(tone, active)}
        >
            {children}
        </div>
    );

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h2
                        className="text-3xl mb-2"
                        style={{ color: 'var(--ds-ink)', fontFamily: 'var(--ds-font-serif)', fontWeight: 500 }}
                    >
                        The Transformer: Complete Architecture
                    </h2>
                    <p style={{ color: 'var(--ds-faint)' }}>
                        A sequence-to-sequence model built entirely on attention mechanisms
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="p-6" style={panelStyle}>
                        <h3 className="font-bold mb-4 text-center" style={{ color: 'var(--ds-ink)' }}>
                            Interactive Architecture
                        </h3>
                        <p className="text-center mb-4" style={{ color: 'var(--ds-faint)' }}>
                            Hover over each component to learn more
                        </p>

                        <div className="relative flex justify-center gap-8">
                            <div className="flex flex-col items-center gap-3">
                                <div className="font-medium mb-2" style={{ color: 'var(--ds-ink)' }}>ENCODER</div>

                                <div
                                    className={`relative w-32 h-40 p-2 cursor-pointer transition-all ${hoveredComponent === 'encoder_stack' ? 'scale-105' : ''}`}
                                    style={stackStyle(palette.encoder, hoveredComponent === 'encoder_stack')}
                                    onMouseEnter={() => setHoveredComponent('encoder_stack')}
                                    onMouseLeave={() => setHoveredComponent(null)}
                                >
                                    <div className="absolute -top-3 -right-3 text-xs px-2 py-0.5" style={tileStyle(palette.encoder)}>N x</div>
                                    <div className="h-full flex flex-col justify-around">
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.encoder)}>Multi-Head Attention</div>
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.encoder)}>Add & Norm</div>
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.encoder)}>Feed Forward</div>
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.encoder)}>Add & Norm</div>
                                    </div>
                                </div>

                                <ArrowDown style={{ color: 'var(--ds-faint)' }} size={20} />

                                <div
                                    onMouseEnter={() => setHoveredComponent('positional_encoding')}
                                    onMouseLeave={() => setHoveredComponent(null)}
                                >
                                    {renderBlock(
                                        <div className="flex items-center justify-center gap-1">
                                            <Plus size={12} />
                                            <span className="text-xs font-medium">Positional</span>
                                        </div>,
                                        palette.position,
                                        hoveredComponent === 'positional_encoding',
                                        'w-32 p-2'
                                    )}
                                </div>

                                <ArrowDown style={{ color: 'var(--ds-faint)' }} size={20} />

                                <div
                                    onMouseEnter={() => setHoveredComponent('input_embedding')}
                                    onMouseLeave={() => setHoveredComponent(null)}
                                >
                                    {renderBlock(
                                        <div className="text-xs text-center font-medium">Input Embedding</div>,
                                        palette.embedding,
                                        hoveredComponent === 'input_embedding',
                                        'w-32 p-3'
                                    )}
                                </div>

                                <ArrowDown style={{ color: 'var(--ds-faint)' }} size={20} />
                                <div style={{ color: 'var(--ds-ink)' }}>Inputs</div>
                            </div>

                            <div className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <ArrowRight size={32} style={{ color: 'var(--ds-warm)' }} />
                                    <span className="text-xs" style={{ color: 'var(--ds-faint)' }}>K, V</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <div className="font-medium mb-2" style={{ color: 'var(--ds-ink)' }}>DECODER</div>

                                <div
                                    onMouseEnter={() => setHoveredComponent('linear_softmax')}
                                    onMouseLeave={() => setHoveredComponent(null)}
                                >
                                    {renderBlock(
                                        <div className="text-xs text-center font-medium">Linear + Softmax</div>,
                                        palette.projection,
                                        hoveredComponent === 'linear_softmax',
                                        'w-32 p-2'
                                    )}
                                </div>

                                <ArrowDown style={{ color: 'var(--ds-faint)' }} className="rotate-180" size={20} />

                                <div
                                    className={`relative w-32 h-48 p-2 cursor-pointer transition-all ${hoveredComponent === 'decoder_stack' ? 'scale-105' : ''}`}
                                    style={stackStyle(palette.decoder, hoveredComponent === 'decoder_stack')}
                                    onMouseEnter={() => setHoveredComponent('decoder_stack')}
                                    onMouseLeave={() => setHoveredComponent(null)}
                                >
                                    <div className="absolute -top-3 -right-3 text-xs px-2 py-0.5" style={tileStyle(palette.decoder)}>N x</div>
                                    <div className="h-full flex flex-col justify-around">
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.decoder)}>Masked Self-Attn</div>
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.decoder)}>Add & Norm</div>
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.cross)}>Cross-Attention</div>
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.decoder)}>Add & Norm</div>
                                        <div className="p-1 text-xs text-center" style={tileStyle(palette.decoder)}>Feed Forward</div>
                                    </div>
                                </div>

                                <ArrowDown style={{ color: 'var(--ds-faint)' }} size={20} />

                                <div
                                    onMouseEnter={() => setHoveredComponent('positional_encoding')}
                                    onMouseLeave={() => setHoveredComponent(null)}
                                >
                                    {renderBlock(
                                        <div className="flex items-center justify-center gap-1">
                                            <Plus size={12} />
                                            <span className="text-xs font-medium">Positional</span>
                                        </div>,
                                        palette.position,
                                        hoveredComponent === 'positional_encoding',
                                        'w-32 p-2'
                                    )}
                                </div>

                                <ArrowDown style={{ color: 'var(--ds-faint)' }} size={20} />

                                <div
                                    onMouseEnter={() => setHoveredComponent('output_embedding')}
                                    onMouseLeave={() => setHoveredComponent(null)}
                                >
                                    {renderBlock(
                                        <div className="text-xs text-center font-medium">Output Embedding</div>,
                                        palette.embedding,
                                        hoveredComponent === 'output_embedding',
                                        'w-32 p-3'
                                    )}
                                </div>

                                <ArrowDown style={{ color: 'var(--ds-faint)' }} size={20} />
                                <div style={{ color: 'var(--ds-ink)' }}>Outputs (shifted)</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6" style={panelStyle}>
                        <h3 className="font-bold mb-4" style={{ color: 'var(--ds-ink)' }}>Component Details</h3>

                        {hoveredComponent ? (
                            <div className="space-y-4">
                                <div className="px-4 py-2 font-bold" style={tileStyle(components[hoveredComponent].tone, true)}>
                                    {components[hoveredComponent].name}
                                </div>
                                <p style={{ color: 'var(--ds-faint)' }}>{components[hoveredComponent].description}</p>
                                <div className="p-4" style={{ background: 'var(--ds-paper-2)', border: 'var(--ds-border)', borderRadius: 2 }}>
                                    <p className="font-mono" style={{ color: 'var(--ds-ink)' }}>
                                        {components[hoveredComponent].details}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8" style={{ color: 'var(--ds-faint)' }}>
                                <Eye size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Hover over a component to see details</p>
                            </div>
                        )}

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="p-3 text-center" style={tileStyle(palette.embedding)}>
                                <div className="text-2xl font-bold">512</div>
                                <div className="text-xs">d_model</div>
                            </div>
                            <div className="p-3 text-center" style={tileStyle(palette.encoder)}>
                                <div className="text-2xl font-bold">8</div>
                                <div className="text-xs">Attention Heads</div>
                            </div>
                            <div className="p-3 text-center" style={tileStyle(palette.decoder)}>
                                <div className="text-2xl font-bold">6</div>
                                <div className="text-xs">Encoder/Decoder Layers</div>
                            </div>
                            <div className="p-3 text-center" style={tileStyle(palette.projection)}>
                                <div className="text-2xl font-bold">2048</div>
                                <div className="text-xs">FFN Hidden Dim</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 mb-8" style={{ ...panelStyle, background: 'var(--ds-warm-w)' }}>
                    <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--ds-warm)' }}>
                        <Lightbulb size={20} />
                        Why Transformers Changed Everything
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4" style={panelStyle}>
                            <h4 className="font-medium mb-2" style={{ color: 'var(--ds-ink)' }}>Parallelization</h4>
                            <p style={{ color: 'var(--ds-faint)' }}>
                                Unlike RNNs, transformers process all positions simultaneously. Training on GPUs is massively faster.
                            </p>
                        </div>
                        <div className="p-4" style={panelStyle}>
                            <h4 className="font-medium mb-2" style={{ color: 'var(--ds-ink)' }}>Long-Range Dependencies</h4>
                            <p style={{ color: 'var(--ds-faint)' }}>
                                Any position can attend to any other position directly. There is no recurrent bottleneck.
                            </p>
                        </div>
                        <div className="p-4" style={panelStyle}>
                            <h4 className="font-medium mb-2" style={{ color: 'var(--ds-ink)' }}>Scalability</h4>
                            <p style={{ color: 'var(--ds-faint)' }}>
                                The architecture scales from compact encoders to very large language and multimodal models.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6" style={panelStyle}>
                    <h3 className="font-bold mb-4" style={{ color: 'var(--ds-ink)' }}>The Original Paper (2017)</h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <p className="mb-4" style={{ color: 'var(--ds-faint)' }}>
                                <strong style={{ color: 'var(--ds-accent)' }}>"Attention Is All You Need"</strong> by Vaswani et al.
                                introduced the Transformer architecture, eliminating recurrence entirely.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={14} style={{ color: 'var(--ds-ok)' }} />
                                    <span style={{ color: 'var(--ds-faint)' }}>New SOTA on WMT translation tasks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={14} style={{ color: 'var(--ds-ok)' }} />
                                    <span style={{ color: 'var(--ds-faint)' }}>3.5 days training on 8 GPUs instead of weeks for comparable recurrent models</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={14} style={{ color: 'var(--ds-ok)' }} />
                                    <span style={{ color: 'var(--ds-faint)' }}>Foundation for BERT, GPT, T5, and modern LLMs</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-xs" style={{ background: 'var(--ds-paper-2)', border: 'var(--ds-border)', borderRadius: 2 }}>
                            <div style={{ color: 'var(--ds-faint)' }}>// Original hyperparameters</div>
                            <div style={{ color: 'var(--ds-faint)' }}>d_model = <span style={{ color: 'var(--ds-accent)' }}>512</span></div>
                            <div style={{ color: 'var(--ds-faint)' }}>d_ff = <span style={{ color: 'var(--ds-ok)' }}>2048</span></div>
                            <div style={{ color: 'var(--ds-faint)' }}>h = <span style={{ color: 'var(--ds-accent-2)' }}>8</span> // heads</div>
                            <div style={{ color: 'var(--ds-faint)' }}>N = <span style={{ color: 'var(--ds-warm)' }}>6</span> // layers</div>
                            <div style={{ color: 'var(--ds-faint)' }}>d_k = d_v = <span style={{ color: '#6b4a0c' }}>64</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
