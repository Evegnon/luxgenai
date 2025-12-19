
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Image as ImageIcon, 
  Settings, 
  ShoppingBag,
  Footprints,
  Sparkles,
  ChevronRight,
  Upload,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Wand2,
  Camera,
  Play,
  ShieldCheck,
  Users,
  Key,
  BarChart3,
  Save,
  Activity,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  User as UserIcon,
  ArrowRight,
  Trash2,
  Plus,
  Info,
  Zap,
  Layers,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { AppView, Mannequin, Campaign, Scene, User, ApiConfig, ProductType } from './types';
import { analyzeProductAndPlanCampaign, getDemoImages } from './services/geminiService';
import { generateMultipleImages } from './services/seedreamService';
import { db } from './services/db';

// --- SHARED COMPONENTS ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = "button",
  icon: Icon
}: any) => {
  const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 whitespace-nowrap";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50",
    secondary: "bg-luxe-700 hover:bg-luxe-600 text-white border border-luxe-500/30",
    outline: "border border-purple-500/50 text-purple-200 hover:bg-purple-900/20",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// Reusable InputField component for forms
const InputField = ({ label, placeholder, type = 'text', icon: Icon, value, onChange, isSecret = false }: any) => {
  const [show, setShow] = useState(false);
  const inputType = isSecret ? (show ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input 
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-luxe-950 border border-luxe-800 rounded-2xl py-4 ${Icon ? 'pl-14' : 'px-6'} pr-14 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-slate-300 font-medium`}
        />
        {isSecret && (
          <button 
            type="button" 
            onClick={() => setShow(!show)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

const Footer = ({ full = true }: { full?: boolean }) => {
  if (!full) {
    return (
      <footer className="py-6 px-8 border-t border-luxe-700 text-center text-xs text-slate-500 bg-luxe-950/50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-purple-500" />
            <span>LuxeGen AI System v1.2</span>
          </div>
          <div className="flex gap-4">
            <span>© 2024 Studio Digital</span>
            <span className="text-green-500 flex items-center gap-1"><div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div> Server Active</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-luxe-950 border-t border-luxe-700 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">LuxeGen AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              L'excellence technologique au service de la haute maroquinerie et du luxe. Redéfinissez vos campagnes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-purple-400 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-purple-400 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-purple-400 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Produit</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Studio Photo IA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Casting Mannequins</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Génération Vidéo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Entreprise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Entreprise</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog Luxe</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Newsletter</h4>
            <p className="text-slate-400 text-xs mb-4">Recevez les dernières tendances de l'IA créative.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-luxe-900 border border-luxe-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-full" />
              <button className="bg-purple-600 p-2 rounded-lg text-white"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-luxe-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          <p>© 2024 LUXEGEN AI. TOUS DROITS RÉSERVÉS.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Navigation = ({ currentView, setView, onLogout, user }: { currentView: AppView, setView: (v: AppView) => void, onLogout: () => void, user: User | null }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: AppView.STUDIO, icon: PlusCircle, label: 'Studio' },
    { id: AppView.GALLERY, icon: ImageIcon, label: 'Galerie' },
    { id: AppView.SETTINGS, icon: Settings, label: 'Réglages' },
  ];

  if (!user) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-luxe-950/80 backdrop-blur-xl border-b border-luxe-700 h-20 px-6 md:px-12 flex items-center justify-between">
         <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView(AppView.LANDING)}>
            <div className="bg-gradient-to-tr from-purple-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-900/30 group-hover:scale-110 transition-transform">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-2xl font-serif font-bold text-white tracking-tight">LuxeGen <span className="text-purple-500">AI</span></span>
         </div>
         <div className="flex items-center gap-6">
            <button onClick={() => setView(AppView.AUTH)} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Accès Studio</button>
            <Button onClick={() => setView(AppView.AUTH)} className="!py-2.5 !px-6 text-sm uppercase tracking-widest font-bold">Essai Gratuit</Button>
         </div>
      </header>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-luxe-800/95 backdrop-blur-md border-t border-luxe-700 py-2 px-4 pb-6 md:pb-2 z-50 md:sticky md:top-0 md:h-screen md:w-28 md:flex flex-col justify-between border-r border-t-0 md:px-2 md:py-8">
      <div className="flex justify-between md:flex-col md:gap-8 w-full">
        <div className="hidden md:flex flex-col items-center mb-10">
           <div className="bg-purple-600 p-2 rounded-xl mb-4"><Sparkles size={24} className="text-white" /></div>
           <div className="h-[1px] w-12 bg-luxe-700"></div>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all ${
              currentView === item.id ? 'text-purple-400 bg-purple-500/10 shadow-lg shadow-purple-900/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={26} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block">{item.label}</span>
          </button>
        ))}
        
        {user.role === 'admin' && (
          <button
              onClick={() => setView(AppView.ADMIN)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all ${
                currentView === AppView.ADMIN ? 'text-red-400 bg-red-500/10' : 'text-slate-600 hover:text-red-400 hover:bg-red-500/5'
              }`}
            >
              <ShieldCheck size={26} strokeWidth={currentView === AppView.ADMIN ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block">Système</span>
          </button>
        )}
      </div>
      
      <div className="hidden md:flex flex-col items-center gap-6 border-t border-luxe-700 pt-8 mt-auto">
        <div className="w-10 h-10 rounded-full bg-luxe-700 border border-luxe-600 flex items-center justify-center font-bold text-slate-300">
           {user.name.charAt(0)}
        </div>
        <button
            onClick={onLogout}
            className="p-3 rounded-2xl text-slate-500 hover:text-white hover:bg-red-500/10 transition-all"
            title="Se déconnecter"
          >
            <LogOut size={22} />
        </button>
      </div>
    </nav>
  );
};

