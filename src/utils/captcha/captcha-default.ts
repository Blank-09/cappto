import Tesseract, { PSM, createWorker } from 'tesseract.js'

let worker: Tesseract.Worker
;(async () => {
  worker = await createWorker('eng')
  worker.setParameters({
    tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyz',
    tessedit_pageseg_mode: PSM.SINGLE_WORD
  })
})()

export async function waitUntilReady() {
  if (worker) return

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (worker) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}

//
export async function validateCaptcha(path: string) {
  const res = await worker.recognize(path, {
    rectangle: {
      top: 150,
      left: 125,
      width: 400,
      height: 80
    }
  })

  return res.data.text.toLowerCase().trim()
}

process.on('exit', async () => {
  if (process.env.TEST === 'true') return
  await worker.terminate()
})
