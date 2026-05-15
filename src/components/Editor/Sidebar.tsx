
import { useState } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Shapes, 
  Upload, 
  Sparkles, 
  Layout, 
  Music, 
  Video as VideoIcon,
  Search,
  Plus,
  Wand2
} from 'lucide-react';
import * as fabric from 'fabric';
import { useEditorStore } from '../../store/useEditorStore.ts';
import toast from 'react-hot-toast';

type Tab = 'templates' | 'elements' | 'text' | 'uploads' | 'images' | 'ai' | 'magic';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('elements');
  const { canvas } = useEditorStore();

  const addText = (type: 'heading' | 'subheading' | 'body') => {
    if (!canvas) return;
    const text = new fabric.IText(
      type === 'heading' ? 'Add Heading' : type === 'subheading' ? 'Add Subheading' : 'Add body text',
      {
        left: canvas.width! / 2 - 50,
        top: canvas.height! / 2 - 20,
        fontSize: type === 'heading' ? 60 : type === 'subheading' ? 40 : 24,
        fontFamily: 'Inter',
        fontWeight: type === 'heading' ? 'bold' : 'normal',
        fill: '#000000',
      }
    );
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle') => {
    if (!canvas) return;
    let shape: fabric.Object;
    const commonProps = {
        left: 100,
        top: 100,
        fill: '#3b82f6',
        width: 100,
        height: 100,
    };

    if (type === 'rect') shape = new fabric.Rect(commonProps);
    else if (type === 'circle') shape = new fabric.Circle({ ...commonProps, radius: 50 });
    else shape = new fabric.Triangle(commonProps);

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result as string;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-[332px] flex bg-bg-surface border-r border-line z-30 overflow-hidden">
      {/* Category Bar / Left Rail */}
      <div className="w-[72px] border-r border-line flex flex-col items-center py-6 gap-6 shrink-0 bg-bg-surface">
         <SidebarTab icon={<Layout size={24} />} label="Design" active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
         <SidebarTab icon={<Shapes size={24} />} label="Elements" active={activeTab === 'elements'} onClick={() => setActiveTab('elements')} />
         <SidebarTab icon={<Type size={24} />} label="Text" active={activeTab === 'text'} onClick={() => setActiveTab('text')} />
         <SidebarTab icon={<ImageIcon size={24} />} label="Media" active={activeTab === 'images'} onClick={() => setActiveTab('images')} />
         <SidebarTab icon={<Upload size={24} />} label="Uploads" active={activeTab === 'uploads'} onClick={() => setActiveTab('uploads')} />
         <SidebarTab icon={<Sparkles size={24} />} label="AI Studio" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
         <SidebarTab icon={<Wand2 size={24} />} label="Magic" active={activeTab === 'magic'} onClick={() => setActiveTab('magic')} />
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
         <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[1px] text-text-muted mb-4">{activeTab}</h2>
            {(activeTab !== 'ai' && activeTab !== 'magic') && (
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                 <input 
                   type="text" 
                   placeholder={`Search ${activeTab}...`} 
                   className="w-full bg-bg-card border border-line rounded-md pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-accent/50 transition-all text-white placeholder:text-zinc-600"
                 />
              </div>
            )}
         </div>

         {activeTab === 'text' && (
           <div className="space-y-3">
              <button onClick={() => addText('heading')} className="w-full py-4 bg-bg-card border border-line rounded-md text-xl font-bold hover:bg-zinc-700 transition-colors">Add Heading</button>
              <button onClick={() => addText('subheading')} className="w-full py-3 bg-bg-card border border-line rounded-md text-lg font-semibold hover:bg-zinc-700 transition-colors">Add Subheading</button>
              <button onClick={() => addText('body')} className="w-full py-2 bg-bg-card border border-line rounded-md text-sm text-text-muted hover:bg-zinc-700 transition-colors">Add body text</button>
           </div>
         )}

         {activeTab === 'elements' && (
           <div className="grid grid-cols-2 gap-3">
              <div onClick={() => addShape('rect')} className="aspect-square bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all group">
                 <div className="w-12 h-12 bg-zinc-700 rounded-sm group-hover:bg-blue-600 transition-colors"></div>
              </div>
              <div onClick={() => addShape('circle')} className="aspect-square bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all group">
                 <div className="w-12 h-12 bg-zinc-700 rounded-full group-hover:bg-blue-600 transition-colors"></div>
              </div>
              <div onClick={() => addShape('triangle')} className="aspect-square bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all group">
                 <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-zinc-700 group-hover:border-b-blue-600 transition-colors"></div>
              </div>
           </div>
         )}

         {activeTab === 'uploads' && (
           <div>
              <label className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors font-bold text-sm mb-4">
                 <Plus size={16} />
                 Upload Media
                 <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
              <p className="text-[10px] uppercase font-bold text-zinc-600 text-center tracking-widest px-4">Drag and drop files from your computer to upload.</p>
           </div>
         )}

         {activeTab === 'ai' && <AITools />}
         {activeTab === 'magic' && <MagicTools />}
      </div>
    </div>
  );
}

