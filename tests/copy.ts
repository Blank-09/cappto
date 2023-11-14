import fs from 'fs'
import path from 'path'

import { CAPTCHA_TEST_FOLDER, CAPTCHA_INVALID_FOLDER, CAPTCHA_VALID_FOLDER } from '../src/constants'

export function copyCaptchaFiles(outputFolder: string) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder)
  }

  const testFiles = fs.readdirSync(CAPTCHA_TEST_FOLDER)
  const validFiles = fs.readdirSync(CAPTCHA_VALID_FOLDER)
  const invalidFiles = fs.readdirSync(CAPTCHA_INVALID_FOLDER)

  const noOfFiles = testFiles.length + validFiles.length + invalidFiles.length

  testFiles.forEach((file) => {
    const src = path.join(CAPTCHA_TEST_FOLDER, file)
    const dest = path.join(outputFolder, file)
    fs.copyFileSync(src, dest)
  })

  validFiles.forEach((file) => {
    const src = path.join(CAPTCHA_VALID_FOLDER, file)
    const dest = path.join(outputFolder, file)
    fs.copyFileSync(src, dest)
  })

  invalidFiles.forEach((file) => {
    const src = path.join(CAPTCHA_INVALID_FOLDER, file)
    const dest = path.join(outputFolder, file)
    fs.copyFileSync(src, dest)
  })

  return noOfFiles
}

const TEST_DATA_FOLDER = path.join(__dirname, './data')
copyCaptchaFiles(TEST_DATA_FOLDER)
