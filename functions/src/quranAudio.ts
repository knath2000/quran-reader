import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// Using require for node-fetch to fix ESM/CommonJS issues
const fetch = require("node-fetch");

/**
 * Firebase Function to serve Quran audio with multiple fallback sources
 * 
 * Query parameters:
 * - surahId: The ID of the surah (chapter)
 * - verseNumber: The verse number within the surah
 * 
 * Returns:
 * - Audio file if found
 * - Error message if all sources fail
 */
export const getQuranAudio = onRequest({
  cors: [
    '*', // Allow all origins
    'https://quran-reader-9d31e.web.app',
    'https://quran-reader-9d31e.firebaseapp.com',
    'http://localhost:3000'
  ],
  maxInstances: 10,
  invoker: 'public' // Make the function publicly accessible
}, async (request, response) => {
  try {
    const { surahId, verseNumber } = request.query;
    
    // Validate parameters
    if (!surahId || !verseNumber) {
      logger.error("Missing required parameters", { surahId, verseNumber });
      response.status(400).send({ error: "Missing required parameters. Please provide surahId and verseNumber." });
      return;
    }
    
    // Format IDs for different API sources
    const surahIdNum = parseInt(surahId as string, 10);
    const verseNumberNum = parseInt(verseNumber as string, 10);
    
    // For sources that require formatted IDs (e.g., 001 instead of 1)
    const formattedSurahId = surahIdNum.toString().padStart(3, '0');
    const formattedVerseNumber = verseNumberNum.toString().padStart(3, '0');
    
    // Define audio sources with fallbacks in order of priority
    const audioSources = [
      // Primary source
      `https://quranaudio.pages.dev/1/${surahIdNum}_${verseNumberNum}.mp3`,
      
      // Fallback sources
      `https://audio.recitequran.com/verse/AbdulBaset/${surahIdNum}:${verseNumberNum}`,
      `https://verse.mp3quran.net/arabic/Abdullah_Basfar/${surahIdNum}${verseNumberNum}.mp3`,
      `https://mirrors.quranicaudio.com/everyayah/Abdullah_Basfar_64kbps/${formattedSurahId}${formattedVerseNumber}.mp3`,
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahIdNum}${verseNumberNum}.mp3`
    ];
    
    logger.info("Attempting to fetch audio", { 
      surahId: surahIdNum, 
      verseNumber: verseNumberNum,
      sourceCount: audioSources.length 
    });
    
    // Try each source in sequence until one succeeds
    for (let i = 0; i < audioSources.length; i++) {
      const source = audioSources[i];
      try {
        logger.info(`Trying source ${i + 1}/${audioSources.length}`, { url: source });
        
        // Fetch with timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(),
         8000); // 8 second timeout
        
        const audioResponse = await fetch(source, { 
          signal: controller.signal,
          method: 'GET'
        });
        
        clearTimeout(timeoutId);
        
        if (audioResponse.ok) {
          logger.info(`Successfully fetched audio from source ${i + 1}`, { url: source });
          
          // Get the audio data
          const audioBuffer = await audioResponse.buffer();
          
          // Set appropriate headers
          response.setHeader('Content-Type', 'audio/mpeg');
          response.setHeader('Content-Length', audioBuffer.length);
          response.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
          response.setHeader('Access-Control-Allow-Origin', '*');
          response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
          response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
          
          // Send the audio data
          response.status(200).send(audioBuffer);
          return;
        } else {
          logger.warn(`Source ${i + 1} failed with status ${audioResponse.status}`, { url: source });
        }
      } catch (error) {
        logger.warn(`Error fetching from source ${i + 1}`, { 
          url: source, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // If all sources failed
    logger.error("All audio sources failed", { surahId: surahIdNum, verseNumber: verseNumberNum });
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.status(404).send({ 
      error: "Audio not found in any source", 
      surahId: surahIdNum, 
      verseNumber: verseNumberNum 
    });
    
  } catch (error) {
    logger.error("Unexpected error in getQuranAudio function", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.status(500).send({ error: "Internal server error" });
  }
}); 