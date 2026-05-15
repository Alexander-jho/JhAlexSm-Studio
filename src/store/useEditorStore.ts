
import { create } from 'zustand';
import * as fabric from 'fabric';

interface EditorState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  activeObject: fabric.Object | null;
  setActiveObject: (obj: fabric.Object | null) => void;
  history: string[];
  historyIndex: number;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  activeObject: null,
  setActiveObject: (obj) => set({ activeObject: obj }),
  history: [],
  historyIndex: -1,
  saveToHistory: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },
  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;
    const prevIndex = historyIndex - 1;
    const prevData = history[prevIndex];
    canvas.loadFromJSON(prevData, () => {
      canvas.renderAll();
      set({ historyIndex: prevIndex });
    });
  },
  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const nextData = history[nextIndex];
    canvas.loadFromJSON(nextData, () => {
      canvas.renderAll();
      set({ historyIndex: nextIndex });
    });
  },
  zoom: 1,
  setZoom: (zoom) => {
    const { canvas } = get();
    if (canvas) {
      canvas.setZoom(zoom);
    }
    set({ zoom });
  }
}));
