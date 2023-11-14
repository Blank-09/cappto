import { join } from 'path'

import { createWorker } from 'tesseract.js'
import { SCREENSHOT_SCREEN_FOLDER } from '../constants'

// Initialize tesseract worker
async function initialize(whitelist?: string) {
  const worker = await createWorker('eng')

  worker.setParameters({
    tessedit_char_whitelist: whitelist
  })

  return worker
}

const defaultRect = { top: 150, left: 125, width: 400, height: 80 }

// Convert image to text
async function getCaptchaText(path: string, isAlphaNum = true, pos?: Tesseract.Rectangle) {
  const worker = await initialize(isAlphaNum ? '0123456789abcdefghijklmnopqrstuvwxyz' : undefined)

  // Recognize text
  let ret = await worker.recognize(path, {
    rectangle: pos ?? defaultRect
  })

  console.log('Captcha Text:', ret.data.text)

  await worker.terminate()
  return ret.data.text.trim()
}

// let noOfFiles = fs.readdirSync(SCREENSHOT_SCREEN_FOLDER).length
// const path = join(SCREENSHOT_SCREEN_FOLDER, `screen-${(noOfFiles++).toString().padStart(4, '0')}.png`)

async function getTextFromScreen(driver: WebdriverIO.Browser) {
  const path = join(SCREENSHOT_SCREEN_FOLDER, `screen.png`)

  // Recognize text
  await driver.saveScreenshot(path)

  const worker = await initialize()
  const ret = await worker.recognize(path)

  await worker.terminate()
  return ret.data.text
}

async function findTextOnScreen(driver: WebdriverIO.Browser, text: string) {
  const res = await getTextFromScreen(driver)
  return res.indexOf(text) !== -1
}

function waitForTextOnScreen(driver: WebdriverIO.Browser, text: string) {
  return driver.waitUntil(async () => await findTextOnScreen(driver, text), {
    timeout: 60 * 1000,
    interval: 5 * 1000,
    timeoutMsg: 'Text Not found'
  })
}

export { getCaptchaText, getTextFromScreen, findTextOnScreen, waitForTextOnScreen }
