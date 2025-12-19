import { User, ApiConfig, Campaign, Mannequin } from "../types";
import { supabase } from "./supabaseClient";

/**
 * --- SCHÉMA SQL SUPABASE (MASTER SCRIPT) ---
 * 
 * Si vous avez des erreurs "relation already exists", copiez tout ce bloc dans l'éditeur SQL de Supabase
 * pour réinitialiser proprement la base de données :
 * 
 * -- 1. NETTOYAGE (Supprime l'existant)
 * DROP TABLE IF EXISTS public.mannequins;
 * DROP TABLE IF EXISTS public.campaigns;
 * DROP TABLE IF EXISTS public.users;
 * DROP TABLE IF EXISTS public.api_configs;
 * 
 * -- 2. CRÉATION
 * CREATE TABLE public.api_configs ( provider text PRIMARY KEY, key_value text );
 * 
 * CREATE TABLE public.users ( 
 *   id text PRIMARY KEY, name text, email text, 
 *   role text DEFAULT 'user', plan text, credits int, 
 *   status text, last_login text, created_at timestamptz DEFAULT now() 
 * );
 * 
 * CREATE TABLE public.mannequins ( 
 *   id text PRIMARY KEY, name text, ethnicity text, 
 *   style text, details text, image text, created_at timestamptz DEFAULT now() 
 * );
 * 
 * CREATE TABLE public.campaigns ( 
 *   id text PRIMARY KEY, status text, mannequin_id text, 
 *   product_data jsonb, scenes_data jsonb, generated_images text[], 
 *   created_at timestamptz DEFAULT now() 
 * );
 * 
 * -- 3. SÉCURITÉ
 * ALTER TABLE public.api_configs ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.mannequins ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Public Access API" ON public.api_configs FOR ALL USING (true);
 * CREATE POLICY "Public Access Users" ON public.users FOR ALL USING (true);
 * CREATE POLICY "Public Access Mannequins" ON public.mannequins FOR ALL USING (true);
 * CREATE POLICY "Public Access Campaigns" ON public.campaigns FOR ALL USING (true);
 */

// --- DONNÉES DE SECOURS (MOCK) ---
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Marie Dupont (Demo)', email: 'marie@luxe.com', role: 'user', plan: 'pro', credits: 450, status: 'active', lastLogin: '2023-10-24 14:30' },
  { id: 'u2', name: 'Thomas Laurent (Admin)', email: 'admin@luxe.com', role: 'admin', plan: 'enterprise', credits: 9999, status: 'active', lastLogin: '2023-10-24 09:15' },
  { id: 'admin-luxegen', name: 'Administrateur LuxeGen', email: 'admin@luxegen.ai', role: 'admin', plan: 'enterprise', credits: 9999, status: 'active', lastLogin: '2025-12-18' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'demo-1',
    status: 'completed',
    mannequinId: 'm1',
    product: { id: 'p1', image: '', type: 'shoe' },
    scenes: [],
    generatedImages: ['https://picsum.photos/seed/shoes1/400/600', 'https://picsum.photos/seed/shoes1b/400/600'],
    createdAt: Date.now() - 86400000
  },
  {
    id: 'demo-2',
    status: 'completed',
    mannequinId: 'm2',
    product: { id: 'p2', image: '', type: 'bag' },
    scenes: [],
    generatedImages: ['https://picsum.photos/seed/bag1/400/600'],
    createdAt: Date.now() - 172800000
  }
];

const MOCK_MANNEQUINS: Mannequin[] = [
  {
    id: 'm1',
    name: 'Sophia',
    ethnicity: 'Caucasienne',
    style: 'Élégance Classique',
    details: 'Visage symétrique, cheveux châtains ondulés, regard confiant',
    image: 'https://picsum.photos/seed/sophia/200/300'
  },
  {
    id: 'm2',
    name: 'Mei',
    ethnicity: 'Asiatique',
    style: 'Minimalisme Urbain',
    details: 'Cheveux noirs carré court, maquillage naturel, attitude business',
    image: 'https://picsum.photos/seed/mei/200/300'
  }
];

// --- Service DB Connecté à Supabase ---

