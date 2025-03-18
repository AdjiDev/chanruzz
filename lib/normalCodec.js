const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

async function NormalCodec(video, options = {}) {
    return new Promise((resolve, reject) => {
        const output = options.output || "./media/video/" + path.basename(video, path.extname(video)) + "_converted.mp4";
        
        ffmpeg(video)
            .videoCodec("libx264") 
            .audioCodec("aac") 
            .outputOptions("-preset fast") 
            .on("end", () => resolve(output))
            .on("error", (err) => reject(err))
            .save(output);
    });
}

//NormalCodec("input.mp4")
//    .then((output) => console.log("Konversi selesai:", output))
//    .catch((err) => console.error("Terjadi kesalahan:", err));

module.exports = NormalCodec;