// --- VIEWS ---

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [mannequins, setMannequins] = useState<Mannequin[]>([]);

  useEffect(() => {
    db.mannequins.getAll().then(setMannequins);
  }, []);

  return (
    <div className="min-h-screen bg-luxe-950 text-white">
      {/* Hero Section */}
      <section className="relative px-6 pt-40 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in shadow-xl backdrop-blur-md">
           <Zap size={14} className="fill-purple-400" />
           Luxe AI Visual Production
        </div>
        
        <h1 className="text-6xl md:text-9xl font-serif font-bold mb-10 leading-[0.9] tracking-tighter animate-slide-up">
           L'Élégance <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600">Virtuelle</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mb-16 font-light leading-relaxed animate-fade-in">
          Générez des visuels publicitaires haut de gamme pour vos collections de sacs et chaussures sans contrainte logistique. Le futur de la mode est ici.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 animate-slide-up">
           <Button onClick={onGetStarted} icon={ArrowRight} className="!px-12 !py-5 text-lg font-bold uppercase tracking-widest shadow-2xl shadow-purple-500/20">Explorer le Studio</Button>
           <Button variant="secondary" className="!px-12 !py-5 text-lg font-bold uppercase tracking-widest">Voir la Collection</Button>
        </div>

        {/* Gallery Preview */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {[
            { img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800", title: "Collection Cristal" },
            { img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800", title: "Maroquinerie d'Or", featured: true },
            { img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800", title: "L'Éclat du Soir" }
          ].map((item, i) => (
            <div key={i} className={`bg-luxe-900/50 backdrop-blur-xl border border-luxe-700 rounded-[2.5rem] p-1.5 group relative ${item.featured ? 'md:-translate-y-6 md:scale-105 ring-1 ring-purple-500/30' : ''}`}>
               <div className="aspect-[3/4] overflow-hidden rounded-[2.2rem]">
                 <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" alt={item.title} />
               </div>
               <div className="p-8 text-left">
                 <h3 className="font-serif font-bold text-2xl mb-1">{item.title}</h3>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Série Limitée IA</p>
               </div>
               {item.featured && <div className="absolute -top-4 -right-4 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">Masterpiece</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-luxe-950 py-40 border-y border-luxe-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
           <div className="flex-1">
              <h2 className="text-5xl font-serif font-bold mb-8">Plus qu'un outil, une <span className="italic text-purple-400 underline decoration-1 underline-offset-8">Vision</span>.</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">
                Nous fusionnons l'intelligence artificielle générative avec les codes stricts de l'industrie du luxe pour offrir aux maisons de mode une agilité créative sans précédent.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <div className="text-3xl font-serif font-bold text-purple-400 mb-1">0.1s</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latence génération</div>
                 </div>
                 <div>
                    <div className="text-3xl font-serif font-bold text-indigo-400 mb-1">100%</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Respect produit</div>
                 </div>
              </div>
           </div>
           <div className="flex-1 relative">
              <div className="aspect-square bg-gradient-to-br from-purple-600 to-indigo-900 rounded-full blur-[100px] opacity-20 absolute inset-0"></div>
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800" className="relative z-10 rounded-3xl shadow-2xl grayscale" alt="Fashion Philosophy" />
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Dashboard = ({ user, onNewProject }: { user: User, onNewProject: () => void }) => {
  const [recentProjects, setRecentProjects] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  useEffect(() => { db.campaigns.getAll(user.id).then(setRecentProjects); }, [user.id]);

  // Supprimer une image d'une campagne
  const deleteImage = async (index: number) => {
    if (!selectedCampaign || !confirm('Supprimer cette image ?')) return;
    const updatedImages = selectedCampaign.generatedImages.filter((_, i) => i !== index);
    const updatedCampaign = { ...selectedCampaign, generatedImages: updatedImages };
    await db.campaigns.update(updatedCampaign);
    setSelectedCampaign(updatedCampaign);
    setRecentProjects(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  // Supprimer une campagne entière
  const deleteCampaign = async () => {
    if (!selectedCampaign || !confirm('Supprimer cette campagne et toutes ses images ?')) return;
    await db.campaigns.delete(selectedCampaign.id);
    setRecentProjects(prev => prev.filter(c => c.id !== selectedCampaign.id));
    setSelectedCampaign(null);
  };

  // Vue détail d'une campagne
  if (selectedCampaign) {
    return (
      <div className="p-8 md:p-12 animate-fade-in min-h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setSelectedCampaign(null)} className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft size={20} /> Retour aux archives
          </button>
          <Button variant="ghost" className="!text-red-400 hover:!text-red-300" onClick={deleteCampaign}>
            <Trash2 size={16} className="mr-2" /> Supprimer la campagne
          </Button>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-8">Campagne #{selectedCampaign.id.slice(-4)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {selectedCampaign.generatedImages.map((img, i) => (
            <div key={i} className="group relative rounded-[2rem] overflow-hidden shadow-2xl border border-luxe-800 hover:border-purple-500 transition-all">
              <img src={img} className="w-full h-full object-cover aspect-[9/16]" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 gap-2">
                <Button variant="secondary" className="!py-2 text-xs" onClick={async () => {
                  try {
                    const response = await fetch(img);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `luxegen_${selectedCampaign.id}_${i + 1}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } catch (e) { window.open(img, '_blank'); }
                }}>Télécharger</Button>
                <Button variant="ghost" className="!py-2 text-xs !text-red-400" onClick={() => deleteImage(i)}>Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 animate-fade-in min-h-full flex flex-col">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2 tracking-tight">Bonjour, {user.name}</h1>
          <p className="text-slate-500 text-sm font-medium">Vos ateliers créatifs sont prêts pour une nouvelle collection.</p>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="bg-luxe-800 border border-luxe-700 px-6 py-3 rounded-2xl flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Crédits</span>
              <span className="text-xl font-bold text-white">{user.credits}</span>
           </div>
           <div className="bg-luxe-800 border border-luxe-700 px-6 py-3 rounded-2xl flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Statut</span>
              <span className="text-sm font-bold text-purple-400 uppercase">{user.plan}</span>
           </div>
        </div>
      </header>

      <div className="relative overflow-hidden rounded-[2.5rem] bg-luxe-800 border border-luxe-700 p-12 shadow-2xl mb-16 group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="max-w-md">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-none">Studio Haute Couture</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Importez vos packshots produits et laissez l'IA orchestrer une campagne éditoriale complète en quelques minutes.
              </p>
              <Button onClick={onNewProject} icon={PlusCircle} className="!px-10 !py-4 shadow-xl">Nouvelle Création</Button>
           </div>
           <div className="flex gap-4">
              <div className="w-40 h-56 rounded-2xl bg-luxe-900 border border-luxe-700 overflow-hidden rotate-[-6deg] translate-x-4"><img src="https://picsum.photos/seed/d1/200/300" className="w-full h-full object-cover grayscale opacity-50" /></div>
              <div className="w-40 h-56 rounded-2xl bg-luxe-900 border border-luxe-700 overflow-hidden shadow-2xl relative z-10"><img src="https://picsum.photos/seed/d2/200/300" className="w-full h-full object-cover" /></div>
              <div className="w-40 h-56 rounded-2xl bg-luxe-900 border border-luxe-700 overflow-hidden rotate-[6deg] -translate-x-4"><img src="https://picsum.photos/seed/d3/200/300" className="w-full h-full object-cover grayscale opacity-50" /></div>
           </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-white">Archives de Campagnes</h3>
          <button className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Tout voir</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentProjects.slice(0, 4).map((p, i) => (
            <div key={i} onClick={() => setSelectedCampaign(p)} className="group cursor-pointer relative bg-luxe-800 rounded-[2rem] overflow-hidden shadow-lg border border-luxe-700 transition-all hover:border-purple-500/50">
              <div className="aspect-[3/4] overflow-hidden"><img src={p.generatedImages[0] || 'https://picsum.photos/seed/error/400/600'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" /></div>
              <div className="p-6">
                <h4 className="font-bold text-white mb-1">Campagne IA #{p.id.slice(-4)}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {recentProjects.length === 0 && (
             <div className="col-span-full py-20 bg-luxe-900/50 rounded-3xl border border-dashed border-luxe-700 flex flex-col items-center justify-center text-slate-600">
                <ImageIcon size={48} className="mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Aucune archive disponible</p>
             </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer full={false} />
      </div>
    </div>
  );
};

const Studio = ({ onBack, user }: { onBack: () => void, user: User }) => {
  const [step, setStep] = useState(1);
  const [pendingPlan, setPendingPlan] = useState<{ productType: ProductType; scenes: Scene[] } | null>(null);
  const [selectedMannequin, setSelectedMannequin] = useState<Mannequin | null>(null);
  const [previewMannequin, setPreviewMannequin] = useState<Mannequin | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [mannequins, setMannequins] = useState<Mannequin[]>([]);

  useEffect(() => { db.mannequins.getAll(user.id).then(setMannequins); }, [user.id]);

  const selectAndContinue = (m: Mannequin) => {
    setSelectedMannequin(m);
    setPreviewMannequin(null);
    setStep(2);
  };

  // Étape 1: Génération des prompts par Gemini
  const generatePrompts = async () => {
    if (!selectedMannequin || !productImage) return;
    setIsGenerating(true);
    setStep(4);
    try {
      const plan = await analyzeProductAndPlanCampaign(productImage, selectedMannequin.image, selectedMannequin.details, description, 4);
      setPendingPlan(plan);
      setStep(4); // Afficher les prompts pour validation
    } catch (e) {
      alert("Erreur Gemini. Vérifiez votre clé API.");
      setStep(3);
    } finally { setIsGenerating(false); }
  };

  // Étape 2: Génération des images après validation des prompts
  const startGeneration = async () => {
    if (!selectedMannequin || !productImage || !pendingPlan) return;
    setIsGenerating(true);
    setStep(5);
    try {
      const prompts = pendingPlan.scenes.map(scene => scene.prompt_image);
      // Passer l'image produit (base64) et l'image mannequin (URL) à Seedream
      const generatedImages = await generateMultipleImages(prompts, productImage, selectedMannequin.image);
      
      const finalImages = generatedImages.length > 0 
        ? generatedImages 
        : getDemoImages(pendingPlan.productType).slice(0, pendingPlan.scenes.length);
      
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        status: 'completed',
        mannequinId: selectedMannequin.id,
        product: { id: 'p1', image: productImage, type: pendingPlan.productType },
        scenes: pendingPlan.scenes,
        generatedImages: finalImages,
        createdAt: Date.now()
      };
      await db.campaigns.add(newCampaign, user.id);
      setCampaign(newCampaign);
      setStep(6);
    } catch (e) {
      alert("Erreur génération. Vérifiez vos clés API.");
      setStep(4);
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="h-full bg-luxe-950 text-white flex flex-col">
      <div className="px-8 py-6 border-b border-luxe-800 bg-luxe-950/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-white/5 rounded-full transition-all"><ArrowLeft size={20} /></button>
          <div>
            <h2 className="font-serif font-bold text-2xl tracking-tight">Studio Créatif</h2>
            <div className="flex gap-2 mt-1">
               {[1,2,3,4,5,6].map(s => <div key={s} className={`h-1 rounded-full transition-all ${step >= s ? 'w-8 bg-purple-500' : 'w-4 bg-luxe-800'}`}></div>)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 md:p-12">
        {step === 1 && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h3 className="text-3xl font-serif font-bold mb-10 text-center">Sélection de l'Égérie</h3>
            
            {/* Modal Preview Mannequin */}
            {previewMannequin && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setPreviewMannequin(null)}>
                <div className="bg-luxe-900 rounded-[2rem] overflow-hidden max-w-md w-full border border-luxe-700 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  <div className="relative flex-1 min-h-0">
                    <img src={previewMannequin.image} className="w-full h-[65vh] object-cover object-top" />
                    <button onClick={() => setPreviewMannequin(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-all">
                      <ArrowLeft size={20} />
                    </button>
                    {(previewMannequin as any).userId && (
                      <div className="absolute top-4 left-4 bg-purple-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Perso</div>
                    )}
                  </div>
                  <div className="p-5 bg-luxe-900 flex-shrink-0">
                    <h3 className="text-xl font-serif font-bold text-white mb-1">{previewMannequin.name}</h3>
                    <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">{previewMannequin.style || 'Custom'}</p>
                    {previewMannequin.details && <p className="text-slate-400 text-xs mb-3">{previewMannequin.details}</p>}
                    <Button onClick={() => selectAndContinue(previewMannequin)} icon={Camera} className="w-full !py-3 text-sm font-bold uppercase tracking-widest">
                      Utiliser pour la campagne
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Mes Mannequins Importés */}
            {mannequins.filter(m => (m as any).userId).length > 0 && (
              <div className="mb-12">
                <h4 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Users size={18} /> Mes Mannequins Importés
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {mannequins.filter(m => (m as any).userId).map(m => (
                    <div key={m.id} onClick={() => setPreviewMannequin(m)} className="group cursor-pointer rounded-3xl overflow-hidden aspect-[3/4] border-2 transition-all duration-500 relative border-purple-500/30 hover:border-purple-500 hover:scale-[1.02]">
                      <img src={m.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      <div className="absolute top-3 right-3 bg-purple-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Perso</div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                        <h4 className="font-bold text-lg">{m.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.style || 'Custom'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mannequins Catalogue */}
            <div>
              <h4 className="text-lg font-bold text-slate-400 mb-4 flex items-center gap-2">
                <Sparkles size={18} /> Catalogue LuxeGen
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {mannequins.filter(m => !(m as any).userId).map(m => (
                  <div key={m.id} onClick={() => setPreviewMannequin(m)} className="group cursor-pointer rounded-3xl overflow-hidden aspect-[3/4] border-2 transition-all duration-500 relative border-luxe-800 hover:border-luxe-600 hover:scale-[1.02]">
                    <img src={m.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                      <h4 className="font-bold text-lg">{m.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.style}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h3 className="text-3xl font-serif font-bold mb-10">Dépôt du Produit</h3>
            <div className="aspect-video bg-luxe-900/50 border-2 border-dashed border-luxe-700 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e:any) => {
                 const r = new FileReader(); r.onload = () => setProductImage(r.result as string); r.readAsDataURL(e.target.files[0]);
              }}/>
              {productImage ? <img src={productImage} className="max-h-full p-10" /> : (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-luxe-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Upload size={32} className="text-purple-400" /></div>
                  <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Faites glisser votre packshot ici</p>
                </div>
              )}
            </div>
            <div className="mt-12 flex justify-center gap-6"><Button variant="ghost" onClick={() => setStep(1)}>Précédent</Button><Button disabled={!productImage} onClick={() => setStep(3)} className="!px-16">Suivant</Button></div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto animate-fade-in">
             <h3 className="text-3xl font-serif font-bold mb-10 text-center">Direction Artistique</h3>
             <div className="space-y-6">
                <div className="bg-luxe-900 p-8 rounded-3xl border border-luxe-700">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Consignes de Style</label>
                  <textarea className="w-full bg-luxe-950 border border-luxe-800 rounded-2xl p-6 h-40 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-slate-300 leading-relaxed" placeholder="Lieu, lumière, attitude (ex: 'Une rue de Paris au crépuscule, lumière dorée, ambiance mystérieuse')..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="flex justify-between items-center"><Button variant="ghost" onClick={() => setStep(2)}>Précédent</Button><Button onClick={generatePrompts} className="!px-16" icon={Sparkles}>Analyser avec Gemini</Button></div>
             </div>
          </div>
        )}

        {step === 4 && !pendingPlan && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative mb-12">
               <div className="w-32 h-32 border-2 border-purple-500/20 rounded-full"></div>
               <div className="w-32 h-32 border-t-2 border-purple-500 rounded-full absolute inset-0 animate-spin"></div>
               <Sparkles size={40} className="absolute inset-0 m-auto text-purple-500 animate-bounce" />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight">Analyse Gemini</h2>
            <p className="text-slate-500 uppercase tracking-[0.3em] font-bold text-xs">Génération des prompts en cours...</p>
          </div>
        )}

        {step === 4 && pendingPlan && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h3 className="text-3xl font-serif font-bold mb-6 text-center">Prompts Générés par Gemini</h3>
            <p className="text-center text-slate-400 mb-8">Vérifiez les prompts avant de lancer la génération d'images</p>
            <div className="space-y-4 mb-8">
              {pendingPlan.scenes.map((scene, i) => (
                <div key={i} className="bg-luxe-900/50 border border-luxe-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold">Scène {i + 1}</span>
                    <h4 className="font-bold text-lg">{scene.title}</h4>
                    {scene.isPackshot && <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs">Packshot</span>}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{scene.prompt_image}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => { setPendingPlan(null); setStep(3); }}>Modifier</Button>
              <Button onClick={startGeneration} className="!px-16" icon={Sparkles}>Générer les Images</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative mb-12">
               <div className="w-32 h-32 border-2 border-purple-500/20 rounded-full"></div>
               <div className="w-32 h-32 border-t-2 border-purple-500 rounded-full absolute inset-0 animate-spin"></div>
               <Sparkles size={40} className="absolute inset-0 m-auto text-purple-500 animate-bounce" />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight">Génération Seedream</h2>
            <p className="text-slate-500 uppercase tracking-[0.3em] font-bold text-xs">Création des images en cours...</p>
          </div>
        )}

        {step === 6 && campaign && (
          <div className="animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {campaign.generatedImages.map((img, i) => (
                  <div key={i} className="group relative rounded-[2rem] overflow-hidden shadow-2xl border border-luxe-800 hover:border-purple-500 transition-all duration-500">
                    <img src={img} className="w-full h-full object-cover aspect-[9/16]" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                       <Button variant="secondary" className="!py-2 text-xs uppercase tracking-widest font-bold" onClick={async () => {
                         try {
                           const response = await fetch(img);
                           const blob = await response.blob();
                           const url = window.URL.createObjectURL(blob);
                           const link = document.createElement('a');
                           link.href = url;
                           link.download = `luxegen_scene_${i + 1}.jpg`;
                           document.body.appendChild(link);
                           link.click();
                           document.body.removeChild(link);
                           window.URL.revokeObjectURL(url);
                         } catch (e) {
                           window.open(img, '_blank');
                         }
                       }}>Télécharger HD</Button>
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-center gap-4"><Button onClick={() => setStep(1)} variant="secondary">Nouveau Projet</Button><Button onClick={onBack}>Retour Dashboard</Button></div>
          </div>
        )}
      </div>
      
      <Footer full={false} />
    </div>
  );
};

// --- AUTH & OTHER VIEWS ---

const AuthScreen = ({ onLogin, onBack }: { onLogin: (user: User) => void, onBack: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { user, error } = isLogin 
        ? await db.auth.signIn(formData.email, formData.password)
        : await db.auth.signUp(formData.email, formData.password, formData.name);
      if (error) throw new Error(error);
      if (user) onLogin(user);
    } catch (err: any) { setError(err.message || "Une erreur est survenue"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-luxe-950 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-900/10 via-transparent to-indigo-900/10 pointer-events-none"></div>
      <button onClick={onBack} className="absolute top-10 left-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Retour Accueil
      </button>

      <div className="bg-luxe-800/50 backdrop-blur-3xl border border-luxe-700 p-12 rounded-[3rem] w-full max-w-md relative z-10 shadow-2xl">
        <div className="text-center mb-10">
           <div className="bg-purple-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-purple-500/30"><Sparkles className="text-white" size={32} /></div>
           <h1 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">{isLogin ? "Bienvenue" : "Créer un Compte"}</h1>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Accédez à votre studio privé</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-center gap-3"><AlertTriangle size={16} />{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <InputField label="Nom Complet" placeholder="Prénom Nom" icon={UserIcon} value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})}/>}
          <InputField label="Adresse Email" placeholder="nom@maison-luxe.com" type="email" icon={Mail} value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})}/>
          <InputField label="Mot de passe" placeholder="••••••••" type="password" isSecret icon={Lock} value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})}/>
          <Button className="w-full !py-4 uppercase tracking-widest font-black" disabled={isLoading} type="submit">{isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? "Connexion" : "Inscription")}</Button>
        </form>

        <div className="mt-10 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-purple-400 transition-colors">
            {isLogin ? "Demander un accès studio" : "Déjà membre de la maison ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

const GalleryView = ({ user }: { user: User }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  useEffect(() => { db.campaigns.getAll(user.id).then(setCampaigns); }, [user.id]);

  const deleteImage = async (index: number) => {
    if (!selectedCampaign || !confirm('Supprimer cette image ?')) return;
    const updatedImages = selectedCampaign.generatedImages.filter((_, i) => i !== index);
    const updatedCampaign = { ...selectedCampaign, generatedImages: updatedImages };
    await db.campaigns.update(updatedCampaign);
    setSelectedCampaign(updatedCampaign);
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  const deleteCampaign = async () => {
    if (!selectedCampaign || !confirm('Supprimer cette campagne et toutes ses images ?')) return;
    await db.campaigns.delete(selectedCampaign.id);
    setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    setSelectedCampaign(null);
  };

  if (selectedCampaign) {
    return (
      <div className="p-8 md:p-12 animate-fade-in min-h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setSelectedCampaign(null)} className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft size={20} /> Retour à la galerie
          </button>
          <Button variant="danger" onClick={deleteCampaign}>
            <Trash2 size={16} className="mr-2" /> Supprimer la campagne
          </Button>
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-8">Campagne #{selectedCampaign.id.slice(-4)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {selectedCampaign.generatedImages.map((img, i) => (
            <div key={i} className="group relative rounded-[2rem] overflow-hidden shadow-2xl border border-luxe-800 hover:border-purple-500 transition-all">
              <img src={img} className="w-full h-full object-cover aspect-[9/16]" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 gap-2">
                <Button variant="secondary" className="!py-2 text-xs" onClick={async () => {
                  try {
                    const response = await fetch(img);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `luxegen_${selectedCampaign.id}_${i + 1}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } catch (e) { window.open(img, '_blank'); }
                }}>Télécharger</Button>
                <Button variant="danger" className="!py-2 text-xs" onClick={() => deleteImage(i)}>Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-10"><Footer full={false} /></div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 animate-fade-in flex flex-col min-h-full">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-2">Galerie Privée</h1>
        <p className="text-slate-500 text-sm font-medium">L'inventaire complet de vos productions IA.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         {campaigns.map(c => (
           <div key={c.id} onClick={() => setSelectedCampaign(c)} className="bg-luxe-800 rounded-[2rem] overflow-hidden border border-luxe-700 group hover:border-purple-500/30 transition-all cursor-pointer">
             <div className="aspect-[3/4] relative overflow-hidden">
               <img src={c.generatedImages[0]} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" />
               <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10">ID: {c.id.slice(-4)}</div>
             </div>
             <div className="p-6 flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
               <button className="text-purple-400 hover:text-white transition-colors"><ChevronRight size={18}/></button>
             </div>
           </div>
         ))}
      </div>
      <div className="mt-auto pt-10">
        <Footer full={false} />
      </div>
    </div>
  );
};

const SettingsView = ({ user }: { user: User }) => {
  const [mannequins, setMannequins] = useState<Mannequin[]>([]);
  const [newMannequin, setNewMannequin] = useState({ name: '', style: '', details: '', image: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => { db.mannequins.getAll(user.id).then(setMannequins); }, [user.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setNewMannequin({ ...newMannequin, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addMannequin = async () => {
    if (!newMannequin.name || !newMannequin.image) return alert("Nom et image requis");
    const m: Mannequin = { id: `user-m-${Date.now()}`, ethnicity: 'Custom', ...newMannequin };
    await db.mannequins.add(m, user.id);
    setMannequins([...mannequins, m]);
    setNewMannequin({ name: '', style: '', details: '', image: '' });
    setImagePreview(null);
  };

  const deleteMannequin = async (id: string) => {
    if (!confirm('Supprimer ce mannequin ?')) return;
    await db.mannequins.delete(id);
    setMannequins(mannequins.filter(m => m.id !== id));
  };

  return (
    <div className="p-8 md:p-12 animate-fade-in flex flex-col min-h-full">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-2">Préférences</h1>
        <p className="text-slate-500 text-sm font-medium">Gestion de votre identité studio.</p>
      </header>
      
      {/* Profil utilisateur */}
      <div className="max-w-4xl bg-luxe-800 p-10 rounded-[2.5rem] border border-luxe-700 space-y-10 mb-10">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-serif font-bold">{user.name.charAt(0)}</div>
            <div><h3 className="text-2xl font-bold">{user.name}</h3><p className="text-slate-500 text-sm">{user.email}</p></div>
         </div>
         <div className="h-[1px] bg-luxe-700"></div>
         <div className="flex justify-between items-center p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 mb-1">Plan Studio</p><p className="text-xl font-bold uppercase">{user.plan}</p></div>
            <Button variant="outline" className="text-xs font-bold uppercase">Upgrade</Button>
         </div>
      </div>

      {/* Mes Mannequins */}
      <div className="max-w-4xl bg-luxe-800 p-10 rounded-[2.5rem] border border-luxe-700">
        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
          <Users size={24} className="text-purple-400" /> Mes Mannequins
        </h2>
        <p className="text-slate-400 text-sm mb-8">Importez vos propres égéries pour les utiliser dans le Studio.</p>

        {/* Formulaire d'ajout */}
        <div className="bg-luxe-900/50 p-6 rounded-2xl border border-luxe-700 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-4">Ajouter un mannequin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Nom</label>
              <input type="text" value={newMannequin.name} onChange={(e) => setNewMannequin({...newMannequin, name: e.target.value})} 
                className="w-full bg-luxe-950 border border-luxe-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-300" placeholder="Ex: Clara" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Style</label>
              <input type="text" value={newMannequin.style} onChange={(e) => setNewMannequin({...newMannequin, style: e.target.value})} 
                className="w-full bg-luxe-950 border border-luxe-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-300" placeholder="Ex: Élégance Parisienne" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Description physique</label>
              <input type="text" value={newMannequin.details} onChange={(e) => setNewMannequin({...newMannequin, details: e.target.value})} 
                className="w-full bg-luxe-950 border border-luxe-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-300" placeholder="Ex: Cheveux bruns, yeux verts, teint clair" />
            </div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Photo du mannequin</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="bg-luxe-950 border border-dashed border-luxe-700 rounded-xl py-4 px-4 text-center text-slate-500 hover:border-purple-500 transition-all">
                  {imagePreview ? <img src={imagePreview} className="h-20 mx-auto rounded-lg object-cover" /> : <span className="flex items-center justify-center gap-2"><Upload size={16} /> Cliquer pour importer</span>}
                </div>
              </div>
            </div>
            <Button onClick={addMannequin} icon={Plus} className="!px-8">Ajouter</Button>
          </div>
        </div>

        {/* Liste des mannequins */}
        <div className="space-y-3">
          {mannequins.filter(m => (m as any).userId).map(m => (
            <div key={m.id} className="flex items-center gap-4 bg-luxe-900/50 p-4 rounded-xl border border-luxe-700">
              <img src={m.image} alt={m.name} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-bold text-white">{m.name}</p>
                <p className="text-sm text-slate-400">{m.style}</p>
              </div>
              <button onClick={() => deleteMannequin(m.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {mannequins.filter(m => (m as any).userId).length === 0 && (
            <p className="text-slate-500 text-center py-8 text-sm">Aucun mannequin personnalisé. Ajoutez-en un ci-dessus.</p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-10">
        <Footer full={false} />
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'mannequins' | 'users' | 'images'>('api');
  const [configs, setConfigs] = useState({ gemini: '', seedream: '', kling: '' });
  const [mannequins, setMannequins] = useState<Mannequin[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMannequin, setNewMannequin] = useState({ name: '', ethnicity: '', style: '', details: '', image: '' });
  const [landingImages, setLandingImages] = useState({ cristal: '', maroquinerie: '', eclat: '', philosophy: '' });

  useEffect(() => {
    db.apiConfig.getAll().then(setConfigs);
    db.mannequins.getAll().then(setMannequins);
    db.users.getAll().then(setUsers);
    const saved = localStorage.getItem('luxegen_landing_images');
    if (saved) setLandingImages(JSON.parse(saved));
  }, []);

  const saveConfigs = async () => { await db.apiConfig.save(configs); alert("Clés API sauvegardées."); };
  
  const addMannequin = async () => {
    if (!newMannequin.name) return alert("Le nom est requis.");
    const m: Mannequin = { id: `m-${Date.now()}`, ...newMannequin };
    await db.mannequins.add(m);
    setMannequins([...mannequins, m]);
    setNewMannequin({ name: '', ethnicity: '', style: '', details: '', image: '' });
  };

  const deleteMannequin = async (id: string) => {
    await db.mannequins.delete(id);
    setMannequins(mannequins.filter(m => m.id !== id));
  };

  const updateUser = async (user: User, field: 'status' | 'role', value: string) => {
    const updated = { ...user, [field]: value };
    await db.users.update(updated);
    setUsers(users.map(u => u.id === user.id ? updated : u));
  };

  const saveLandingImages = () => {
    localStorage.setItem('luxegen_landing_images', JSON.stringify(landingImages));
    alert("Images sauvegardées.");
  };

  const tabs = [
    { id: 'api', label: 'API' },
    { id: 'mannequins', label: 'Mannequins' },
    { id: 'users', label: 'Utilisateurs' },
    { id: 'images', label: 'Images Accueil' },
  ] as const;

  return (
    <div className="p-8 md:p-12 animate-fade-in flex flex-col min-h-full">
      <header className="flex items-center gap-6 mb-8">
        <div className="bg-red-500/20 p-4 rounded-2xl"><ShieldCheck className="text-red-500" size={32} /></div>
        <div>
          <h1 className="text-4xl font-serif font-bold mb-1 tracking-tight">Console Système</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Accès Prioritaire • Sécurisé</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-luxe-700 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-gold-500 text-luxe-900' 
                : 'bg-luxe-800 text-slate-400 hover:text-white hover:bg-luxe-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl bg-luxe-800 rounded-[2.5rem] border border-luxe-700 p-12 flex-1">
        {/* TAB: API */}
        {activeTab === 'api' && (
          <div>
            <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">Injections API</h2>
            <div className="space-y-8">
              <div className="flex gap-4 items-end">
                <div className="flex-1"><InputField label="Clé Gemini (IA Générative)" isSecret value={configs.gemini} onChange={(e:any) => setConfigs({...configs, gemini: e.target.value})} /></div>
                <Button onClick={async () => { await db.apiConfig.save(configs); alert("Clé Gemini sauvegardée."); }} className="!px-6" icon={Save}>Sauvegarder</Button>
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1"><InputField label="Clé Seedream (Moteur Rendu)" isSecret value={configs.seedream} onChange={(e:any) => setConfigs({...configs, seedream: e.target.value})} /></div>
                <Button onClick={async () => { await db.apiConfig.save(configs); alert("Clé Seedream sauvegardée."); }} className="!px-6" icon={Save}>Sauvegarder</Button>
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1"><InputField label="Clé Kling AI (Génération Vidéo)" isSecret value={configs.kling} onChange={(e:any) => setConfigs({...configs, kling: e.target.value})} /></div>
                <Button onClick={async () => { await db.apiConfig.save(configs); alert("Clé Kling AI sauvegardée."); }} className="!px-6" icon={Save}>Sauvegarder</Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Mannequins */}
        {activeTab === 'mannequins' && (
          <div>
            <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">Gestion Mannequins</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <InputField label="Nom" value={newMannequin.name} onChange={(e:any) => setNewMannequin({...newMannequin, name: e.target.value})} />
              <InputField label="Ethnicité" value={newMannequin.ethnicity} onChange={(e:any) => setNewMannequin({...newMannequin, ethnicity: e.target.value})} />
              <InputField label="Style" value={newMannequin.style} onChange={(e:any) => setNewMannequin({...newMannequin, style: e.target.value})} />
              <InputField label="URL Image" value={newMannequin.image} onChange={(e:any) => setNewMannequin({...newMannequin, image: e.target.value})} />
              <div className="md:col-span-2">
                <InputField label="Détails" value={newMannequin.details} onChange={(e:any) => setNewMannequin({...newMannequin, details: e.target.value})} />
              </div>
            </div>
            <Button onClick={addMannequin} className="!px-8 mb-8" icon={Plus}>Ajouter Mannequin</Button>
            <div className="space-y-4">
              {mannequins.map(m => (
                <div key={m.id} className="flex items-center gap-4 bg-luxe-900/50 p-4 rounded-xl border border-luxe-700">
                  {m.image && <img src={m.image} alt={m.name} className="w-16 h-20 object-cover rounded-lg" />}
                  <div className="flex-1">
                    <p className="font-bold text-white">{m.name}</p>
                    <p className="text-sm text-slate-400">{m.ethnicity} • {m.style}</p>
                  </div>
                  <button onClick={() => deleteMannequin(m.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {mannequins.length === 0 && <p className="text-slate-500 text-center py-8">Aucun mannequin enregistré</p>}
            </div>
          </div>
        )}

        {/* TAB: Users */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">Gestion Utilisateurs</h2>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="bg-luxe-900/50 p-4 rounded-xl border border-luxe-700">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Plan:</span>
                      <span className="text-gold-400 font-medium">{user.plan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Crédits:</span>
                      <span className="text-white font-medium">{user.credits}</span>
                    </div>
                    <select
                      value={user.role}
                      onChange={(e) => updateUser(user, 'role', e.target.value)}
                      className="bg-luxe-700 text-white px-3 py-2 rounded-lg text-sm border border-luxe-600"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <select
                      value={user.status}
                      onChange={(e) => updateUser(user, 'status', e.target.value)}
                      className={`px-3 py-2 rounded-lg text-sm border ${
                        user.status === 'active' 
                          ? 'bg-green-900/30 text-green-400 border-green-700' 
                          : 'bg-red-900/30 text-red-400 border-red-700'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p className="text-slate-500 text-center py-8">Aucun utilisateur</p>}
            </div>
          </div>
        )}

        {/* TAB: Landing Images */}
        {activeTab === 'images' && (
          <div>
            <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-white">Images Page d'Accueil</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-gold-400 font-bold mb-4 uppercase tracking-wider text-sm">Galerie Collections</h3>
                <div className="space-y-4">
                  <InputField label="Collection Cristal (URL)" value={landingImages.cristal} onChange={(e:any) => setLandingImages({...landingImages, cristal: e.target.value})} />
                  <InputField label="Maroquinerie d'Or (URL)" value={landingImages.maroquinerie} onChange={(e:any) => setLandingImages({...landingImages, maroquinerie: e.target.value})} />
                  <InputField label="L'Éclat du Soir (URL)" value={landingImages.eclat} onChange={(e:any) => setLandingImages({...landingImages, eclat: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 className="text-gold-400 font-bold mb-4 uppercase tracking-wider text-sm">Section Philosophy</h3>
                <InputField label="Image Philosophy (URL)" value={landingImages.philosophy} onChange={(e:any) => setLandingImages({...landingImages, philosophy: e.target.value})} />
              </div>
              <Button onClick={saveLandingImages} className="!px-12 mt-4 font-black uppercase tracking-widest" icon={Save}>Sauvegarder Images</Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-10">
        <Footer full={false} />
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [currentView, setView] = useState<AppView>(AppView.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await db.auth.signOut();
    setCurrentUser(null);
    setView(AppView.LANDING);
  };

  const renderView = () => {
    switch(currentView) {
      case AppView.LANDING: return <LandingPage onGetStarted={() => setView(AppView.AUTH)} />;
      case AppView.AUTH: return <AuthScreen onLogin={handleLogin} onBack={() => setView(AppView.LANDING)} />;
      case AppView.DASHBOARD: 
        return currentUser ? <Dashboard user={currentUser} onNewProject={() => setView(AppView.STUDIO)} /> : <AuthScreen onLogin={handleLogin} onBack={() => setView(AppView.LANDING)} />;
      case AppView.STUDIO: 
        return currentUser ? <Studio onBack={() => setView(AppView.DASHBOARD)} user={currentUser} /> : <AuthScreen onLogin={handleLogin} onBack={() => setView(AppView.LANDING)} />;
      case AppView.GALLERY: 
        return currentUser ? <GalleryView user={currentUser} /> : <AuthScreen onLogin={handleLogin} onBack={() => setView(AppView.LANDING)} />;
      case AppView.SETTINGS: 
        return currentUser ? <SettingsView user={currentUser} /> : <AuthScreen onLogin={handleLogin} onBack={() => setView(AppView.LANDING)} />;
      case AppView.ADMIN: 
        return currentUser?.role === 'admin' ? <AdminPanel /> : <AuthScreen onLogin={handleLogin} onBack={() => setView(AppView.LANDING)} />;
      default: return <LandingPage onGetStarted={() => setView(AppView.AUTH)} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-luxe-950 font-sans text-slate-100 overflow-x-hidden">
      <Navigation currentView={currentView} setView={setView} onLogout={handleLogout} user={currentUser} />
      <main className="flex-1 relative flex flex-col">{renderView()}</main>
    </div>
  );
}
