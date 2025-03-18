const { ElevenLabsClient } = require("elevenlabs");
const fs = require("fs");
const path = require("path");

async function TTSHandler(sock) {
  sock.Speak = async (jid, text, quoted = "", options = {}) => {
    const voice = options.voice || "Brian"; 

    const outputDir = path.join(__dirname, "../output");
    const mp3File = path.join(outputDir, `tts_${Date.now()}.mp3`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const elevenlabs = new ElevenLabsClient({
      apiKey: "sk_f23f97efe1a9430069fd6d7500e17ec8bcad0cfff08addf1", 
    });

    try {
      const audioStream = await elevenlabs.generate({
        voice: voice, 
        text: text,
        model_id: "eleven_multilingual_v2", 
      });

      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      fs.writeFileSync(mp3File, audioBuffer);

      await sock.sendMessage(
        jid,
        {
          audio: audioBuffer,
          mimetype: "audio/mpeg",
          ptt: true,
          ...options
        },
        { quoted, ...options }
      );

      return mp3File;
    } catch (error) {
      console.error(`Error generating TTS: ${error}`);
      throw error;
    } finally {
      if (fs.existsSync(mp3File)) {
        fs.unlinkSync(mp3File);
      }
    }
  };
}

module.exports = { TTSHandler };
