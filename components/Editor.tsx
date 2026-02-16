import React, { useState } from 'react';
import { editRoomImage } from '../services/geminiService';
import { ImageUpload } from './Shared/ImageUpload';
import { Spinner } from './Shared/Spinner';
import { Wand2, Download } from 'lucide-react';

export const Editor: React.FC = () => {
  const [image, setImage] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    setResultImage(null);
    try {
      const base64Result = await editRoomImage(image, prompt);
      setResultImage(`data:image/png;base64,${base64Result}`);
    } catch (e) {
      console.error(e);
      alert("Failed to edit image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-amber-500">Magic Editor</h2>
        <p className="text-slate-400">Modify your space with AI. Try "Add a modern sofa" or "Change wall color to sage green".</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <ImageUpload onImageSelected={setImage} label="Original Photo" />
          </div>

          <div className="space-y-3">
             <label className="text-sm font-medium text-slate-300">Edit Instruction</label>
             <div className="flex gap-2">
               <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Replace the rug with a wooden floor"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
               />
               <button
                onClick={handleEdit}
                disabled={!image || !prompt || loading}
                className={`px-6 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  !image || !prompt || loading 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
               >
                 {loading ? <Spinner /> : <Wand2 className="w-5 h-5" />}
               </button>
             </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[400px]">
           {resultImage ? (
             <div className="relative w-full h-full flex flex-col items-center">
               <img src={resultImage} alt="Edited Result" className="w-full h-auto rounded-lg shadow-2xl mb-4" />
               <a 
                 href={resultImage} 
                 download="edited-room.png"
                 className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
               >
                 <Download className="w-4 h-4" /> Download Image
               </a>
             </div>
           ) : (
             <div className="text-center text-slate-600">
                <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Your edited design will appear here</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};