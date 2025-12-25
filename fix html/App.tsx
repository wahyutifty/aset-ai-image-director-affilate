import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle2, XCircle, ArrowRight, Wand2, 
  Upload, Sparkles, Video, User, 
  ChevronDown, Zap, Smartphone, Monitor, Clapperboard, 
  Copy, ExternalLink, Image as ImageIcon, 
  Home, ShoppingBag, Camera, Coffee, Plane, AlertCircle, 
  Loader2, Lock, Footprints, X, FileText, 
  RefreshCw, Globe, PenTool, FileDown, 
  Repeat, Users, MessageCircle, Building, Trash2, 
  MousePointer2, ShoppingCart
} from 'lucide-react';
import { generateCampaign } from './geminiService';
import { CampaignData, StoryboardShot } from './types';
import { 
  CHECKOUT_LINK, 
  DEFAULT_PRODUCT_IMAGE, 
  DEMO_VIDEOS, 
  CONTENT_STYLES, 
  RECENT_ACTIVITIES,
  STORY_FLOWS,
  getIcon
} from './constants';

// --- CUSTOM STYLES FOR ANIMATION ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  body { font-family: 'Inter', sans-serif; overflow-x: hidden; }

  @keyframes aurora {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0, 0) scale(1); }
  }
  .animate-aurora { animation: aurora 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
  
  @keyframes float { 
      0%, 100% { transform: translateY(0px); } 
      50% { transform: translateY(-20px); } 
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-slow { animation: float 8s ease-in-out infinite; }
  .animate-float-fast { animation: float 4s ease-in-out infinite; }
  
  @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
  .animate-scan { animation: scan 3s linear infinite; }
  
  .reveal-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      will-change: opacity, transform;
  }
  
  .reveal-on-scroll.is-visible {
      opacity: 1;
      transform: translateY(0);
  }

  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  html { scroll-behavior: smooth; }
  
  .animate-gradient { background-size: 200% auto; animation: gradient 3s linear infinite; }
  @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
`;

const GLOBAL_PRODUCT_DESCRIPTION = `Scarlett Whitening Loving Fragrance Body Lotion adalah losion tubuh yang dirancang khusus untuk mencerahkan sekaligus memperkuat pertahanan kulit (skin barrier). Dengan aroma floral-fruity yang manis dan segar, losion ini memberikan kelembapan intensif tanpa rasa lengket.`;

// --- HARDCODED CAMPAIGN DATA FOR PROTOTYPE ---

const AD_CAMPAIGN_DATA = {
    title: "Rahasia kulit cerah dan skin barrier kuat! Scarlett Loving Body Lotion dengan 7X Ceramide.",
    hashtags: "#ScarlettWhitening #BodyLotion #Ceramide #MencerahkanKulit #SkinBarrier #PerawatanTubuh",
    script: `Kulit cerah dan sehat dimulai dari skin barrier yang kuat. Scarlett Loving Body Lotion dengan 7X Ceramide melindungi dan mengunci kelembapan kulitmu seharian. Diperkaya Glutathione dan Niacinamide, kulit kusam teratasi, terlindungi dari UV. Rasakan kulit kenyal dan wangi floral-fruity yang tahan lama.`,
    productDescription: GLOBAL_PRODUCT_DESCRIPTION,
    storyboard: [
        {
            shot_number: 1,
            imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ads/scene_1.png",
            visual_prompt: "Medium shot, wanita Asia elegan mengenakan atasan pink. Dia memegang botol Scarlett Loving Body Lotion (botol pink) di tangan kanannya, dengan kulit lengan tampak cerah dan berkilau. Ekspresi profesional. Latar belakang studio mewah, pencahayaan dramatis.",
            voiceover_script: "Kulit cerah dan sehat dimulai dari skin barrier yang kuat.",
            platformPrompts: { dreamina: "...", grok: "...", meta: "..." }
        },
        {
            shot_number: 2,
            imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ads/scene_2.png",
            visual_prompt: "B-ROLL. Close up estetika sinematik, fokus pada tangan wanita Asia yang mengaplikasikan tekstur losion tubuh berwarna pink muda (Scarlett Loving) ke kulit.",
            voiceover_script: "Scarlett Loving Body Lotion dengan 7X Ceramide melindungi dan mengunci kelembapan kulitmu seharian.",
            platformPrompts: { dreamina: "...", grok: "...", meta: "..." }
        },
        {
            shot_number: 3,
            imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ads/scene_3.png",
            visual_prompt: "B-ROLL. Close up botol Scarlett Loving Body Lotion (botol pink dengan label hot pink). Botol berputar perlahan dalam gaya CGI 3D.",
            voiceover_script: "dengan 7X Ceramide melindungi...",
            platformPrompts: { dreamina: "...", grok: "...", meta: "..." }
        },
        {
            shot_number: 4,
            imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ads/scene_4.png",
            visual_prompt: "B-ROLL. Makro shot, transisi estetik cairan kental pink (melambangkan lotion) yang menyebar di permukaan kulit.",
            voiceover_script: "Diperkaya Glutathione dan Niacinamide, kulit kusam teratasi, terlindungi dari UV.",
            platformPrompts: { dreamina: "...", grok: "...", meta: "..." }
        },
        {
            shot_number: 5,
            imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ads/scene_5.png",
            visual_prompt: "Medium shot, wanita Asia elegan mengenakan atasan pink, tersenyum ramah dan mengangguk setuju ke kamera.",
            voiceover_script: "Rasakan kulit kenyal dan wangi floral-fruity yang tahan lama.",
            platformPrompts: { dreamina: "...", grok: "...", meta: "..." }
        }
    ]
};

const UGC_CAMPAIGN_DATA = {
    title: "Review Jujur: Kulit Kusam Auto Cerah? | UGC Testimoni",
    hashtags: "#ReviewJujur #SkincareRoutine #UGCIndonesia #GlowUp #Testimoni",
    script: "Jujur, aku capek banget sama kulit kusam dan kering. Udah coba macem-macem tapi nihil. Terus aku nemu Scarlett Loving Body Lotion ini. Teksturnya ringan banget, gak lengket sama sekali! Lihat deh, sekali oles langsung lembab dan glowing. Wanginya juga enak banget, kayak parfum mahal. Fix, kalian wajib coba sekarang juga!",
    productDescription: GLOBAL_PRODUCT_DESCRIPTION,
    storyboard: [
        { shot_number: 1, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ugc/scene_1.png", visual_prompt: "Shot Selfie/POV (UGC Style)...", voiceover_script: "Jujur, aku capek banget...", platformPrompts: {} },
        { shot_number: 2, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ugc/scene_2.png", visual_prompt: "POV Shot. Tangan wanita memegang botol...", voiceover_script: "Terus aku nemu Scarlett...", platformPrompts: {} },
        { shot_number: 3, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ugc/scene_3.png", visual_prompt: "Close-up Shot (Texture)...", voiceover_script: "Teksturnya ringan banget...", platformPrompts: {} },
        { shot_number: 4, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ugc/scene_4.png", visual_prompt: "Medium Shot. Wanita yang sama...", voiceover_script: "Lihat deh, sekali oles...", platformPrompts: {} },
        { shot_number: 5, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ugc/scene_5.png", visual_prompt: "Medium Shot (CTA)...", voiceover_script: "Fix, kalian wajib coba...", platformPrompts: {} }
    ]
};

const AESTHETIC_CAMPAIGN_DATA = {
    title: "Morning Self-Care Routine: Aesthetic & Calm",
    hashtags: "#AestheticVlog #SelfCare #MorningRoutine #ScarlettWhitening #POV #SoftGirl",
    script: "(Soft whispering/calm voice) Start your day with a little act of self-love. Gentle on the skin, soothing for the soul. It's not just a lotion, it's a mood booster. Feel the glow, embrace the day.",
    productDescription: GLOBAL_PRODUCT_DESCRIPTION,
    storyboard: [
        { shot_number: 1, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/asthetic/scene_1.png", visual_prompt: "POV Shot...", voiceover_script: "Start your day...", platformPrompts: {} },
        { shot_number: 2, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/asthetic/scene_2.png", visual_prompt: "Extreme Close Up...", voiceover_script: "Gentle on the skin...", platformPrompts: {} },
        { shot_number: 3, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/asthetic/scene_3.png", visual_prompt: "Close Up Action...", voiceover_script: "soothing for the soul.", platformPrompts: {} },
        { shot_number: 4, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/asthetic/scene_4.png", visual_prompt: "POV / Over the shoulder...", voiceover_script: "It's not just a lotion...", platformPrompts: {} },
        { shot_number: 5, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/asthetic/scene_5.png", visual_prompt: "Wide / Medium Shot...", voiceover_script: "Feel the glow...", platformPrompts: {} }
    ]
};

const CINEMATIC_CAMPAIGN_DATA = {
    title: "Rahasia kulit cerah dan skin barrier kuat! Scarlett Loving Body Lotion dengan 7X Ceramide.",
    hashtags: "#Scarlett #BodyLotion #LotionMencerahkan #SkinBarrier #ScarlettLoving #Ceramide",
    script: "Lotion yang bikin kulit cerah dan wanginya mewah banget? Ini rahasia kulit glowing tanpa rasa lengket. Dengan 7X Ceramide, skin barrier kamu langsung terlindungi. Ada Glutathione dan Niacinamide buat mencerahkan kulit kusam! Plus UV Protection, siap glowing dan wangi floral-fruity segar seharian!",
    productDescription: GLOBAL_PRODUCT_DESCRIPTION,
    storyboard: [
        { shot_number: 1, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/cinematic%20mode/scene_1.png", visual_prompt: "Close-up sinematik...", voiceover_script: "Lotion yang bikin kulit cerah...", platformPrompts: {} },
        { shot_number: 2, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/cinematic%20mode/scene_2.png", visual_prompt: "Close-up (medium shot)...", voiceover_script: "Ini rahasia kulit glowing...", platformPrompts: {} },
        { shot_number: 3, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/cinematic%20mode/scene_3.png", visual_prompt: "Ultra close-up...", voiceover_script: "Dengan 7X Ceramide...", platformPrompts: {} },
        { shot_number: 4, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/cinematic%20mode/scene_4.png", visual_prompt: "Medium shot sinematik...", voiceover_script: "Ada Glutathione...", platformPrompts: {} },
        { shot_number: 5, imageUrl: "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/cinematic%20mode/scene_5.png", visual_prompt: "Full body shot...", voiceover_script: "Plus UV Protection...", platformPrompts: {} }
    ]
};


// --- UTILS ---
const ensureString = (value: any) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return String(value);
};

const copyTextToClipboard = async (text: string) => {
    if (!text) return false;
    if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(text); return true; } catch (e) {}
    }
    return false;
};

// --- COMPONENTS ---

const WelcomeModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-500">
            <div className="bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] rounded-[2rem] p-8 max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Welcome to Future Studio</h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Gateway to AI Content Creation</p>
                </div>
                <div className="space-y-3 mb-8">
                    <a href="https://wa.me/6288985584050" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group">
                        <div className="bg-green-50 text-green-600 p-2 rounded-lg group-hover:bg-green-100 transition-colors"><MessageCircle size={16} /></div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">Chat Admin WhatsApp</span>
                    </a>
                    <a href={CHECKOUT_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group">
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors"><ShoppingCart size={16} /></div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">Beli Tool Sekarang</span>
                    </a>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 mb-4 bg-slate-50 py-1.5 rounded-lg border border-slate-100 inline-block px-4">
                        ⚠️ 1 USER 1 LINK
                    </p>
                    <button onClick={onClose} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                        Masuk ke Landing Page <ArrowRight size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const UploadCard = ({ label, hasFile, onChange, icon, fileData, onClear, previewUrl, className }: any) => {
    const displayIcon = icon || <Upload size={16}/>;
    const displayPreview = fileData ? `data:${fileData.mimeType};base64,${fileData.data}` : previewUrl;
    const isFilled = !!displayPreview; 

    return (
        <label className={`relative flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 group overflow-hidden ${isFilled ? 'bg-white border-indigo-300 shadow-md' : 'bg-white/40 border-slate-300 hover:border-indigo-300 hover:bg-white/60'} ${className}`}>
            {isFilled && (
                <div className="absolute inset-0 z-0">
                    <img 
                        src={displayPreview} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        alt="Preview" 
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-indigo-900/30"></div>
                </div>
            )}
            
            <div className={`mb-2 p-3 rounded-full transition-transform duration-300 group-hover:scale-110 relative z-10 ${isFilled ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                {isFilled ? <CheckCircle2 size={18}/> : displayIcon}
            </div>
            
            <span className={`text-[10px] font-bold relative z-10 uppercase tracking-wide ${isFilled ? 'text-white drop-shadow-md' : 'text-slate-500'}`}>{label}</span>
            <input type="file" accept="image/*" onChange={onChange} className="hidden" />
            
            {isFilled && (
                <button 
                    onClick={(e) => { e.preventDefault(); onClear(); }}
                    className="absolute top-2 right-2 z-20 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-sm"
                >
                    <Trash2 size={12}/>
                </button>
            )}
        </label>
    );
};

