/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import fetch from "node-fetch";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

/**
 * Firebase function that serves as a proxy for audio files
 * This helps bypass CORS issues with direct browser requests
 */
export const getAudioFile = onRequest({
  cors: true,
  maxInstances: 10,
}, async (request, response) => {
  try {
    // Log the request
    logger.info("Audio file request received", {
      query: request.query,
      structuredData: true
    });

    // Extract parameters from the request
    const surahId = request.query.surahId;
    const verseNumber = request.query.verseNumber;

    // Validate parameters
    if (!surahId || !verseNumber) {
      logger.error("Missing required parameters", {
        surahId,
        verseNumber,
        structuredData: true
      });
      response.status(400).send({
        error: "Missing required parameters. Please provide surahId and verseNumber."
      });
      return;
    }

    // Construct the URL for the audio file
    const audioUrl = `https://quranaudio.pages.dev/1/${surahId}_${verseNumber}.mp3`;
    logger.info("Fetching audio from URL", {
      audioUrl,
      structuredData: true
    });

    // Fetch the audio file
    const audioResponse = await fetch(audioUrl);

    // Check if the request was successful
    if (!audioResponse.ok) {
      logger.error("Failed to fetch audio file", {
        status: audioResponse.status,
        statusText: audioResponse.statusText,
        structuredData: true
      });
      response.status(audioResponse.status).send({
        error: `Failed to fetch audio file: ${audioResponse.statusText}`
      });
      return;
    }

    // Get the audio file content
    const audioBuffer = await audioResponse.arrayBuffer();

    // Set the appropriate headers
    response.setHeader("Content-Type", "audio/mpeg");
    response.setHeader("Content-Length", audioBuffer.byteLength);
    response.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

    // Send the audio file
    response.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    // Log the error
    logger.error("Error handling audio file request", {
      error,
      structuredData: true
    });

    // Send an error response
    response.status(500).send({
      error: "An error occurred while fetching the audio file."
    });
  }
});
