import { PSM, createWorker } from 'tesseract.js'
import { basename } from 'path'

import sharp from 'sharp'

//
export async function validateCaptcha(path: string) {
  const croppedImage = await cropImage(path)
  const res = await recognize(croppedImage)
  return res.data.text.trim()
}

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

async function recognize(buffer: Buffer) {
  const worker = await createWorker('eng', 2)
  worker.setParameters({
    tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyz',
    tessedit_pageseg_mode: PSM.SINGLE_WORD
    // tessjs_create_box: '1'
  })

  // console.log('Recognizing captcha...')

  const ret = await worker.recognize(buffer)
  await worker.terminate()

  return ret
}

// o - 0 - o0
// 1 - l - i
// 4 - 4a - a - 4d
// q - g
// e - 6
// 5 - s - 5s
// e - c

// 8
