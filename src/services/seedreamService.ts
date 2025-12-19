/**
 * Service Seedream 4.5 via fal.ai (Image Edit)
 * Endpoint: https://fal.run/fal-ai/bytedance/seedream/v4.5/edit
 */

import { db } from './db';
import { supabase } from './supabaseClient';

const FAL_API_ENDPOINT = 'https://fal.run/fal-ai/bytedance/seedream/v4.5/edit';

interface FalResponse {
  images: { url: string; content_type: string }[];
  seed: number;
}

// Convertir base64 en Blob
const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1] || 'image/jpeg';
  const raw = atob(parts[1]);
  const array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return new Blob([array], { type: contentType });
};

// Uploader une image base64 vers Supabase Storage et retourner l'URL publique
const uploadImageToStorage = async (base64Image: string): Promise<string | null> => {
  try {
    const blob = base64ToBlob(base64Image);
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    console.log('Upload vers Supabase Storage:', fileName, 'Taille:', blob.size);
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error('Erreur upload Supabase:', error);
      alert(`Erreur upload Supabase: ${error.message}`);
      return null;
    }
    
    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
    
    console.log('Image uploadée:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Erreur upload:', error);
    return null;
  }
};

export const generateImageWithSeedream = async (
  prompt: string,
  imageUrls: string[],
  options?: {
    imageSize?: string;
  }
): Promise<string | null> => {
  try {
    const apiKey = await db.apiConfig.getKey('seedream');
    
    if (!apiKey) {
      console.error('Clé API fal.ai non configurée');
      alert('Clé API Seedream (fal.ai) non configurée! Allez dans Admin > API pour la configurer.');
      return null;
    }

    console.log('Appel fal.ai Seedream Edit avec prompt:', prompt.substring(0, 100) + '...');
    console.log('Images envoyées:', imageUrls);

    const response = await fetch(FAL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        image_urls: imageUrls,
        image_size: options?.imageSize || 'auto_2K',
        num_images: 1,
        enable_safety_checker: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur fal.ai Seedream API:', response.status, errorText);
      alert(`Erreur fal.ai (${response.status}): ${errorText}`);
      return null;
    }

    const data: FalResponse = await response.json();
    console.log('Réponse fal.ai:', data);
    
    if (data.images && data.images.length > 0) {
      return data.images[0].url;
    }

    return null;
  } catch (error) {
    console.error('Erreur lors de la génération Seedream:', error);
    alert(`Erreur Seedream: ${error}`);
    return null;
  }
};

export const generateMultipleImages = async (
  prompts: string[],
  productImageBase64: string,
  mannequinImageUrl: string
): Promise<string[]> => {
  const results: string[] = [];
  
  // Uploader l'image produit (base64) vers Supabase Storage pour obtenir une URL
  console.log('Upload du produit vers Supabase Storage...');
  const productUrl = await uploadImageToStorage(productImageBase64);
  
  if (!productUrl) {
    alert('Erreur: Impossible d\'uploader l\'image produit');
    return [];
  }
  
  // Préparer les URLs des deux images
  const imageUrls = [productUrl, mannequinImageUrl].filter(Boolean);
  console.log('URLs pour fal.ai:', imageUrls);
  
  for (const prompt of prompts) {
    const imageUrl = await generateImageWithSeedream(prompt, imageUrls);
    if (imageUrl) {
      results.push(imageUrl);
    } else {
      results.push(`https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=720&h=1280&fit=crop&seed=${Date.now()}`);
    }
  }
  
  return results;
};