export const db = {
  // --- AUTHENTIFICATION ---
  auth: {
    signIn: async (email: string, password: string): Promise<{ user: User | null, error: string | null }> => {
      // 1. PRIORITÉ : Vérifier si c'est un compte de démo local
      const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (mockUser && password === 'password') {
        console.log("Connecté via Mode Démo (Local)");
        return { user: mockUser, error: null };
      }

      try {
        // 2. Tenter Auth Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          // Si Supabase dit "Invalid credentials", on ne s'arrête pas si on veut forcer le mock
          // Mais ici le mock a déjà été vérifié au dessus. Donc c'est une vraie erreur.
          return { user: null, error: authError.message };
        }
        
        if (!authData.user) return { user: null, error: "Utilisateur introuvable" };

        // 3. Récupérer le profil public
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profileData) {
            return { user: null, error: "Profil utilisateur non initialisé dans la base." };
        }

        const user: User = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role || 'user',
          plan: profileData.plan,
          credits: profileData.credits,
          status: profileData.status,
          lastLogin: new Date().toISOString()
        };

        await db.users.update(user);
        return { user, error: null };

      } catch (e) {
        return { user: null, error: "Problème de connexion au serveur d'authentification." };
      }
    },

    signUp: async (email: string, password: string, name: string): Promise<{ user: User | null, error: string | null }> => {
      // Simple regex check before sending to Supabase
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { user: null, error: "Format d'email invalide (ex: nom@domaine.com)" };
      }

      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) return { user: null, error: authError.message };
        if (!authData.user) return { user: null, error: "Erreur lors de la création du compte." };

        const newUser: User = {
          id: authData.user.id,
          name: name,
          email: email,
          role: 'user',
          plan: 'free',
          credits: 50,
          status: 'active',
          lastLogin: new Date().toISOString()
        };

        await db.users.add(newUser);
        return { user: newUser, error: null };
      } catch (e) {
        return { user: null, error: "Erreur inattendue lors de l'inscription." };
      }
    },

    signOut: async () => {
      await supabase.auth.signOut();
    }
  },

  // --- GESTION UTILISATEURS ---
  users: {
    getAll: async (): Promise<User[]> => {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        return data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'user',
          plan: u.plan,
          credits: u.credits,
          status: u.status,
          lastLogin: u.last_login 
        })) as User[];
      } catch (e) {
        return MOCK_USERS;
      }
    },
    update: async (updatedUser: User) => {
      try {
        await supabase
          .from('users')
          .update({ 
            status: updatedUser.status, 
            plan: updatedUser.plan, 
            credits: updatedUser.credits,
            last_login: updatedUser.lastLogin,
            role: updatedUser.role
          })
          .eq('id', updatedUser.id);
      } catch (e) {
        console.error("Erreur update user:", e);
      }
    },
    add: async (user: User) => {
      try {
        await supabase.from('users').insert([{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          credits: user.credits,
          status: user.status,
          last_login: user.lastLogin
        }]);
      } catch (e) {
        console.error("Erreur add user:", e);
      }
    }
  },

  // --- GESTION API KEYS (ADMIN) ---
  apiConfig: {
    getAll: async () => {
      try {
        const { data, error } = await supabase.from('api_configs').select('*');
        if (error || !data) throw error;
        const configObj: any = { gemini: '', seedream: '', kling: '' };
        data.forEach((item: any) => {
          configObj[item.provider] = item.key_value;
        });
        return configObj;
      } catch (e) {
        return { gemini: '', seedream: '', kling: '' };
      }
    },
    save: async (configs: { gemini: string; seedream: string; kling: string }) => {
      try {
        const updates = [
          { provider: 'gemini', key_value: configs.gemini },
          { provider: 'seedream', key_value: configs.seedream },
          { provider: 'kling', key_value: configs.kling },
        ];
        await supabase.from('api_configs').upsert(updates); 
      } catch (e) {
        console.error("Erreur save configs:", e);
      }
    },
    getKey: async (provider: 'gemini' | 'seedream' | 'kling'): Promise<string> => {
      try {
        const { data } = await supabase
          .from('api_configs')
          .select('key_value')
          .eq('provider', provider)
          .single();
        return data?.key_value || '';
      } catch (e) {
        return '';
      }
    }
  },

  campaigns: {
    getAll: async (userId?: string): Promise<Campaign[]> => {
      try {
        let query = supabase.from('campaigns').select('*').order('created_at', { ascending: false });
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query;
        if (error) throw error;
        return data.map((c: any) => ({
          id: c.id, 
          status: c.status,
          mannequinId: c.mannequin_id,
          product: c.product_data,
          scenes: c.scenes_data,
          generatedImages: c.generated_images || [],
          createdAt: new Date(c.created_at).getTime(),
          userId: c.user_id
        }));
      } catch (e) {
        return MOCK_CAMPAIGNS;
      }
    },
    add: async (campaign: Campaign, userId?: string) => {
      try {
        await supabase.from('campaigns').insert([{
          id: campaign.id.toString(), 
          status: campaign.status,
          mannequin_id: campaign.mannequinId,
          product_data: campaign.product,
          scenes_data: campaign.scenes,
          generated_images: campaign.generatedImages,
          created_at: new Date(campaign.createdAt).toISOString(),
          user_id: userId
        }]);
      } catch (e) {
        console.error("Erreur add campaign:", e);
      }
    },
    update: async (campaign: Campaign) => {
      try {
        await supabase.from('campaigns').update({
          status: campaign.status,
          generated_images: campaign.generatedImages,
          scenes_data: campaign.scenes,
        }).eq('id', campaign.id);
      } catch (e) {
        console.error("Erreur update campaign:", e);
      }
    },
    delete: async (id: string) => {
      try {
        await supabase.from('campaigns').delete().eq('id', id);
      } catch (e) {
        console.error("Erreur delete campaign:", e);
      }
    }
  },

  mannequins: {
    getAll: async (userId?: string): Promise<Mannequin[]> => {
      try {
        const { data, error } = await supabase.from('mannequins').select('*');
        if (error) throw error;
        // Filtrer: mannequins système (sans user_id) + mannequins de l'utilisateur
        return (data as any[]).filter((m: any) => !m.user_id || m.user_id === userId).map((m: any) => ({
          ...m,
          userId: m.user_id
        })) as Mannequin[];
      } catch (e) {
        return MOCK_MANNEQUINS;
      }
    },
    add: async (mannequin: Mannequin, userId?: string) => {
      try {
        await supabase.from('mannequins').insert([{ ...mannequin, user_id: userId }]);
      } catch (e) {
        throw e;
      }
    },
    delete: async (id: string) => {
        try {
            await supabase.from('mannequins').delete().eq('id', id);
        } catch (e) {
            console.error("Erreur delete mannequin:", e);
        }
    }
  }
};