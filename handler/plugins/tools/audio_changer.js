const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs")

module.exports = {
  cmd: ["audio"],
  description: "Ubah suara audio menjadi suara audio kustom",
  help: ["audio"],
  execute: async (m, { sock, args, quoted, pakaiLimit }) => {
    if (quoted.mtype !== "audioMessage") {
      return m.reply("Pesan tersebut bukan pesan audio");
    }

    const audioInput = await sock.downloadAndSaveMediaMessage(
      quoted,
      "audio_input"
    );

    if (args.length === 0) {
      return m.reply(
        "Tolong masukkan efek audio yang diinginkan. Contoh: /audio smooth, slowed, reverb"
      );
    }

    const effects = args
      .join(" ")
      .split(",")
      .map((effect) => effect.trim());
    let pttOption = args.some((arg) => arg.toLowerCase().includes("ptt=true"));

    let outputAudio = audioInput;

    try {
      let ffmpegCommand = ffmpeg(audioInput);

      effects.forEach((effect) => {
        switch (effect.toLowerCase()) {
          case "smooth":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "asetrate=44100*1.25,aresample=44100"
            );
            break;
          case "slowed":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "asetrate=44100*0.8,aresample=44100"
            );
            break;
          case "reverb":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "aecho=0.8:0.9:2000:0.5"
            );
            break;
          case "distorted":
            ffmpegCommand = ffmpegCommand.audioFilters("distort");
            break;
          case "earrape":
            ffmpegCommand = ffmpegCommand.audioFilters("-af volume=12");
            break;
          case "bassboost":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "bass=g=10,lowpass=f=200,acompressor=ratio=4"
            );
            break;
          case "pitchshift":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "asetrate=44100*1.2,atempo=1/1.2"
            );
            break;
          case "flanger":
            ffmpegCommand = ffmpegCommand.audioFilters("flanger");
            break;
          case "underwater":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "asetrate=44100*0.8,aresample=44100,lowpass=f=800"
            );
            break;
          case "vader":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "asetrate=44100*0.8,aresample=44100,distort,lowpass=f=400,aecho=0.9:0.8:500:0.3"
            );
            break;
          case "echo":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "aecho=0.8:0.9:1000:0.5"
            );
            break;
          case "robot":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "asetrate=44100*1.2,aresample=44100,chorus=0.7:0.9:55:0.2:0.25:0.5"
            );
            break;
          case "alien":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "asetrate=44100*0.5,aresample=44100,atempo=1.5,aecho=0.5:0.8:1000:0.2"
            );
            break;
          case "blown":
            ffmpegCommand = ffmpegCommand.audioFilters(
              "-af acrusher=.1:1:64:0:log"
            );
            break;
        }
      });

      const outputAudioPath = "audio_output.mp3";
      ffmpegCommand
        .save(outputAudioPath)
        .on("end", async () => {
          if (pttOption) {
            await sock.sendMessage(
              m.chat,
              {
                audio: { url: outputAudioPath },
                mimetype: "audio/mp4",
                ptt: true,
              },
              { quoted: m }
            );
          } else {
            await sock.sendMessage(
              m.chat,
              { audio: { url: outputAudioPath }, mimetype: "audio/mp4" },
              { quoted: m }
            );
          }
          await pakaiLimit(2);
          console.log("Audio processed and sent back.");
          fs.unlinkSync(outputAudioPath);
        })
        .on("error", (err) => {
          console.error("Error processing audio:", err);
          m.reply("Terjadi kesalahan saat memproses audio. Coba lagi nanti.");
        });
    } catch (error) {
      console.error("Error in audio processing:", error);
      m.reply("Terjadi kesalahan saat memproses audio. Coba lagi nanti.");
    }
  },
};
