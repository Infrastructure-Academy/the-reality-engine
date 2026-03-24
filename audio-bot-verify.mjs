// Independent AI Audio Bot Verification
// Uses the project's built-in LLM helper via direct API call
// Runs standalone with tsx

import { config } from 'dotenv';
config();

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || '';
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || '';

const videos = [
  {
    name: "V4-B Starborne (Ages 14-18)",
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030220481/ePOgHmPLBXxYgadK.wav",
    mime: "audio/wav",
    expectedMusic: "Starborne Epic Cinematic (Star Wars brass) at 3% volume",
    expectedVoice: "Male narrator, Flight Deck cockpit briefing for ages 14-18"
  },
  {
    name: "V4-B Star Wars Alt (Ages 14-18)",
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030220481/bwplzPrjAfDoASWc.wav",
    mime: "audio/wav",
    expectedMusic: "Space Adventures Star Wars Style at 1% volume",
    expectedVoice: "Male narrator, Flight Deck cockpit briefing for ages 14-18"
  },
  {
    name: "V5-A Scholar's Secret (Ages 18+)",
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030220481/BhSHnmUjEkgIIBLD.wav",
    mime: "audio/wav",
    expectedMusic: "The Scholar's Secret (classical piano) at 3% volume",
    expectedVoice: "Male narrator, Scholar mode ancient library for ages 18+"
  },
  {
    name: "V5-B Middle-Earth (Ages 18+)",
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030220481/dzLivbCRnkwpNGmb.wav",
    mime: "audio/wav",
    expectedMusic: "Middle-Earth (LOTR orchestral) at 0.5% volume",
    expectedVoice: "Male narrator, Scholar mode ancient library for ages 18+"
  }
];

async function callLLM(messages) {
  const apiUrl = FORGE_API_URL.replace(/\/$/, '') + '/v1/chat/completions';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FORGE_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gemini-2.5-flash',
      messages,
      max_tokens: 4096,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "audio_verification",
          strict: true,
          schema: {
            type: "object",
            properties: {
              voice_detected: { type: "boolean", description: "Is clear human voice narration detected?" },
              voice_dominant: { type: "boolean", description: "Is voice clearly dominant over any background music?" },
              music_detected: { type: "boolean", description: "Is background music detected?" },
              music_level: { type: "string", description: "Music level: none/barely_audible/subtle/moderate/loud/overwhelming" },
              contamination_detected: { type: "boolean", description: "Is there unwanted audio contamination (wrong music genre, childish music, etc.)?" },
              contamination_description: { type: "string", description: "Description of any contamination found, or 'none'" },
              voice_clarity_score: { type: "number", description: "Voice clarity score 1-10 (10=crystal clear)" },
              overall_pass: { type: "boolean", description: "Does this audio PASS for professional broadcast?" },
              narration_summary: { type: "string", description: "Brief summary of what the narrator is saying" },
              notes: { type: "string", description: "Any additional observations" }
            },
            required: ["voice_detected", "voice_dominant", "music_detected", "music_level", "contamination_detected", "contamination_description", "voice_clarity_score", "overall_pass", "narration_summary", "notes"],
            additionalProperties: false
          }
        }
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  if (!data.choices || !data.choices[0]) {
    console.error('  API Response:', JSON.stringify(data).slice(0, 500));
    throw new Error('No choices in API response');
  }
  return data.choices[0].message.content;
}

async function verifyVideo(video) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`VERIFYING: ${video.name}`);
  console.log(`${'='.repeat(60)}`);
  
  try {
    const result = await callLLM([
      {
        role: "system",
        content: "You are an independent audio quality verification bot for a police audit. Analyze the audio track of the provided video file. Report HONESTLY on: (1) voice narration presence and clarity, (2) background music presence and level, (3) whether voice dominates over music, (4) any contamination from wrong/childish music. Be BRUTALLY HONEST - this is evidence for law enforcement."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this video's audio. Expected content: ${video.expectedVoice} with background music: ${video.expectedMusic}. Check if voice narration is clearly dominant over music. Check for ANY contamination from childish/upbeat/anime music that would be inappropriate for this age group.`
          },
          {
            type: "file_url",
            file_url: {
              url: video.url,
              mime_type: video.mime || "audio/wav"
            }
          }
        ]
      }
    ]);
    
    const parsed = JSON.parse(result);
    console.log(`  Voice Detected: ${parsed.voice_detected ? 'YES ✓' : 'NO ✗'}`);
    console.log(`  Voice Dominant: ${parsed.voice_dominant ? 'YES ✓' : 'NO ✗'}`);
    console.log(`  Music Detected: ${parsed.music_detected ? 'YES' : 'NO'}`);
    console.log(`  Music Level: ${parsed.music_level}`);
    console.log(`  Contamination: ${parsed.contamination_detected ? 'YES ✗ - ' + parsed.contamination_description : 'NONE ✓'}`);
    console.log(`  Voice Clarity: ${parsed.voice_clarity_score}/10`);
    console.log(`  OVERALL: ${parsed.overall_pass ? '>>> PASS ✓ <<<' : '>>> FAIL ✗ <<<'}`);
    console.log(`  Narration: ${parsed.narration_summary}`);
    if (parsed.notes) console.log(`  Notes: ${parsed.notes}`);
    
    return { video: video.name, ...parsed };
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    return { video: video.name, error: err.message, overall_pass: false };
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  INDEPENDENT AI AUDIO BOT VERIFICATION                     ║");
  console.log("║  Infrastructure Academy - Youth Intro Videos V4-B & V5     ║");
  console.log("║  Date: " + new Date().toISOString().slice(0,19) + "                              ║");
  console.log("║  Protocol: Police Audit Evidence                            ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  
  if (!FORGE_API_URL || !FORGE_API_KEY) {
    console.error("ERROR: Missing FORGE API credentials. Cannot run verification.");
    process.exit(1);
  }
  console.log(`API URL: ${FORGE_API_URL.slice(0, 30)}...`);
  
  const results = [];
  for (const video of videos) {
    const result = await verifyVideo(video);
    results.push(result);
  }
  
  console.log("\n\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║  FINAL SUMMARY                                              ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  
  let allPass = true;
  for (const r of results) {
    const status = r.overall_pass ? 'PASS ✓' : 'FAIL ✗';
    const clarity = r.voice_clarity_score || 'N/A';
    const music = r.music_level || 'error';
    console.log(`  ${r.video}: ${status} | Clarity: ${clarity}/10 | Music: ${music}`);
    if (!r.overall_pass) allPass = false;
  }
  
  console.log(`\n  ═══ OVERALL VERDICT: ${allPass ? 'ALL 4 VIDEOS PASS ✓✓✓' : 'SOME VIDEOS FAILED ✗✗✗'} ═══`);
  
  // Write results to JSON
  const fs = await import('fs');
  fs.writeFileSync('/home/ubuntu/upload/audio-bot-results.json', JSON.stringify(results, null, 2));
  console.log("\nResults saved to /home/ubuntu/upload/audio-bot-results.json");
}

main().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
