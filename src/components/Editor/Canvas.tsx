
import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../../store/useEditorStore.ts';

interface CanvasProps {
  design: any;
}

export default function Canvas({ design }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, setActiveObject, saveToHistory } = useEditorStore();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: design.width || 1080,
      height: design.height || 1080,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    // Handle Window Resize / Container fitting
    const resizeCanvas = () => {
       if (!containerRef.current) return;
       const parent = containerRef.current;
       const scale = Math.min(
         (parent.clientWidth - 100) / fabricCanvas.getWidth(),
         (parent.clientHeight - 100) / fabricCanvas.getHeight()
       );
       
       if (scale < 1) {
          fabricCanvas.setZoom(scale);
       }
    };

    // Load Initial Data
    if (design.canvasData) {
      try {
        const data = JSON.parse(design.canvasData);
        fabricCanvas.loadFromJSON(data, () => {
          fabricCanvas.renderAll();
          saveToHistory();
        });
      } catch (e) {
        console.error("Failed to load canvas data", e);
      }
    }

    // Set Up Events
    fabricCanvas.on('selection:created', (e) => setActiveObject(e.selected?.[0] || null));
    fabricCanvas.on('selection:updated', (e) => setActiveObject(e.selected?.[0] || null));
    fabricCanvas.on('selection:cleared', () => setActiveObject(null));
    fabricCanvas.on('object:modified', () => saveToHistory());
    fabricCanvas.on('object:added', () => saveToHistory());

    // Shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
       if (e.ctrlKey || e.metaKey) {
          if (e.key === 'z') {
             // Undo triggered from store
          }
       }
       if (e.key === 'Delete' || e.key === 'Backspace') {
          const active = fabricCanvas.getActiveObject();
          if (active && (!active.isEditing)) {
             fabricCanvas.remove(active);
             fabricCanvas.discardActiveObject();
             fabricCanvas.renderAll();
             saveToHistory();
          }
       }
    };
    window.addEventListener('keydown', handleKeydown);

    setCanvas(fabricCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [design]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-10 bg-zinc-900 shadow-inner">
       <div className="shadow-2xl bg-white relative">
          <canvas ref={canvasRef} />
       </div>
    </div>
  );
}
