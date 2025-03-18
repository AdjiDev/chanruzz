const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
require("../../../config/init");
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error(`Failed to upload file: ${path}`, error);
    throw new Error("File upload failed.");
  }
}

async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const file of files) {
    let processedFile = await fileManager.getFile(file.name);
    while (processedFile.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      processedFile = await fileManager.getFile(file.name);
    }
    if (processedFile.state !== "ACTIVE") {
      throw Error(`File ${processedFile.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
  systemInstruction: global.aiprompt,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 32768,
  responseMimeType: "text/plain",
};

module.exports = {
  cmd: ["think"],
  description: "Chat with AI using Google Gemini API",
  help: ["think [teks]"],
  premium: true,
  execute: async (m, { sock, qmsg, mime, args, quoted, isPremium, mess }) => {
    try {
      if (!isPremium) return m.reply(mess.premium);
      await sock.sendMessage(m.chat, {
        react: { text: "🕛", key: m.key },
      });

      const files = [];

      if (/image/.test(mime)) {
        const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg, "image");
        files.push(await uploadToGemini(mediaPath, "image/jpeg"));
        fs.unlinkSync(mediaPath);
      } else if (/video/.test(mime)) {
        const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg, "video");
        files.push(await uploadToGemini(mediaPath, "video/mp4"));
        fs.unlinkSync(mediaPath);
      } else if (/audio/.test(mime)) {
        const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg, "audio");
        files.push(await uploadToGemini(mediaPath, "audio/mpeg"));
        fs.unlinkSync(mediaPath);
      }

      await waitForFilesActive(files);

      const history = [];

      if (files.length > 0) {
        history.push({
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
          ],
        });
      }

      const userText = args.join(" ") || quoted.text;
      if (userText) {
        history.push({
          role: "user",
          parts: [{ text: userText }],
        });
      }

      const chatSession = model.startChat({ generationConfig, history });
      const result = await chatSession.sendMessage(userText);
      const responseText = await result.response.text();
      await sock.sendMessage(
        m.chat,
        {
          text: `${responseText}`,
          mentions: [m.sender],
        },
        { quoted: m }
      );

      await sock.sendMessage(m.chat, {
        react: { text: "", key: m.key },
      });
    } catch (error) {
      console.error("Error in AI plugin:", error);
      return m.reply("An error occurred while processing your request.");
    }
  },
};
