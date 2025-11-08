#!/usr/bin/env node

/**
 * Script to automatically generate manifest.json from vocabulary files
 * Run this after adding new vocabulary files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VOCAB_DIR = path.join(__dirname, '../data/vocab');
const MANIFEST_PATH = path.join(VOCAB_DIR, 'manifest.json');

interface ManifestLanguage {
  name: string;
  sets: Record<string, string>;
}

interface Manifest {
  languages: Record<string, ManifestLanguage>;
}

function buildManifest() {
  const manifest: Manifest = {
    languages: {}
  };

  // Read all language directories
  const languageDirs = fs.readdirSync(VOCAB_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const langCode of languageDirs) {
    const langPath = path.join(VOCAB_DIR, langCode);
    const files = fs.readdirSync(langPath).filter(f => f.endsWith('.json'));
    
    if (files.length === 0) continue;

    // Read first file to get language name
    const firstFilePath = path.join(langPath, files[0]);
    const firstFile = JSON.parse(fs.readFileSync(firstFilePath, 'utf-8'));
    
    manifest.languages[langCode] = {
      name: firstFile.language === 'en' ? 'English' : 
            firstFile.language === 'es' ? 'Español' :
            firstFile.language === 'pl' ? 'Polski' :
            firstFile.language,
      sets: {}
    };

    // Add all sets for this language
    for (const file of files) {
      const filePath = path.join(langPath, file);
      const vocabData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const setName = path.basename(file, '.json');
      manifest.languages[langCode].sets[setName] = vocabData.title;
    }
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log('✅ Manifest generated successfully at', MANIFEST_PATH);
  console.log(JSON.stringify(manifest, null, 2));
}

buildManifest();
