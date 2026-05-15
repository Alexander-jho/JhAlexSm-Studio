
import { useEditorStore } from '../../store/useEditorStore.ts';
import { 
  Trash2, 
  Copy, 
  Layers, 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Bold, 
  Italic,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  FlipHorizontal,
  FlipVertical
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EditorToolbar() {
  const { activeObject, canvas, saveToHistory } = useEditorStore();
  const [fill, setFill] = useState('#000000');
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (activeObject) {
       // @ts-ignore
       setFill(activeObject.fill as string || '#000000');
       setOpacity(activeObject.opacity || 1);
    }
  }, [activeObject]);

  if (!activeObject) return <div className="h-10 bg-zinc-900 border-b border-white/5 flex items-center justify-center text-[10px] uppercase font-black tracking-widest text-zinc-600">No object selected</div>;

  const updateProperty = (key: string, value: any) => {
    activeObject.set(key as any, value);
    canvas?.renderAll();
    saveToHistory();
    if (key === 'fill') setFill(value);
    if (key === 'opacity') setOpacity(value);
  };

  const deleteObject = () => {
    canvas?.remove(activeObject);
    canvas?.discardActiveObject();
    canvas?.renderAll();
    saveToHistory();
  };

  const duplicate = async () => {
     if (!canvas || !activeObject) return;
     try {
        const cloned = await activeObject.clone();
        canvas.discardActiveObject();
        cloned.set({
           left: (cloned.left || 0) + 20,
           top: (cloned.top || 0) + 20,
           evented: true,
        });
        
        if (cloned.type === 'activeselection') {
           // For active selection, we need to handle its objects
           const selection = cloned as any;
           selection.canvas = canvas;
           selection.forEachObject((obj: any) => canvas.add(obj));
           selection.setCoords();
        } else {
           canvas.add(cloned);
        }
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        saveToHistory();
     } catch (err) {
        console.error(err);
     }
  };

  const bringForward = () => {
     if (!canvas || !activeObject) return;
     canvas.bringObjectForward(activeObject);
     canvas.renderAll();
     saveToHistory();
  };

  const sendBackward = () => {
     if (!canvas || !activeObject) return;
     canvas.sendObjectBackwards(activeObject);
     canvas.renderAll();
     saveToHistory();
  };

  return (
    <div className="h-12 bg-bg-surface border-b border-line flex items-center px-4 gap-4 overflow-x-auto no-scrollbar">
       {/* Layering */}
       <div className="flex items-center gap-1">
          <ToolBtn onClick={bringForward} icon={<ArrowUp size={16} />} title="Bring Forward" />
          <ToolBtn onClick={sendBackward} icon={<ArrowDown size={16} />} title="Send Backward" />
       </div>

       <div className="h-4 w-px bg-line"></div>

       {/* Alignment */}
       <div className="flex items-center gap-1">
          <ToolBtn onClick={() => {
             if (canvas) {
               canvas.centerObjectH(activeObject);
               canvas.renderAll();
               saveToHistory();
             }
          }} icon={<AlignCenter size={16} />} title="Center Horizontally" />
          <ToolBtn onClick={() => {
             if (canvas) {
               canvas.centerObjectV(activeObject);
               canvas.renderAll();
               saveToHistory();
             }
          }} icon={<Layers size={16} />} title="Center Vertically" />
       </div>

       <div className="h-4 w-px bg-line"></div>

       {/* Text Actions */}
       {activeObject.type === 'i-text' && (
         <>
           <div className="flex items-center gap-1">
             <ToolBtn 
               onClick={() => updateProperty('fontWeight', (activeObject as any).fontWeight === 'bold' ? 'normal' : 'bold')} 
               icon={<Bold size={16} />} 
               title="Bold" 
               className={(activeObject as any).fontWeight === 'bold' ? 'text-accent' : ''}
             />
             <ToolBtn 
               onClick={() => updateProperty('fontStyle', (activeObject as any).fontStyle === 'italic' ? 'normal' : 'italic')} 
               icon={<Italic size={16} />} 
               title="Italic"
               className={(activeObject as any).fontStyle === 'italic' ? 'text-accent' : ''}
             />
           </div>
           <div className="h-4 w-px bg-line"></div>
           <div className="flex items-center gap-1">
             <ToolBtn onClick={() => updateProperty('textAlign', 'left')} icon={<AlignLeft size={16} />} title="Align Left" />
             <ToolBtn onClick={() => updateProperty('textAlign', 'center')} icon={<AlignCenter size={16} />} title="Align Center" />
             <ToolBtn onClick={() => updateProperty('textAlign', 'right')} icon={<AlignRight size={16} />} title="Align Right" />
           </div>
           <div className="h-4 w-px bg-line"></div>
         </>
       )}

       {/* Color & Opacity */}
       <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
             <div className="relative w-6 h-6 rounded-md border border-line overflow-hidden ring-1 ring-bg-dark shadow-md">
                <input 
                  type="color" 
                  value={fill}
                  onChange={(e) => updateProperty('fill', e.target.value)}
                  className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                />
             </div>
             <span className="text-[10px] font-bold text-text-muted tracking-tight">{fill.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2 ml-2">
             <span className="text-[10px] font-bold text-text-muted tracking-tight">Opacity</span>
             <input 
               type="range" 
               min="0" max="1" step="0.01" 
               value={opacity}
               onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
               className="w-20 accent-accent h-1 bg-bg-card rounded-full appearance-none cursor-pointer"
             />
          </div>
       </div>

       <div className="h-4 w-px bg-line"></div>

       {/* Transforms */}
       <div className="flex items-center gap-1">
          <ToolBtn onClick={() => updateProperty('flipX', !activeObject.flipX)} icon={<FlipHorizontal size={16} />} title="Flip Horizontal" />
          <ToolBtn onClick={() => updateProperty('flipY', !activeObject.flipY)} icon={<FlipVertical size={16} />} title="Flip Vertical" />
       </div>

       <div className="flex-1"></div>

       {/* Actions */}
       <div className="flex items-center gap-1">
          <ToolBtn onClick={duplicate} icon={<Copy size={16} />} title="Duplicate" />
          <ToolBtn onClick={deleteObject} icon={<Trash2 size={16} />} title="Delete" className="hover:text-red-500" />
       </div>
    </div>
  );
}

function ToolBtn({ icon, title, onClick, className = "" }: { icon: any, title: string, onClick: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      className={`p-1.5 hover:bg-line rounded-md text-text-muted hover:text-white transition-all active:scale-95 ${className}`}
    >
      {icon}
    </button>
  );
}
