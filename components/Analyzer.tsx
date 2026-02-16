import React, { useState } from 'react';
import { analyzeRoomImage } from '../services/geminiService';
import { ImageUpload } from './Shared/ImageUpload';
import { Spinner } from './Shared/Spinner';
import { Sparkles, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Analyzer: React.FC = () => {
  const [image, setImage] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const text = await analyzeRoomImage(image, "Analyze this room for interior design. Identify the current style, list the furniture items seen, and suggest 3 improvements to make it look more luxurious.");
      setResult(text);
    } catch (e) {
      console.error(e);
      setResult("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-amber-500">Design Analysis</h2>
        <p className="text-slate-400">Upload a photo of your space to get professional design insights.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
             <ImageUpload onImageSelected={setImage} label="Upload Room to Analyze" />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!image || loading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              !image || loading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20'
            }`}
          >
            {loading ? <Spinner /> : <><Sparkles className="w-5 h-5" /> Analyze Design</>}
          </button>
        </div>

        <div className="bg-slate-900 min-h-[300px] rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
          {result ? (
            <div className="prose prose-invert prose-amber max-w-none h-full overflow-y-auto max-h-[500px] custom-scrollbar">
               <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
               <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
               <p>Analysis results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};