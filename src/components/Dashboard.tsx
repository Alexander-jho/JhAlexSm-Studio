
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, LayoutGrid, List, Clock, Star, Trash, Folder } from 'lucide-react';
import { db, auth } from '../lib/firebase.ts';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(
        collection(db, 'designs'),
        where('ownerId', '==', auth.currentUser.uid),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setDesigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  const createNewDesign = async () => {
    if (!auth.currentUser) return;
    const loadingToast = toast.loading("Setting up your workspace...");
    try {
      const newDesign = {
        ownerId: auth.currentUser.uid,
        title: "Untitled Design",
        canvasData: JSON.stringify({ version: "5.3.0", objects: [] }),
        thumbnail: '',
        type: 'image',
        width: 1080,
        height: 1080,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isFavorite: false,
        isTrashed: false
      };
      const docRef = await addDoc(collection(db, 'designs'), newDesign);
      toast.success("Workspace ready!", { id: loadingToast });
      navigate(`/editor/${docRef.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not create design", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-line flex flex-col p-6 hidden lg:flex shrink-0 bg-bg-surface">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-indigo-600 rounded-lg flex items-center justify-center font-bold">JS</div>
          <span className="font-bold tracking-tight">JhAlexMS-Studio</span>
        </div>

        <button 
          onClick={createNewDesign}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-blue-600 rounded-lg font-bold mb-8 transition-colors shadow-lg shadow-accent/10"
        >
          <Plus size={18} />
          Create New
        </button>

        <nav className="space-y-1">
          <NavItem icon={<LayoutGrid size={18} />} label="All Designs" active />
          <NavItem icon={<Star size={18} />} label="Favorites" />
          <NavItem icon={<Folder size={18} />} label="Folders" />
          <NavItem icon={<Trash size={18} />} label="Trash" />
        </nav>

        <div className="mt-auto pt-6 border-t border-line">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-bg-card border border-line overflow-hidden">
                <img src={auth.currentUser?.photoURL || ''} alt="" className="w-full h-full object-cover" />
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{auth.currentUser?.displayName}</p>
                <p className="text-[10px] text-text-muted truncate uppercase tracking-widest">{auth.currentUser?.email}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Workspace</h1>
            <p className="text-text-muted text-sm font-medium">Professional Creative Dashboard</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                   type="text" 
                   placeholder="Search designs..." 
                   className="bg-bg-surface border border-line rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 w-64 transition-all placeholder:text-zinc-700"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                />
             </div>
             <div className="flex bg-bg-surface rounded-md p-1 border border-line">
                <button 
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-bg-card text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-bg-card text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                >
                  <List size={18} />
                </button>
             </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-[4/3] bg-bg-surface rounded-xl animate-pulse border border-line" />
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-bg-surface rounded-[24px] flex items-center justify-center mb-6 border border-line">
               <Plus className="text-text-muted" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">No designs yet</h2>
            <p className="text-text-muted max-w-sm mb-6">Start building your masterpiece with our professional studio tools.</p>
            <button 
              onClick={createNewDesign}
              className="px-8 py-3 bg-accent rounded-lg font-bold hover:bg-blue-600 transition-all shadow-lg shadow-accent/10"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {designs.map((design) => (
              <DesignCard 
                key={design.id} 
                design={design} 
                view={view}
                onClick={() => navigate(`/editor/${design.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${active ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}>
      {icon}
      {label}
    </button>
  );
}

function DesignCard({ design, onClick, view }: { design: any, onClick: () => void, view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div 
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-bg-surface border border-line rounded-xl hover:border-accent transition-all cursor-pointer group"
      >
        <div className="w-16 h-16 bg-bg-dark rounded-md border border-line flex items-center justify-center overflow-hidden shrink-0">
          {design.thumbnail ? (
            <img src={design.thumbnail} className="w-full h-full object-cover" />
          ) : (
            <LayoutGrid className="text-bg-card" size={24} />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold group-hover:text-accent transition-colors">{design.title}</h3>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-[9px] uppercase tracking-widest font-black text-text-muted bg-bg-card border border-line px-2 py-0.5 rounded">
                {design.type || 'IMAGE'}
             </span>
             <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                <Clock size={12} />
                {new Date(design.updatedAt?.seconds * 1000).toLocaleDateString()}
             </span>
          </div>
        </div>
        <button className="p-2 hover:bg-bg-card rounded-md text-text-muted hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    );
  }

  return (
    <div 
       onClick={onClick}
       className="bg-bg-surface border border-line rounded-xl overflow-hidden hover:border-accent transition-all cursor-pointer group flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-black/50"
    >
      <div className="aspect-[4/3] bg-bg-dark relative overflow-hidden flex items-center justify-center border-line border-b">
         {design.thumbnail ? (
            <img src={design.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
         ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-bg-card bg-bg-dark">
               <LayoutGrid size={40} className="mb-2 opacity-20" />
            </div>
         )}
         <div className="absolute inset-0 bg-bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="px-6 py-2 bg-white text-black font-bold text-xs rounded-md transform translate-y-2 group-hover:translate-y-0 transition-all uppercase tracking-widest">Open Studio</button>
         </div>
      </div>
      <div className="p-4 flex items-center justify-between mt-auto">
        <div className="overflow-hidden">
          <h3 className="font-bold truncate text-sm group-hover:text-accent transition-colors">{design.title}</h3>
          <p className="text-[10px] text-text-muted flex items-center gap-1 mt-1 font-bold uppercase tracking-tighter">
             {design.width} × {design.height} PX
          </p>
        </div>
        <button className="p-2 hover:bg-bg-card rounded-md text-text-muted hover:text-white">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
