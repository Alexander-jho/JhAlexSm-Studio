
import { motion } from 'motion/react';
import { LogIn, Sparkles, Layers, Image as ImageIcon, Zap, Shield, Play } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase.ts';

export default function LandingPage() {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_#2563eb]">
              <span className="font-black text-xl">J</span>
            </div>
            <span className="text-xl font-bold tracking-tight">JhAlexMS-Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#editor" className="hover:text-white transition-colors">Canvas</a>
            <a href="#ai" className="hover:text-white transition-colors">AI Studio</a>
          </div>
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-all active:scale-95"
          >
            <LogIn size={16} />
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-xs font-bold text-blue-400 uppercase tracking-widest mb-8">
              <Sparkles size={12} />
              Professional Creator Studio
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              DESIGN <span className="text-zinc-600">EVERYTHING.</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">COMPLETELY FREE.</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The ultimate all-in-one studio for graphic design, photo editing, video creation, and AI generation. No premiums, no watermarks, no limits.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-900/20 transition-all active:scale-95"
              >
                Create My First Design
              </button>
            </div>
          </motion.div>

          {/* Floating UI Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mt-20 relative px-6 md:px-0"
          >
            <div className="bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl p-4 overflow-hidden aspect-video">
               <div className="w-full h-full bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-zinc-900 to-zinc-950"></div>
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-lg border border-white/10 group-hover:scale-110 transition-transform">
                      <Play className="fill-white ml-1" />
                    </div>
                    <p className="font-bold text-lg tracking-tight uppercase">Watch Studio in Action</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
               icon={<Layers className="text-blue-500" />}
               title="Professional Editor"
               description="Advanced layer system, smart alignment, vector support, and keyboard shortcuts. Just like the pros."
            />
            <FeatureCard 
               icon={<ImageIcon className="text-cyan-500" />}
               title="Unlimited Library"
               description="Millions of photos, icons, and templates at your fingertips. All available for free, always."
            />
            <FeatureCard 
               icon={<Sparkles className="text-purple-500" />}
               title="AI Powered"
               description="Generate high-end imagery and copy using Gemini AI. Enhance your creative workflow instantly."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-black text-sm">J</span>
          </div>
          <span className="font-bold">JhAlexMS-Studio</span>
        </div>
        <p className="text-zinc-500 text-sm">© 2026 JhAlexMS-Studio. Built for the creators of tomorrow.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
      <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
