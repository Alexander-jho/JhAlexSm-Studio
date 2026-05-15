
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Download, 
  Save, 
  Undo, 
  Redo, 
  Share2, 
  HelpCircle,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore.ts';
import toast from 'react-hot-toast';

interface ToolbarProps {
  design: any;
  onSave: () => void;
}

export default function Toolbar({ design, onSave }: ToolbarProps) {
  const navigate = useNavigate();
  const { canvas, undo, redo, historyIndex, history } = useEditorStore();

  const exportCanvas = (format: 'png' | 'jpg' | 'svg') => {
    if (!canvas) return;
    
    let dataURL = '';
    const name = `${design?.title || 'design'}-${Date.now()}`;

    if (format === 'svg') {
      const svg = canvas.toSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      dataURL = URL.createObjectURL(blob);
    } else {
      dataURL = canvas.toDataURL({
        format: format === 'jpg' ? 'jpeg' : format,
        quality: 1,
        multiplier: 2 // High quality export
      });
    }

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${name}.${format}`;
    link.click();
    toast.success(`${format.toUpperCase()} exported successfully`);
  };

  return (
    <header className="h-[56px] bg-bg-surface border-b border-line flex items-center justify-between px-5 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-1.5 hover:bg-line rounded-md text-text-muted hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-accent to-indigo-500 rounded-md flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-accent/20">JS</div>
           <div className="hidden md:flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight truncate max-w-[200px]">{design?.title}</h1>
              <span className="bg-success-muted text-success-bright text-[10px] font-bold px-2 py-0.5 rounded-full border border-success-bright/20 uppercase tracking-wide">
                Unlimited Free
              </span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1">
           <button 
             onClick={undo}
             disabled={historyIndex <= 0}
             className="p-2 hover:bg-line disabled:opacity-20 disabled:pointer-events-none rounded-md text-text-muted hover:text-white transition-colors"
           >
              <Undo size={18} />
           </button>
           <button 
             onClick={redo}
             disabled={historyIndex >= history.length - 1}
             className="p-2 hover:bg-line disabled:opacity-20 disabled:pointer-events-none rounded-md text-text-muted hover:text-white transition-colors"
           >
              <Redo size={18} />
           </button>
        </div>

        <div className="h-4 w-px bg-line hidden md:block mx-2"></div>

        <div className="flex items-center gap-2">
           <button 
             onClick={onSave}
             className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-bg-card hover:bg-zinc-700 border border-line rounded-md text-xs font-bold transition-all"
           >
             <Save size={14} />
             Save
           </button>
           
           <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-blue-600 rounded-md text-xs font-bold transition-all shadow-lg shadow-accent/20">
                <Download size={14} />
                Export 4K
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-bg-surface border border-line rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-50 p-1">
                 <ExportOption label="Download PNG" sub="Best for images" onClick={() => exportCanvas('png')} />
                 <ExportOption label="Download JPG" sub="Best for web" onClick={() => exportCanvas('jpg')} />
                 <ExportOption label="Download SVG" sub="Best for scaling" onClick={() => exportCanvas('svg')} />
              </div>
           </div>
           
           <button className="p-2 hover:bg-line rounded-md text-text-muted hover:text-white transition-colors">
              <MoreHorizontal size={18} />
           </button>
        </div>
      </div>
    </header>
  );
}

function ExportOption({ label, sub, onClick }: { label: string, sub: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-colors group"
    >
      <p className="text-xs font-bold group-hover:text-blue-500 transition-colors uppercase tracking-tight">{label}</p>
      <p className="text-[10px] text-zinc-500 font-medium italic mt-0.5">{sub}</p>
    </button>
  );
}
