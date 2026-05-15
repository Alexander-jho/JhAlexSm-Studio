
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import { db } from '../../lib/firebase.ts';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useEditorStore } from '../../store/useEditorStore.ts';
import Sidebar from './Sidebar.tsx';
import Toolbar from './Toolbar.tsx';
import EditorToolbar from './EditorToolbar.tsx';
import Canvas from './Canvas.tsx';
import toast from 'react-hot-toast';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCanvas, canvas } = useEditorStore();
  const [loading, setLoading] = useState(true);
  const [design, setDesign] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'designs', id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        toast.error("Design not found");
        navigate('/dashboard');
        return;
      }
      setDesign({ id: snapshot.id, ...snapshot.data() });
    } catch (error) {
      console.error(error);
      toast.error("Error loading design");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canvas || !id) return;
    const loadingToast = toast.loading("Saving changes...");
    try {
      const docRef = doc(db, 'designs', id);
      const canvasJson = JSON.stringify(canvas.toJSON());
      const thumbnail = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 0.2 // Small preview
      });
      
      await updateDoc(docRef, {
        canvasData: canvasJson,
        thumbnail,
        updatedAt: serverTimestamp()
      });
      toast.success("Saved successfully", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Save failed", { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg-dark text-white">
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            <p className="mt-4 text-text-muted text-xs font-bold uppercase tracking-[2px]">Loading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-bg-dark text-white overflow-hidden">
      {/* Top Navigation */}
      <Toolbar design={design} onSave={handleSave} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Options */}
        <Sidebar />
        
        {/* Main Development Area */}
        <div className="flex-1 flex flex-col bg-[#121214] relative">
           {/* Contextual Toolbar */}
           <EditorToolbar />
           
           {/* Canvas Container */}
           <div className="flex-1 relative overflow-hidden flex items-center justify-center p-10">
              <Canvas design={design} />
           </div>
           
           {/* Zoom Controls Overlay */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-bg-surface/80 backdrop-blur-md px-4 py-1.5 rounded-md border border-line shadow-2xl z-20">
              <button 
                onClick={() => {
                   const z = canvas?.getZoom() || 1;
                   canvas?.setZoom(Math.max(0.1, z - 0.1));
                }}
                className="hover:text-accent transition-colors px-2 font-bold text-lg"
              >-</button>
              <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted min-w-[50px] text-center">
                {Math.round((canvas?.getZoom() || 1) * 100)}%
              </div>
              <button 
                onClick={() => {
                   const z = canvas?.getZoom() || 1;
                   canvas?.setZoom(Math.min(5, z + 0.1));
                }}
                className="hover:text-accent transition-colors px-2 font-bold text-lg"
              >+</button>
           </div>
        </div>
      </div>
    </div>
  );
}
