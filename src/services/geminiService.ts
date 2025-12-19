import { Scene, ProductType } from "../types";
import { db } from './db';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent';

// Images de démonstration par catégorie (fallback)
const DEMO_IMAGES: Record<ProductType, string[]> = {
  bag: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=720&h=1280&fit=crop"
  ],
  shoe: [
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=720&h=1280&fit=crop"
  ],
  dress: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=720&h=1280&fit=crop"
  ],
  jewelry: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=720&h=1280&fit=crop"
  ],
  watch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=720&h=1280&fit=crop"
  ],
  glasses: [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=720&h=1280&fit=crop"
  ],
  accessory: [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=720&h=1280&fit=crop",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=720&h=1280&fit=crop"
  ]
};

export const analyzeProductAndPlanCampaign = async (
  productBase64: string,
  mannequinImageUrl: string,
  mannequinDescription: string,
  userDescription: string,
  sceneCount: number
): Promise<{ productType: ProductType; scenes: Scene[] }> => {
  
  // Récupérer la clé API Gemini depuis la base de données
  const apiKey = await db.apiConfig.getKey('gemini');
  
  if (!apiKey) {
    console.error('Clé API Gemini non configurée');
    throw new Error('Clé API Gemini non configurée. Veuillez la configurer dans le panneau admin.');
  }

  // Construire le prompt pour Gemini
  const systemPrompt = `Tu es un directeur artistique expert en mode luxe et photographie haut de gamme pour campagnes publicitaires.

ANALYSE LES 2 IMAGES FOURNIES:
- IMAGE 1 (Figure 1): Le produit de luxe à mettre en valeur - MÉMORISE CHAQUE DÉTAIL (couleur exacte, texture, forme, matériaux)
- IMAGE 2 (Figure 2): Le mannequin - MÉMORISE son visage, coiffure, angle de tête, expression

GÉNÈRE ${sceneCount} scènes de campagne publicitaire luxe.

Détails mannequin: ${mannequinDescription}
Direction créative: ${userDescription}

RÈGLES CRITIQUES POUR CHAQUE PROMPT:
1. Le mannequin doit avoir EXACTEMENT le même visage, même angle de tête, même coiffure que sur la photo de référence (Figure 2)
2. Le produit doit rester STRICTEMENT IDENTIQUE à la photo d'origine (Figure 1) - même couleur, même texture, même forme, AUCUNE modification
3. Format: Portrait vertical 9:16 ultra-réaliste
4. Décrire: décor luxueux, architecture, lumière, tenue vestimentaire cohérente, atmosphère

INSTRUCTION CRITIQUE POUR SEEDREAM:
- Utiliser Figure 1 = produit EXACTEMENT tel quel, copier à 100%
- Utiliser Figure 2 = mannequin, COPIER SON VISAGE et SA FORME CORPORELLE à 100%

EXEMPLE DE PROMPT PARFAIT:
"Utiliser le visage et le corps de Figure 2 à 100%. Placer le produit de Figure 1 exactement tel quel sans modification. Portrait vertical 9:16 ultra-réaliste. La mannequin de Figure 2 se tient dans une rue contemporaine au lever du jour, architecture minimaliste en béton clair et verre fumé, lumière dorée rasante. Elle porte une silhouette luxe athleisure : manteau long fluide beige sable, top seconde peau écru, pantalon tailleur ample chocolat. Aux pieds/mains, le produit de Figure 1 copié exactement - même couleur, même texture, même forme, aucune modification. Atmosphère calme, élégante, urbaine, profondeur de champ cinématographique."

RETOURNE UN JSON VALIDE:
{
  "productType": "bag" | "shoe" | "dress" | "jewelry" | "watch" | "glasses" | "accessory",
  "scenes": [
    {
      "id": 1,
      "title": "Titre court évocateur",
      "prompt_image": "Prompt complet suivant les règles ci-dessus, minimum 100 mots",
      "prompt_video": "Mouvement caméra lent, ambiance, 5s, cinématographique 4K",
      "isPackshot": false
    }
  ]
}

La dernière scène doit être un packshot produit isolé (isPackshot: true, prompt_video vide).`;

  try {
    // Télécharger l'image du mannequin et la convertir en base64
    let mannequinBase64 = '';
    try {
      const mannequinResponse = await fetch(mannequinImageUrl);
      const mannequinBlob = await mannequinResponse.blob();
      mannequinBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).replace(/^data:image\/\w+;base64,/, ''));
        reader.readAsDataURL(mannequinBlob);
      });
    } catch (e) {
      console.warn('Impossible de charger l\'image mannequin, utilisation description seule');
    }

    // Préparer le corps de la requête pour Gemini Vision avec 2 images
    const imageParts: any[] = [
      { text: systemPrompt },
      {
        inline_data: {
          mime_type: "image/jpeg",
          data: productBase64.replace(/^data:image\/\w+;base64,/, '')
        }
      }
    ];
    
    // Ajouter l'image du mannequin si disponible
    if (mannequinBase64) {
      imageParts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: mannequinBase64
        }
      });
    }

    const requestBody = {
      contents: [{
        parts: imageParts
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Gemini API:', response.status, errorText);
      throw new Error(`Erreur Gemini API: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraire le texte de la réponse
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      throw new Error('Réponse Gemini vide');
    }

    // Parser le JSON de la réponse (enlever les backticks markdown si présents)
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse Gemini');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Valider et retourner
    return {
      productType: result.productType as ProductType,
      scenes: result.scenes.map((scene: Scene, index: number) => ({
        ...scene,
        id: index + 1
      }))
    };

  } catch (error) {
    console.error('Erreur lors de l\'analyse Gemini:', error);
    throw error;
  }
};

// Export des images de démonstration pour utilisation dans le Studio
export const getDemoImages = (productType: ProductType): string[] => {
  return DEMO_IMAGES[productType] || DEMO_IMAGES.accessory;
};
