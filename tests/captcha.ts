import Tesseract, { PSM, createWorker } from 'tesseract.js'
import { basename } from 'path'

import sharp from 'sharp'

let worker: Tesseract.Worker
;(async () => {
  worker = await createWorker('eng', 2)
  worker.setParameters({
    tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyz'
  })
})()

export async function waitUntilReady() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (worker) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}

// function recognize(buffer: Buffer) {
//   return worker.recognize(buffer)
// }

async function cropImage(path: string, outputAsFile?: boolean) {
  const image = sharp(path) //
    .extract({ top: 150, left: 125, width: 400, height: 80 })
    .resize({ width: 600 })
    .sharpen({ sigma: 2 })
    .threshold(200)
    .png()

  if (outputAsFile) {
    await image.toFile(`./output/${basename(path)}`)
  }

  return image.toBuffer()
}

//
export async function validateCaptcha(path: string) {
  const croppedImage = await cropImage(path)
  const res = await worker.recognize(croppedImage)
  return res.data.text.trim()
}

process.on('exit', async () => {
  if (process.env.TEST === 'true') return
  await worker.terminate()
})

// o - 0 - o0
// 1 - l - i
// 4 - 4a - a - 4d
// q - g
// e - 6
// 5 - s - 5s
// e - c

// 8
