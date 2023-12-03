import Tesseract, { PSM, createWorker } from 'tesseract.js'
import { basename, join } from 'path'

import sharp from 'sharp'

let worker: Tesseract.Worker
;(async () => {
  worker = await createWorker('eng')
  worker.setParameters({
    tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyz',
    tessedit_pageseg_mode: PSM.SINGLE_WORD
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

async function cropImage(path: string, outputPath?: string) {
  const image = sharp(path) //
    .extract({ top: 150, left: 125, width: 400, height: 80 })
    .resize({ width: 600 })
    .sharpen({ sigma: 4 })
    .threshold(200)
    .png()

  if (outputPath) {
    await image.toFile(join(outputPath, `${basename(path)}`))
  }

  const buffer = await image.toBuffer()
  return buffer
}

//
export async function validateCaptcha(path: string, outputPath?: string) {
  const croppedImage = await cropImage(path, outputPath)
  const res = await worker.recognize(croppedImage)
  return res.data.text.trim()
}

process.on('exit', async () => {
  if (process.env.TEST === 'true') return
  await worker.terminate()
})
