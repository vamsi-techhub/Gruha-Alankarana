import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, label = "Upload Room Photo" }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        // Remove data URL prefix for API
        const base64Data = base64.split(',')[1];
        onImageSelected(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onImageSelected('');
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
      
      {!preview ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-8 cursor-pointer transition-colors flex flex-col items-center justify-center bg-slate-900/50 min-h-[200px]"
        >
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-slate-300 font-medium">{label}</p>
          <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black">
          <img src={preview} alt="Preview" className="w-full h-64 object-contain" />
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};