const GlassShotCard = ({ shot, index, onRegenerate, flowLabel }: any) => {
    const [tool, setTool] = useState<string | null>(null); 
    const [showTools, setShowTools] = useState(false);
    const [imgSrc, setImgSrc] = useState(shot.imageUrl || DEFAULT_PRODUCT_IMAGE);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(shot.imageUrl || DEFAULT_PRODUCT_IMAGE);
        setHasError(false);
    }, [shot.imageUrl]);
    
    const FALLBACK_IMAGES = [
        "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=400&h=700&fit=crop",
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&h=700&fit=crop",
        "https://images.unsplash.com/photo-1596462502278-27bfdd403cc6?w=400&h=700&fit=crop",
        "https://images.unsplash.com/photo-1611080541599-8c6dbde6edb8?w=400&h=700&fit=crop",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=700&fit=crop"
    ];

    const handleError = () => {
        if (!hasError) {
            setImgSrc(FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]);
            setHasError(true);
        }
    };
    
    const getDisplayPrompt = (t: string) => {
        const prompts = shot.platformPrompts || {};
        let p = t === 'dreamina' ? prompts.dreamina : (t === 'grok' ? prompts.grok : prompts.meta);
        return ensureString(p) || "Prompt not available.";
    };

    const TOOL_LINKS: any = {
        dreamina: "https://dreamina.capcut.com/ai-tool/home",
        grok: "https://grok.com/",
        meta: "https://www.meta.ai/"
    };

    return (
        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgb(0,0,0,0.05)] border border-white hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
            <div className="relative aspect-[9/16] bg-slate-100 overflow-hidden">
                {shot.isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-500 bg-slate-50"><Loader2 className="w-8 h-8 animate-spin mb-2" /><span className="text-[10px] font-bold tracking-widest uppercase opacity-50">Rendering</span></div>
                ) : (
                    <>
                        <img 
                            src={imgSrc} 
                            onError={handleError}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            alt={`Shot ${index + 1}`} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm">{ensureString(flowLabel)}</div>
                        <button onClick={() => onRegenerate && onRegenerate(index)} className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-slate-600 hover:text-indigo-600 shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"><RefreshCw size={14} /></button>
                    </>
                )}
            </div>
            <div className="p-4 bg-white relative z-20">
                {!showTools ? (
                    <button 
                        onClick={() => setShowTools(true)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        <Video size={16} className="group-hover/btn:animate-bounce"/> Hasilkan Video
                    </button>
                ) : (
                    <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                         <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pilih Platform AI</span>
                            <button onClick={() => { setShowTools(false); setTool(null); }} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14}/></button>
                         </div>
                        <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                            {['dreamina', 'grok', 'meta'].map(t => (
                                <button key={t} onClick={() => setTool(tool === t ? null : t)} className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-lg transition-all ${tool === t ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                )}

                {tool && showTools && (
                    <div className="absolute bottom-full left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-white/50 shadow-2xl rounded-t-3xl animate-in slide-in-from-bottom-2 z-30">
                        <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold text-indigo-500 uppercase">{tool} Prompt</span><button onClick={() => setTool(null)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button></div>
                        <div className="h-24 overflow-y-auto custom-scrollbar text-[10px] text-slate-600 font-mono leading-tight mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">{getDisplayPrompt(tool)}</div>
                        
                        <button onClick={() => {copyTextToClipboard(getDisplayPrompt(tool)); alert('Copied!');}} className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-black transition-colors mb-2"><Copy size={12}/> Copy Prompt</button>
                        
                        <a href={TOOL_LINKS[tool]} target="_blank" rel="noreferrer" className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors">
                            <ExternalLink size={12}/> Buka {tool.charAt(0).toUpperCase() + tool.slice(1)}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

const SocialProofPopup = () => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(RECENT_ACTIVITIES[0]);

    useEffect(() => {
        let hideTimer: any, nextTimer: any;
        const showNotification = () => {
        const randomData = RECENT_ACTIVITIES[Math.floor(Math.random() * RECENT_ACTIVITIES.length)];
        setData(randomData);
        setVisible(true);
        hideTimer = setTimeout(() => {
            setVisible(false);
            const randomDelay = 3000 + Math.random() * 5000;
            nextTimer = setTimeout(showNotification, randomDelay);
        }, 4000); 
        };
        const initialTimer = setTimeout(showNotification, 2000);
        return () => { clearTimeout(initialTimer); clearTimeout(hideTimer); clearTimeout(nextTimer); };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-500 pointer-events-none scale-90 md:scale-100 origin-bottom-right">
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 p-3 pr-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center gap-3 max-w-sm ring-1 ring-indigo-50 transform hover:scale-105 transition-transform cursor-pointer pointer-events-auto">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xs flex-shrink-0">{data.name.charAt(0)}</div>
                <div>
                    <p className="text-xs text-slate-800 font-bold leading-tight"><span className="text-indigo-600">{data.name}</span> dari {data.location}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-slate-500 font-medium">{data.action} • {data.time}</p>
                    </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setVisible(false); }} className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 transition-colors"><X size={10} /></button>
            </div>
        </div>
    )
};

const AuroraBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-blue-200/30 rounded-full blur-[120px] animate-aurora mix-blend-multiply"></div>
        <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-200/30 rounded-full blur-[100px] animate-aurora animation-delay-2000 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[80vw] h-[80vw] bg-indigo-200/30 rounded-full blur-[140px] animate-aurora animation-delay-4000 mix-blend-multiply"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
    </div>
);

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`flex items-center justify-between rounded-full px-8 py-4 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl border border-white/50 shadow-lg shadow-indigo-500/5' : 'bg-transparent border-transparent'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl rotate-3"><Sparkles size={20} fill="white" /></div>
                        <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">AI VIRTUAL DETECTOR <span className="text-indigo-600">PRO</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                        <a href="#workflow" className="hover:text-indigo-600 transition-colors">Cara Kerja</a>
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Fitur</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Harga</a>
                    </div>
                    <a href="#live-app" className="hidden md:flex group px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/30 items-center gap-2">
                        Mulai Sekarang <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                    </a>
                </div>
            </div>
        </nav>
    );
};

const HeroSection = () => (
    <section className="relative z-10 pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 flex items-center min-h-[90vh]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 relative z-10 reveal-on-scroll">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/40 border border-white/60 shadow-sm backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600">AI V2.1 Now Live</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                    AI Virtual <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">Detector.</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
                    Ubah satu foto produk menjadi <strong>Skenario Video Viral</strong> lengkap. Tanpa scriptwriter. Tanpa pusing.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                    <a href={CHECKOUT_LINK} target="_blank" rel="noopener noreferrer" className="group px-8 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <ShoppingCart size={20} /> BELI AKSES SEKARANG
                    </a>
                    <a href="#workflow" className="px-8 py-5 bg-white/50 border border-white/60 text-slate-600 rounded-2xl font-bold hover:bg-white transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                        <Play size={20} className="fill-current" /> Lihat Cara Kerja
                    </a>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <div className="flex -space-x-2">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" alt="User 1" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces" alt="User 2" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces" alt="User 3" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">+99</div>
                    </div>
                    <p>Digunakan oleh Ratusan Kreator</p>
                </div>
            </div>
            <div className="relative h-[600px] w-full perspective-1000 hidden lg:block reveal-on-scroll delay-200">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-white/10 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-all duration-700 z-20 flex flex-col overflow-hidden group animate-float">
                    <div className="h-16 border-b border-white/20 flex items-center justify-between px-6">
                        <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div></div>
                        <div className="text-[10px] font-bold text-white/50">AI PROCESSING</div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col gap-4 relative">
                        <div className="w-full h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/20 flex items-center justify-center relative overflow-hidden">
                            <Smartphone size={48} className="text-white/50 animate-pulse"/>
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-scan"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                            <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                            <div className="h-2 w-full bg-white/5 rounded-full"></div>
                        </div>
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold py-2 px-4 rounded-xl shadow-lg animate-bounce">Generating Scene 3...</div>
                    </div>
                </div>
                
                <div className="absolute top-[15%] right-[5%] w-48 h-16 bg-white/60 backdrop-blur-xl border border-white rounded-xl shadow-xl flex items-center gap-3 px-4 animate-float-slow z-30">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><CheckCircle2 size={16}/></div>
                    <div><div className="text-[10px] text-slate-400 font-bold uppercase">Status</div><div className="text-xs font-bold text-slate-900">Script Completed</div></div>
                </div>
                <div className="absolute bottom-[25%] left-[5%] w-48 h-16 bg-white/60 backdrop-blur-xl border border-white rounded-xl shadow-xl flex items-center gap-3 px-4 animate-float-fast z-30">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><Wand2 size={16}/></div>
                    <div><div className="text-[10px] text-slate-400 font-bold uppercase">Effect</div><div className="text-xs font-bold text-slate-900">Magic Enhanced</div></div>
                </div>
            </div>
        </div>
    </section>
);

const VideoCard = ({ videoId, isCenter, isMuted }: any) => {
    return (
        <div 
            className={`relative w-full aspect-[9/16] bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden transform transition-all duration-700 group border-4 ${isCenter ? 'scale-105 z-20 border-slate-900 ring-4 ring-indigo-500/20' : 'scale-90 opacity-90 hover:opacity-100 hover:scale-100 hover:z-10 border-slate-800'}`}
            style={{ transform: !isCenter ? (videoId === DEMO_VIDEOS[0] ? 'rotate(-6deg) translateY(20px)' : 'rotate(6deg) translateY(20px)') : '' }}
        >
            <a 
                href={`https://www.youtube.com/shorts/${videoId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full relative cursor-pointer"
            >
                <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={32} className="fill-white text-white ml-1" />
                    </div>
                </div>
                {isCenter && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg text-slate-900 flex items-center gap-1 whitespace-nowrap">
                        <Sparkles size={10} className="text-yellow-500 fill-yellow-500"/> MOST POPULAR
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm p-1.5 rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ExternalLink size={14} />
                </div>
            </a>
        </div>
    );
};

const VideoShowcase = () => (
<section className="py-24 px-6 relative z-10 overflow-hidden bg-slate-50/50">
    <div className="max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="mb-24 reveal-on-scroll">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold tracking-widest uppercase mb-4 border border-indigo-200">
                PROTOTYPE / PREVIEW TOOL
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Hasil Video <span className="text-indigo-600">Tanpa Edit Manual.</span></h2>
            <p className="text-slate-500 max-w-lg mx-auto text-lg">Lihat bagaimana AI mengubah foto produk statis menjadi video dynamic yang siap viral.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4 perspective-1000 min-h-[500px] reveal-on-scroll delay-200">
            <div className="w-full max-w-[280px]">
                <VideoCard videoId={DEMO_VIDEOS[0]} isCenter={false} isMuted={true} />
            </div>
            <div className="w-full max-w-[320px] -mt-8 z-20">
                <VideoCard videoId={DEMO_VIDEOS[1]} isCenter={true} isMuted={false} />
            </div>
            <div className="w-full max-w-[280px]">
                <VideoCard videoId={DEMO_VIDEOS[2]} isCenter={false} isMuted={true} />
            </div>
        </div>
        
        <div className="flex justify-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 animate-bounce">
                <Zap size={16} className="text-yellow-500 fill-yellow-500"/>
                <span className="text-sm font-bold text-slate-800">Generate Hasil Sebagus Ini dalam 10 Detik</span>
            </div>
        </div>
    </div>
</section>
);

const BentoItem = ({ icon, title, desc, className, delay }: any) => (
    <div className={`group relative bg-white/40 backdrop-blur-md border border-white/60 p-8 rounded-[2rem] hover:bg-white/60 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden ${className} reveal-on-scroll delay-${delay || '100'}`}>
        <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-500 text-slate-900">{icon}</div>
            <div><h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3><p className="text-sm text-slate-500 leading-relaxed">{desc}</p></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
);

const FeaturesSection = () => (
    <section id="workflow" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Workflow Masa Depan.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Lupakan cara lama yang ribet. Ini adalah shortcut untuk konten kreator cerdas.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[300px]">
            <BentoItem className="md:row-span-2 bg-gradient-to-b from-white/60 to-indigo-50/40" icon={<Upload size={32}/>} title="1. Upload Produk" desc="Cukup satu foto produk yang jelas. AI kami akan memindai fitur, warna, dan konteks visual secara instan." />
            <BentoItem className="" icon={<MousePointer2 size={32} className="text-indigo-600"/>} title="2. Pilih Vibe" desc="Tentukan arah konten: Hard selling, Soft storytelling, atau Aesthetic cinematic." />
            <BentoItem className="" icon={<Wand2 size={32} className="text-purple-600"/>} title="3. Generate Magic" desc="Dalam 10 detik, terima 5 scene lengkap dengan visual prompt dan naskah." />
            
            <div className="md:col-span-2 group relative bg-slate-900 text-white h-auto md:h-full p-6 md:p-10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl reveal-on-scroll delay-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
                <div className="flex-1 relative z-10 w-full">
                    <div className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-indigo-500/30">HASIL AKHIR</div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Siap Posting.</h3>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">Output bukan cuma teks, tapi blueprint visual shot-by-shot yang tinggal Anda eksekusi. Minim editing, maksimal impact.</p>
                </div>
                <div className="flex-1 relative z-10 flex gap-4 w-full justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1 transform translate-y-4 md:translate-y-8 animate-float">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mb-3"><Video size={16}/></div>
                        <div className="h-2 w-12 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-2 w-full bg-white/10 rounded-full"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1 transform md:-translate-y-4 animate-float-slow">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-3"><FileText size={16}/></div>
                        <div className="h-2 w-12 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-2 w-full bg-white/10 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </section>
);

const ComparisonSection = () => (
    <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Stop Buang Waktu & Uang.</h2>
                <p className="text-slate-500 max-w-xl mx-auto text-lg">Kenapa kreator cerdas beralih ke AI Virtual Detector.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-slate-100/50 border border-slate-200 backdrop-blur-sm grayscale-[0.5] hover:grayscale-0 transition-all duration-500 reveal-on-scroll">
                    <h3 className="text-2xl font-bold text-slate-600 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500"><X size={16}/></span>
                        Cara Manual (Lama)
                    </h3>
                    <ul className="space-y-6 relative z-10">
                        <li className="flex items-start gap-4 text-slate-500">
                            <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5"/>
                            <span><strong>Sewa Model & Studio Mahal.</strong> Biaya produksi jutaan, jadwal susah cocok, ribet briefing.</span>
                        </li>
                        <li className="flex items-start gap-4 text-slate-500">
                            <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5"/>
                            <span><strong>Wajib Punya Kamera & Lighting.</strong> Investasi alat mahal, kalau pakai HP hasil sering gelap/burik.</span>
                        </li>
                        <li className="flex items-start gap-4 text-slate-500">
                            <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5"/>
                            <span><strong>Editing Berjam-jam.</strong> Laptop panas, mata lelah, mikir transisi & lagu, eh views-nya dikit.</span>
                        </li>
                    </ul>
                </div>
                <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-white/80 border border-white shadow-[0_20px_50px_rgba(79,70,229,0.15)] ring-1 ring-indigo-50 backdrop-blur-xl transform md:scale-105 z-10 reveal-on-scroll delay-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><CheckCircle2 size={16}/></span>
                        AI Virtual Detector
                    </h3>
                    <ul className="space-y-6 relative z-10">
                        <li className="flex items-start gap-4 text-slate-700 font-medium">
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5"/>
                            <span><strong>Tanpa Model, Tanpa Studio.</strong> AI menciptakan visual profesional seolah-olah Anda shooting di studio mewah.</span>
                        </li>
                        <li className="flex items-start gap-4 text-slate-700 font-medium">
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5"/>
                            <span><strong>Cukup Modal Foto Produk.</strong> Upload 1 foto, AI ubah jadi video iklan sinematik. Hemat budget puluhan juta.</span>
                        </li>
                        <li className="flex items-start gap-4 text-slate-700 font-medium">
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5"/>
                            <span><strong>Ide & Script Viral Instan.</strong> Gak perlu pusing mikir konsep. Klik generate, konten siap posting dalam detik.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

// --- INTERACTIVE PROTOTYPE SECTION (LIVE APP) ---
const LiveAppSection = () => {
  const [selectedStyle, setSelectedStyle] = useState('ugc'); 
  const [inputs, setInputs] = useState<any>({
    productImage: null, modelImage: null, backgroundImage: null,
    outfitImages: [null, null, null, null, null, null],
    locationImages: [null, null, null, null, null, null],
    topic: '', mood: 'Soft', language: 'Indonesian', scriptStyle: 'Direct & Clear'
  });
  
  const [storyboard, setStoryboard] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);
  const [editableScript, setEditableScript] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);

  const handleFileUpload = (e: any, type: string, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = typeof reader.result === 'string' ? reader.result.split(',')[1] : '';
        const fileData = { data: base64, mimeType: file.type };
        if (type === 'general') setInputs((prev: any) => ({ ...prev, productImage: fileData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = (type: string, index = null) => {
      if (type === 'general') setInputs((prev: any) => ({ ...prev, productImage: null }));
  };

  const handleGenerateSimulation = async () => {
    setIsAnalyzing(true);
    setError(null); 
    setShowResult(false);
    setProgress('Menganalisis Visual Produk...');
    setMetadata(null);
    setStoryboard([]);
    
    // --- SIMULASI PROSES AI ---
    setTimeout(() => setProgress('Mendeteksi Fitur Unggulan...'), 1500);
    setTimeout(() => setProgress('Merancang Hook Viral...'), 3000);
    setTimeout(() => setProgress(`Menyusun Storyboard: ${CONTENT_STYLES[selectedStyle]?.name || 'Standard'} Mode...`), 4500);
    
    setTimeout(() => {
        if (selectedStyle === 'ads') {
            setStoryboard(AD_CAMPAIGN_DATA.storyboard);
            setEditableScript(AD_CAMPAIGN_DATA.script);
            setMetadata({
                title: AD_CAMPAIGN_DATA.title,
                hashtags: AD_CAMPAIGN_DATA.hashtags
            });
            if(!inputs.topic) setInputs((prev: any) => ({...prev, topic: AD_CAMPAIGN_DATA.productDescription}));
            // Mock image input for prototype
            if(!inputs.productImage) {
                setInputs((prev: any) => ({...prev, productImage: { data: "", mimeType: "image/jpeg" }}));
            }
        } else if (selectedStyle === 'ugc') {
            setStoryboard(UGC_CAMPAIGN_DATA.storyboard);
            setEditableScript(UGC_CAMPAIGN_DATA.script);
            setMetadata({
                title: UGC_CAMPAIGN_DATA.title,
                hashtags: UGC_CAMPAIGN_DATA.hashtags
            });
            if(!inputs.topic) setInputs((prev: any) => ({...prev, topic: UGC_CAMPAIGN_DATA.productDescription}));
             if(!inputs.productImage) {
                setInputs((prev: any) => ({...prev, productImage: { data: "", mimeType: "image/jpeg" }}));
            }
        } else if (selectedStyle === 'aesthetic') {
            setStoryboard(AESTHETIC_CAMPAIGN_DATA.storyboard);
            setEditableScript(AESTHETIC_CAMPAIGN_DATA.script);
            setMetadata({
                title: AESTHETIC_CAMPAIGN_DATA.title,
                hashtags: AESTHETIC_CAMPAIGN_DATA.hashtags
            });
            if(!inputs.topic) setInputs((prev: any) => ({...prev, topic: AESTHETIC_CAMPAIGN_DATA.productDescription}));
             if(!inputs.productImage) {
                setInputs((prev: any) => ({...prev, productImage: { data: "", mimeType: "image/jpeg" }}));
            }
        } else if (selectedStyle === 'cinematic') {
            setStoryboard(CINEMATIC_CAMPAIGN_DATA.storyboard);
            setEditableScript(CINEMATIC_CAMPAIGN_DATA.script);
            setMetadata({
                title: CINEMATIC_CAMPAIGN_DATA.title,
                hashtags: CINEMATIC_CAMPAIGN_DATA.hashtags
            });
            if(!inputs.topic) setInputs((prev: any) => ({...prev, topic: CINEMATIC_CAMPAIGN_DATA.productDescription}));
             if(!inputs.productImage) {
                setInputs((prev: any) => ({...prev, productImage: { data: "", mimeType: "image/jpeg" }}));
            }
        } else {
            // Default Fallback
            const flow = STORY_FLOWS[selectedStyle] || STORY_FLOWS.ugc;
            const mockResults = flow.map((step: any, idx: number) => ({
                shot_number: idx + 1,
                visual_prompt: `[DEMO ${CONTENT_STYLES[selectedStyle]?.name || 'Mode'}] Visualisasi ${step}...`,
                imageUrl: DEFAULT_PRODUCT_IMAGE,
                voiceover_script: `Ini adalah naskah dummy untuk ${step}.`,
                isLoading: false
            }));
            setStoryboard(mockResults);
            setEditableScript("Scene 1: [Hook] Masalah umum...\nScene 2: [Solusi] Produk ini...");
            setMetadata({ title: "Demo Campaign Result", hashtags: "#Viral #Trending #FYP" });
        }

        setIsAnalyzing(false);
        setShowResult(true);
    }, 6000);
  };

  const handleRegenerateShot = (index: number) => {
    const updated = [...storyboard];
    updated[index].isLoading = true;
    setStoryboard(updated);
    setTimeout(() => {
        const finished = [...storyboard];
        finished[index].isLoading = false;
        finished[index].imageUrl = `https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400&h=700&fit=crop`;
        setStoryboard(finished);
    }, 2000);
  };

  return (
    <section id="live-app" className="py-24 px-4 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
            
            {/* WINDOW MOCKUP CONTAINER */}
            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-20">
                {/* Window Header */}
                <div className="bg-slate-900 rounded-t-3xl p-4 flex items-center justify-between border-b border-white/10 shadow-2xl">
                    <div className="flex items-center gap-2 ml-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase">
                        <Sparkles size={12} className="text-indigo-400"/> Virtual Director v2.0 (Preview)
                    </div>
                    <div className="flex gap-4 mr-4 text-white/30">
                        <div className="w-3 h-3 border border-white/30 rounded-sm"></div>
                        <div className="w-3 h-3 border border-white/30 rounded-sm"></div>
                    </div>
                </div>

                {/* Main App Content Area */}
                <div className="bg-white/80 backdrop-blur-2xl border-x border-b border-white/60 rounded-b-3xl p-6 md:p-10 shadow-[0_50px_100px_rgb(0,0,0,0.1)] relative overflow-hidden">
                    
                    {/* "Prototype Tool" Badge inside the app */}
                    <div className="absolute top-6 right-6 z-20 pointer-events-none">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 border border-indigo-200 text-[10px] font-bold text-indigo-700 uppercase tracking-wide backdrop-blur-sm shadow-sm">
                            <Zap size={12} className="fill-indigo-700"/> Interactive Prototype
                        </span>
                    </div>

                    {!showResult && !isAnalyzing ? (
                        <div className="max-w-2xl mx-auto space-y-8">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Create New Campaign.</h3>
                                <p className="text-sm text-slate-500 font-medium">Isi form singkat di bawah ini, biarkan AI yang bekerja.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block text-center mb-4">1. Pilih Video Style</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {Object.values(CONTENT_STYLES).map((style: any) => {
                                        const isLocked = style.locked;
                                        return (
                                            <button 
                                                key={style.id} 
                                                onClick={() => {
                                                    if (isLocked) {
                                                        window.open(CHECKOUT_LINK, '_blank');
                                                    } else {
                                                        setSelectedStyle(style.id);
                                                    }
                                                }} 
                                                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 border text-center group h-28 ${selectedStyle === style.id ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-200 ring-2 ring-indigo-200 scale-105' : (isLocked ? 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100' : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300')}`}
                                            >
                                                <div className={`p-2 rounded-full transition-colors ${selectedStyle === style.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                                                    {getIcon(style.icon)}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className={`text-[10px] font-bold leading-tight ${selectedStyle === style.id ? 'text-white' : 'text-slate-600'}`}>{style.name}</div>
                                                </div>
                                                {isLocked && <Lock size={12} className="absolute top-2 right-2 text-slate-400"/>}
                                                {selectedStyle === style.id && <div className="absolute -bottom-2 bg-indigo-700 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">SELECTED</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 mt-8">
                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block text-center mb-2">2. Upload Produk & Konteks</label>
                                
                                {/* CENTERED UPLOAD SECTION */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <UploadCard 
                                            label="Foto Produk Utama" 
                                            hasFile={!!inputs.productImage || (selectedStyle === 'ads') || (selectedStyle === 'ugc') || (selectedStyle === 'aesthetic') || (selectedStyle === 'cinematic')} 
                                            fileData={inputs.productImage}
                                            // PREVIEW URL DIPERBAIKI MENGGUNAKAN GAMBAR SCENE 3 ADS
                                            previewUrl={!inputs.productImage ? DEFAULT_PRODUCT_IMAGE : null}
                                            onChange={(e: any) => handleFileUpload(e, 'general')} 
                                            onClear={() => handleClearFile('general')}
                                            className="h-full min-h-[120px]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <textarea 
                                            value={(!inputs.topic && (selectedStyle === 'ads' || selectedStyle === 'ugc' || selectedStyle === 'aesthetic' || selectedStyle === 'cinematic')) ? GLOBAL_PRODUCT_DESCRIPTION : inputs.topic}
                                            onChange={(e) => setInputs({...inputs, topic: e.target.value})} 
                                            placeholder="Deskripsikan produk Anda secara singkat (Manfaat, Kandungan, dll)..." 
                                            className="w-full h-full min-h-[120px] bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none resize-none transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button onClick={handleGenerateSimulation} className="w-full py-5 rounded-2xl font-bold text-base text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 bg-slate-900 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative z-10 flex items-center gap-2"><Sparkles size={18} className="text-yellow-400 group-hover:animate-spin" /> GENERATE CAMPAIGN</span>
                            </button>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center min-h-[500px]">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse rounded-full"></div>
                                <div className="bg-white p-8 rounded-[2rem] shadow-2xl relative z-10"><Loader2 size={64} className="text-indigo-600 animate-spin" /></div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">{progress}</h3>
                            <p className="text-slate-400 text-sm font-medium">AI sedang bekerja meracik visual & naskah...</p>
                        </div>
                    ) : (
                        // Result View
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{ensureString(metadata?.title) || "Campaign Result"}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed</span>
                                        <span className="text-[10px] text-slate-400">{ensureString(metadata?.hashtags)}</span>
                                    </div>
                                </div>
                                <button onClick={() => { setShowResult(false); setMetadata(null); }} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors">
                                    <Repeat size={14}/> Reset
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Script Panel */}
                                <div className="lg:col-span-1 bg-slate-50 rounded-2xl p-4 border border-slate-200 h-fit">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase">Generated Script</h3>
                                        <Copy size={12} className="text-slate-400 cursor-pointer hover:text-indigo-500" onClick={() => copyTextToClipboard(editableScript)}/>
                                    </div>
                                    <textarea 
                                        value={editableScript}
                                        onChange={(e) => setEditableScript(e.target.value)}
                                        className="w-full h-64 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono leading-relaxed resize-none focus:outline-none focus:border-indigo-300"
                                    />
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <label className="text-[10px] font-bold text-slate-400 block mb-2">AI Voiceover</label>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-300 flex items-center justify-center gap-2"><Play size={10}/> Preview</button>
                                            <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"><FileDown size={10}/> MP3</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Storyboard Grid */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
                                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">AI PLAN</span>
                                        Visual Storyboard (5 Scenes)
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                                        {storyboard.map((shot, idx) => (
                                            <GlassShotCard key={idx} shot={shot} index={idx} onRegenerate={handleRegenerateShot} flowLabel={STORY_FLOWS[selectedStyle]?.[idx]?.split(":")[0] || `Shot ${idx+1}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>
  );
};

const PricingSection = () => (
    <section id="pricing" className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
                <h2 className="text-4xl font-black text-slate-900 mb-4">Investasi Sekali, Cuan Berkali-kali.</h2>
                <p className="text-slate-500">Tidak ada biaya bulanan. Ambil akses lifetime sekarang.</p>
            </div>
            
            <div className="max-w-md mx-auto">
                <div className="relative p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl overflow-hidden group transform hover:scale-[1.02] transition-transform duration-500 ring-1 ring-white/10 reveal-on-scroll delay-200">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-indigo-300">Pro Creator</h3>
                                <div className="text-sm text-slate-400">All-in-One AI Suite</div>
                            </div>
                            <div className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">LIMITED</div>
                        </div>
                        
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-5xl font-black">Rp 99rb</div>
                            <span className="text-sm font-medium text-slate-400 decoration-slate-600 line-through">Rp 999rb</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-8 font-medium">Pembayaran satu kali untuk selamanya.</p>
                        
                        <div className="h-px w-full bg-slate-800 mb-8"></div>

                        <ul className="space-y-5 mb-10">
                            <li className="flex items-center gap-3 text-sm font-medium"><Zap size={18} className="text-yellow-400 flex-shrink-0"/> <span>Akses Lifetime <span className="text-slate-500">(Tanpa Langganan)</span></span></li>
                            <li className="flex items-center gap-3 text-sm font-medium"><RefreshCw size={18} className="text-green-400 flex-shrink-0"/> <span>Update Fitur Gratis Tiap Bulan</span></li>
                            <li className="flex items-center gap-3 text-sm font-medium"><Users size={18} className="text-blue-400 flex-shrink-0"/> <span>Akses Grup Sharing Creator</span></li>
                            <li className="flex items-center gap-3 text-sm font-medium"><Play size={18} className="text-red-400 flex-shrink-0"/> <span>Video Tutorial Lengkap</span></li>
                            <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 size={18} className="text-indigo-400 flex-shrink-0"/> <span>1 Konten Ready &lt; 10 Menit</span></li>
                        </ul>
                        
                        <a href={CHECKOUT_LINK} target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all relative overflow-hidden group">
                            <span className="relative z-10 flex items-center justify-center gap-2">AMBIL AKSES SEKARANG <ArrowRight size={18}/></span>
                        </a>
                        <div className="text-center mt-4">
                            <p className="text-[10px] text-slate-500">Garansi uang kembali 7 hari.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="py-12 px-6 bg-slate-900 text-slate-400 text-sm border-t border-slate-800 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4 text-white">
                    <Sparkles size={16} />
                    <span className="font-bold tracking-tight">VIRTUAL DETECTOR PRO</span>
                </div>
                <p className="max-w-xs text-slate-500 mb-4">
                    Platform AI no.1 untuk kreator konten di Indonesia. Bikin video viral tanpa pusing, tanpa ribet.
                </p>
                <div className="flex gap-4">
                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><Globe size={14}/></div>
                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><MessageCircle size={14}/></div>
                </div>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4">Produk</h4>
                <ul className="space-y-2">
                    <li><a href="#features" className="hover:text-white transition-colors">Fitur AI</a></li>
                    <li><a href="#pricing" className="hover:text-white transition-colors">Harga</a></li>
                    <li><a href="#demo" className="hover:text-white transition-colors">Showcase</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4">Bantuan</h4>
                <ul className="space-y-2">
                    <li>
                        <a 
                            href="https://wa.me/6288985584050?text=Halo%20Admin,%20saya%20butuh%20bantuan%20tentang%20AI%20Virtual%20Detector" 
                            target="_blank" 
                            rel="noreferrer"
                            className="hover:text-white transition-colors flex items-center gap-2"
                        >
                            <MessageCircle size={16} /> Chat WhatsApp
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="text-center pt-8 border-t border-slate-800 text-xs font-medium">
            <p>&copy; 2024 VidCraft Digital. All rights reserved.</p>
        </div>
    </footer>
);

const FloatingWhatsApp = () => (
    <a 
        href="https://wa.me/6288985584050?text=Halo%20Admin,%20saya%20tertarik%20dengan%20AI%20Virtual%20Detector" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 font-bold animate-in slide-in-from-bottom-4 duration-700 scale-90 md:scale-100 origin-bottom-left"
    >
        <MessageCircle size={24} /> 
        <span className="hidden md:inline">Butuh Bantuan?</span>
    </a>
);

export default function App() {
    const [showWelcome, setShowWelcome] = useState(true);

    // --- CUSTOM HOOK FOR SCROLL ANIMATION ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <div className="min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden bg-slate-50">
            <style>{globalStyles}</style>
            <AuroraBackground />
            <SocialProofPopup />
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
            <FloatingWhatsApp />
            
            <Navbar />
            <HeroSection />
            <VideoShowcase />
            <FeaturesSection />
            <ComparisonSection />
            <LiveAppSection />
            <PricingSection />
            <Footer />
        </div>
    );
}