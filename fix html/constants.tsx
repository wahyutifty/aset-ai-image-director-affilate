import React from 'react';
import { 
  User, Monitor, Camera, RefreshCw, Footprints, 
  Building, Wand2, Coffee, Video, Plane 
} from 'lucide-react';
import { ContentStyle } from './types';

export const CHECKOUT_LINK = "https://lynk.id/vidcraftdigital/y81kdqqxjr5w";
export const DEFAULT_PRODUCT_IMAGE = "https://raw.githubusercontent.com/wahyutifty/aset-ai-image-director-affilate/main/ai%20ads/scene_3.png";

export const DEMO_VIDEOS = [
    "b9DjBn5z2-M", 
    "DGK3OR2IbwE", 
    "8DzhoqDJMZM"  
];

export const CONTENT_STYLES: Record<string, ContentStyle> = {
  ugc: { id: 'ugc', name: 'UGC Review', description: 'Review Jujur & Testimoni.', icon: 'User', locked: false },
  ads: { id: 'ads', name: 'Professional Ads', description: 'Iklan TV Komersial High-End.', icon: 'Monitor', locked: false },
  presentation: { id: 'presentation', name: 'Fashion B-Roll', description: 'Video Fashion Profesional.', icon: 'Camera', locked: true },
  mannequin: { id: 'mannequin', name: 'Mannequin 2 Shot', description: 'Display Fashion Simpel.', icon: 'RefreshCw', locked: true },
  treadmill: { id: 'treadmill', name: 'Runway Loop', description: 'Video Looping Cepat.', icon: 'Footprints', locked: true },
  realestate: { id: 'realestate', name: 'Real Estate Tour', description: 'Tur Properti Realistis.', icon: 'Building', locked: true },
  aesthetic: { id: 'aesthetic', name: 'Aesthetic POV', description: 'POV Tangan Estetik.', icon: 'Wand2', locked: false },
  foodie: { id: 'foodie', name: 'Foodie Ad', description: 'Sinematik Kuliner.', icon: 'Coffee', locked: true },
  cinematic: { id: 'cinematic', name: 'Cinematic', description: 'Gaya Film Layar Lebar.', icon: 'Video', locked: false },
  travel: { id: 'travel', name: 'Travel Vlog', description: 'Vlog Liburan & Wisata.', icon: 'Plane', locked: true }
};

export const RECENT_ACTIVITIES = [
    { name: "Bima Arya", location: "Jakarta", action: "membeli Paket Pro", time: "baru saja" },
    { name: "Siti Aminah", location: "Bandung", action: "upgrade ke Creator", time: "2 menit lalu" },
    { name: "Rudi Hartono", location: "Surabaya", action: "membeli Akses Lifetime", time: "5 menit lalu" },
    { name: "Dewi Persik", location: "Jember", action: "join Group Sharing", time: "12 menit lalu" },
    { name: "Andi Saputra", location: "Medan", action: "bergabung dengan Pro", time: "15 menit lalu" },
];

export const STORY_FLOWS: Record<string, string[]> = {
  ugc: ["Hook (Selfie/POV): Masalah Relate", "Product Intro: Solusi", "Texture: Bukti Fisik", "Result: Hasil Pemakaian", "CTA: Ajakan Beli"],
  ads: ["Problem: Masalah Dramatis", "Reveal: Produk Muncul", "Feature: Keunggulan Utama", "Benefit: Hasil Nyata", "Offer: Promo Terbatas"],
  aesthetic: ["Vibe: Suasana Pagi", "Detail: Tekstur Produk", "Action: Pemakaian Lembut", "Result: Kulit Glowing", "End: Mood Shot"],
  cinematic: ["Intro: Wide Shot Dramatis", "Product: Close Up 3D", "Ingredient: Visual Bahan", "Model: Interaksi Elegan", "Outro: Logo & Tagline"],
  presentation: ["Outfit Reveal", "Fabric Detail", "Styling Options", "Movement Check", "Final Look"],
  mannequin: ["Full Body Front", "Detail Top", "Detail Bottom", "Accessory Focus", "Side/Back View"],
  treadmill: ["Walk In", "Full Turn", "Fabric Flow", "Walk Away", "Pause/Pose"],
  realestate: ["Exterior/Facade", "Living Room/Wide", "Kitchen/Detail", "Bedroom/Comfort", "Backyard/View"],
  foodie: ["Ingredients Prep", "Cooking Process", "Plating", "Taste Test", "Table Spread"],
  travel: ["Destination Establishing", "Journey/Transit", "Activity/Highlight", "Relaxation/Vibe", "Memorable Moment"]
};

export const getIcon = (iconName: string, size = 18) => {
  switch (iconName) {
    case 'User': return <User size={size} />;
    case 'Monitor': return <Monitor size={size} />;
    case 'Camera': return <Camera size={size} />;
    case 'RefreshCw': return <RefreshCw size={size} />;
    case 'Footprints': return <Footprints size={size} />;
    case 'Building': return <Building size={size} />;
    case 'Wand2': return <Wand2 size={size} />;
    case 'Coffee': return <Coffee size={size} />;
    case 'Video': return <Video size={size} />;
    case 'Plane': return <Plane size={size} />;
    default: return <Video size={size} />;
  }
};