function SidebarTab({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex flex-col items-center py-2 gap-1 transition-all ${active ? 'text-accent' : 'text-text-muted hover:text-white'}`}
    >
      <div className="w-6 h-6 flex items-center justify-center">
         {icon}
      </div>
      <span className="text-[10px] font-medium tracking-tight mt-1">{label}</span>
    </button>
  );
}

function AITools() {
  const { canvas } = useEditorStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt || !canvas) return;
    setLoading(true);
    const id = toast.loading("AI is imagining your design...");
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      fabric.Image.fromURL(data.imageUrl, (img) => {
        img.scaleToWidth(400);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();
        toast.success("Image generated!", { id });
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate image", { id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
          <p className="text-xs text-accent leading-relaxed font-medium">✨ Generate anything using descriptive prompts. Powered by Gemini.</p>
       </div>
       
       <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Image Prompt</label>
          <textarea 
            className="w-full bg-bg-card border border-line rounded-xl p-3 text-xs focus:outline-none focus:border-accent/50 min-h-[120px] resize-none text-white italic"
            placeholder="A futuristic synthwave city..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
       </div>

       <button 
         onClick={generateImage}
         disabled={loading || !prompt}
         className="w-full py-3 bg-accent hover:bg-blue-600 rounded-xl font-bold text-sm shadow-lg shadow-accent/20 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
       >
         {loading ? <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <Sparkles size={16} />}
         {loading ? 'Generating...' : 'Magic Generate'}
       </button>
    </div>
  );
}

function MagicTools() {
  const { canvas, activeObject } = useEditorStore();
  const [loading, setLoading] = useState(false);

  const writeWithAI = async () => {
    if (!canvas || !activeObject || activeObject.type !== 'i-text') {
      toast.error("Please select a text object");
      return;
    }
    setLoading(true);
    const id = toast.loading("Magic writing in progress...");
    try {
      const textObj = activeObject as fabric.IText;
      const response = await fetch('/api/ai/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           prompt: `Expand or professionally improve this short text: "${textObj.text}". Keep it short.`,
           systemInstruction: "You are a professional copywriter for a design studio."
        }),
      });
      const data = await response.json();
      textObj.set('text', data.text);
      canvas.renderAll();
      toast.success("Text improved!", { id });
    } catch (error) {
      toast.error("AI writing failed", { id });
    } finally {
      setLoading(false);
    }
  };

  const removeBackground = async () => {
    toast.error("Background removal requires advanced AI integration. Coming soon!");
  };

  return (
    <div className="space-y-4">
       <button 
         onClick={writeWithAI}
         className="w-full p-4 bg-bg-card border border-line rounded-xl hover:border-accent/50 transition-all text-left flex items-start gap-4"
       >
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-accent shrink-0 border border-accent/20">
             <Type size={18} />
          </div>
          <div>
             <h3 className="text-sm font-bold mb-1">Magic Write</h3>
             <p className="text-[10px] text-text-muted leading-tight">Improve or expand selected text using AI.</p>
          </div>
       </button>

       <button 
         onClick={removeBackground}
         className="w-full p-4 bg-bg-card border border-line rounded-xl hover:border-accent/50 transition-all text-left flex items-start gap-4"
       >
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/20">
             <ImageIcon size={18} />
          </div>
          <div>
             <h3 className="text-sm font-bold mb-1">Remove Background</h3>
             <p className="text-[10px] text-text-muted leading-tight">Instantly remove backgrounds from images.</p>
          </div>
       </button>
    </div>
  );
}

