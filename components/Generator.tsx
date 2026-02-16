import React, { useState } from 'react';
import { generateDesignImage, checkAndRequestApiKey } from '../services/geminiService';
import { Spinner } from './Shared/Spinner';
import { Download, Palette, Key } from 'lucide-react';

export const Generator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setError(null);
    setLoading(true);
    
    try {
      // Check for API key specifically for this model
      const hasKey = await checkAndRequestApiKey();
      if (!hasKey) {
        throw new Error("API Key selection is required for Pro Image generation.");
      }

      const base64 = await generateDesignImage(prompt, size);
      setGeneratedImage(`data:image/png;base64,${base64}`);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("API Key")) {
        setError("Please select a paid API Key project to use the Pro Image model.");
      } else {
        setError("Generation failed. Try a different prompt.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-amber-500">Dream Space Generator</h2>
        <p className="text-slate-400">Create entirely new interior concepts from scratch using Nano Banana Pro.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A minimalist living room with floor-to-ceiling windows overlooking a forest, warm lighting, beige furniture..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 h-40 focus:outline-none focus:border-amber-500 resize-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Resolution</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-2 rounded-lg font-medium transition-all ${
                      size === s 
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt || loading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !prompt || loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-xl'
              }`}
            >
              {loading ? <Spinner /> : <><Palette className="w-5 h-5" /> Generate Concept</>}
            </button>
            
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm flex items-start gap-2">
                <Key className="w-4 h-4 mt-1 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <p className="text-xs text-slate-500 text-center">
              Requires a paid project API key.
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-2 flex items-center justify-center min-h-[500px] shadow-2xl relative">
          {generatedImage ? (
            <div className="relative w-full h-full">
              <img 
                src={generatedImage} 
                alt="Generated Design" 
                className="w-full h-full object-contain rounded-xl" 
              />
              <a 
                href={generatedImage}
                download={`design-${size}.png`}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" /> Save {size}
              </a>
            </div>
          ) : (
             <div className="text-center text-slate-600">
               <Palette className="w-20 h-20 mx-auto mb-4 opacity-20" />
               <p className="text-lg">Your masterpiece awaits</p>
               <p className="text-sm opacity-60">Enter a prompt and select quality to begin</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};