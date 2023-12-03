import fs from 'fs'
import path from 'path'

import { CAPTCHA_TEST_FOLDER, CAPTCHA_VALID_FOLDER, CAPTCHA_INVALID_FOLDER } from '../constants'

export const log = console.log.bind(console)

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function moveCaptchaFileTo(fileName: string, isValid: boolean) {
  const oldPath = path.join(CAPTCHA_TEST_FOLDER, fileName)
  const newPath = path.join(isValid ? CAPTCHA_VALID_FOLDER : CAPTCHA_INVALID_FOLDER, fileName)

  fs.renameSync(oldPath, newPath)
}

function createImageFileName(n: number) {
  return `captcha-${n.toString().padStart(4, '0')}.png`
}

export { moveCaptchaFileTo, createImageFileName }
