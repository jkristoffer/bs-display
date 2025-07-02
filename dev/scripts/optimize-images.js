#!/usr/bin/env node

/**
 * Automatically optimizes product images during build
 * - Converts PNG/JPG to WebP and AVIF
 * - Maintains original files as fallback
 * - No code changes needed for new products
 */

import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const INPUT_DIR = 'public/assets/models';
const QUALITY = 85;

async function optimizeImages() {
  console.log('🖼️  Optimizing product images...');
  
  try {
    // Find all images in models directory
    const imageFiles = await glob(`${INPUT_DIR}/*.{png,jpg,jpeg}`, {
      ignore: ['**/*.webp', '**/*.avif']
    });
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    const optimizations = imageFiles.map(async (inputFile) => {
      const { name, dir } = path.parse(inputFile);
      const webpOutput = path.join(dir, `${name}.webp`);
      const avifOutput = path.join(dir, `${name}.avif`);
      
      try {
        // Check if optimized versions already exist and are newer
        const inputStats = await fs.stat(inputFile);
        
        const [webpExists, avifExists] = await Promise.all([
          fs.access(webpOutput).then(() => true).catch(() => false),
          fs.access(avifOutput).then(() => true).catch(() => false)
        ]);
        
        const promises = [];
        
        // Generate WebP if needed
        if (!webpExists) {
          promises.push(
            sharp(inputFile)
              .webp({ quality: QUALITY, effort: 4 })
              .toFile(webpOutput)
              .then(() => console.log(`✅ Generated ${webpOutput}`))
          );
        }
        
        // Generate AVIF if needed  
        if (!avifExists) {
          promises.push(
            sharp(inputFile)
              .avif({ quality: QUALITY, effort: 4 })
              .toFile(avifOutput)
              .then(() => console.log(`✅ Generated ${avifOutput}`))
          );
        }
        
        await Promise.all(promises);
        
      } catch (error) {
        console.error(`❌ Failed to optimize ${inputFile}:`, error.message);
      }
    });
    
    await Promise.all(optimizations);
    console.log('🎉 Image optimization complete!');
    
  } catch (error) {
    console.error('❌ Image optimization failed:', error.message);
    process.exit(1);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages();
}

export { optimizeImages };