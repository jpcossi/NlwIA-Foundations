import fs, { readFileSync } from "fs"
import wav from "node-wav"
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"

const filePath = "./tmp/audio.mp4"
const outputPath = filePath.replace("mp4", ".wav")

export const convert = () =>
  new Promise((resolve, reject) => {
    ffmpeg.setFfmpegPath(ffmpegStatic)
    ffmpeg()
      .input(filePath)
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => {
        const file = readFileSync(outputPath)
        const fileDecoded = wav.decode(file)

        const audioData = fileDecoded.channelData[0]
        const floatArray = new Float32Array(audioData)

        console.log("Video convertido com sucesso!")

        resolve(floatArray)
        fs.unlinkSync(outputPath)
      })
      .on("error", error => {
        console.log("Error ao converter o video", error)
        reject(error)
      })
      .save(outputPath)
  })
