import React, { useState } from 'react';
import { AppTab } from './types';
import { Analyzer } from './components/Analyzer';
import { Editor } from './components/Editor';
import { Generator } from './components/Generator';
import { ChatAgent } from './components/ChatAgent';
import { 
  LayoutDashboard, 
  ScanEye, 
  Wand2, 
  ImagePlus, 
  MessageSquareText,
  Armchair
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.ANALYZE:
        return <Analyzer />;
      case AppTab.EDIT:
        return <Editor />;
      case AppTab.GENERATE:
        return <Generator />;
      case AppTab.AGENT:
        return <ChatAgent />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setActiveTab(AppTab.HOME)}
            >
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center transform rotate-3">
                 <Armchair className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-wide">
                Gruha<span className="text-amber-500">Alankara</span>
              </span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <NavButton 
                active={activeTab === AppTab.ANALYZE} 
                onClick={() => setActiveTab(AppTab.ANALYZE)} 
                icon={<ScanEye className="w-4 h-4" />}
                label="Analyze"
              />
              <NavButton 
                active={activeTab === AppTab.EDIT} 
                onClick={() => setActiveTab(AppTab.EDIT)} 
                icon={<Wand2 className="w-4 h-4" />}
                label="Edit"
              />
              <NavButton 
                active={activeTab === AppTab.GENERATE} 
                onClick={() => setActiveTab(AppTab.GENERATE)} 
                icon={<ImagePlus className="w-4 h-4" />}
                label="Generate"
              />
              <NavButton 
                active={activeTab === AppTab.AGENT} 
                onClick={() => setActiveTab(AppTab.AGENT)} 
                icon={<MessageSquareText className="w-4 h-4" />}
                label="Buddy"
              />
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2 flex justify-around z-50 pb-safe">
         <MobileNavButton active={activeTab === AppTab.ANALYZE} onClick={() => setActiveTab(AppTab.ANALYZE)} icon={<ScanEye />} />
         <MobileNavButton active={activeTab === AppTab.EDIT} onClick={() => setActiveTab(AppTab.EDIT)} icon={<Wand2 />} />
         <MobileNavButton active={activeTab === AppTab.HOME} onClick={() => setActiveTab(AppTab.HOME)} icon={<LayoutDashboard />} />
         <MobileNavButton active={activeTab === AppTab.GENERATE} onClick={() => setActiveTab(AppTab.GENERATE)} icon={<ImagePlus />} />
         <MobileNavButton active={activeTab === AppTab.AGENT} onClick={() => setActiveTab(AppTab.AGENT)} icon={<MessageSquareText />} />
      </div>

      {/* Main Content */}
      <main className="pb-24 md:pb-8 animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
}

const Home: React.FC<{ setActiveTab: (tab: AppTab) => void }> = ({ setActiveTab }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center mb-16 space-y-4">
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 pb-2">
        Redefine Your Space
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
        Experience the future of interior design with Gemini AI. Visualize, create, and transform your home in seconds.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <FeatureCard 
        title="Analyze Room" 
        desc="Upload a photo to get AI design insights and furniture ID."
        icon={<ScanEye className="w-8 h-8 text-blue-400" />}
        onClick={() => setActiveTab(AppTab.ANALYZE)}
        color="hover:border-blue-500/50"
      />
      <FeatureCard 
        title="Magic Edit" 
        desc="Change floors, walls, or furniture with a simple text prompt."
        icon={<Wand2 className="w-8 h-8 text-purple-400" />}
        onClick={() => setActiveTab(AppTab.EDIT)}
        color="hover:border-purple-500/50"
      />
      <FeatureCard 
        title="Generate Design" 
        desc="Create stunning 4K interior concepts from scratch."
        icon={<ImagePlus className="w-8 h-8 text-amber-400" />}
        onClick={() => setActiveTab(AppTab.GENERATE)}
        color="hover:border-amber-500/50"
      />
      <FeatureCard 
        title="Ask Buddy" 
        desc="Chat with your personal AI design assistant."
        icon={<MessageSquareText className="w-8 h-8 text-green-400" />}
        onClick={() => setActiveTab(AppTab.AGENT)}
        color="hover:border-green-500/50"
      />
    </div>
    
    <div className="mt-20 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      <h3 className="text-2xl font-serif font-bold mb-4">Powered by Gemini Nano Banana</h3>
      <p className="text-slate-400 max-w-2xl mx-auto">
        Utilizing the latest Gemini 3 Pro and Flash models to bring professional-grade interior design tools directly to your browser. No cloud infrastructure required.
      </p>
    </div>
  </div>
);

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
      active 
        ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavButton = ({ active, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${
      active ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'text-slate-500'
    }`}
  >
    {React.cloneElement(icon, { className: "w-6 h-6" })}
  </button>
);

const FeatureCard = ({ title, desc, icon, onClick, color }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left transition-all hover:-translate-y-1 hover:shadow-2xl group ${color}`}
  >
    <div className="bg-slate-950 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </button>
);