// Configure dotenv
import { configDotenv } from 'dotenv'
configDotenv()

//
import { remote } from 'webdriverio'
import { wdOptions } from './config/capabilities'

import { detectCaptcha, fillCaptcha, openAds, openVideo } from './utils/captcha'
import { createImageFileName, log, moveCaptchaFileTo, sleep } from './utils'

import fs from 'fs'
import path from 'path'
import login from './utils/login'

import { getTextFromScreen, waitForTextOnScreen } from './tools/text-recognizer'
import { CAPTCHA_INVALID_FOLDER, CAPTCHA_TEST_FOLDER, CAPTCHA_VALID_FOLDER } from './constants'
import { validateCaptcha } from '../tests/captcha'

const username = process.env.MYV3ADS_USERNAME ?? ''
const password = process.env.MYV3ADS_PASSWORD ?? ''

let driver: WebdriverIO.Browser

// Run the test
async function runTest() {
  driver = await remote(wdOptions)
  const status = await driver.status()

  if (status.ready) {
    console.log('Appium server is running')
  }

  // await driver.pause(17000)
  await waitForTextOnScreen(driver, 'Close') // wait fot close btn
  await login(driver, username, password)
  await sleep(5000)

  const testFiles = fs.readdirSync(CAPTCHA_TEST_FOLDER)
  const validFiles = fs.readdirSync(CAPTCHA_VALID_FOLDER)
  const invalidFiles = fs.readdirSync(CAPTCHA_INVALID_FOLDER)

  const noOfFiles = testFiles.length + validFiles.length + invalidFiles.length

  async function captchaLoop(noOfFiles: number, limit = 5) {
    if (noOfFiles >= noOfFiles + limit) {
      return
    }

    let menubar = await driver.$('//android.widget.Image[@text="menuImage"]')

    const prevFile = createImageFileName(noOfFiles - 1)
    const prevfileScrshot = path.join(CAPTCHA_TEST_FOLDER, prevFile)
    const isMenubarExists = await menubar.isExisting()

    if (isMenubarExists) {
      await menubar.click()
      await sleep(1000)
      await openVideo(driver)
      await openAds(driver)
    }

    if (fs.existsSync(prevfileScrshot)) {
      moveCaptchaFileTo(prevFile, !isMenubarExists)
    }

    await sleep(7000)
    console.log('Captcha--', await detectCaptcha(driver))
    await sleep(2000)

    const filename = createImageFileName(noOfFiles)
    const captchaScrshotFile = path.join(CAPTCHA_TEST_FOLDER, filename)
    const captchaContainer = await driver.$('//android.view.View[@resource-id="captcha-sec"]')

    await captchaContainer.saveScreenshot(captchaScrshotFile)
    const captcha = await validateCaptcha(captchaScrshotFile)
    await fillCaptcha(driver, captcha)

    await sleep(500)
    const screen = await getTextFromScreen(driver)
    console.log(screen)

    if (screen.includes('Today earning reached')) {
      return
    }

    await captchaLoop(noOfFiles + 1)
  }

  await captchaLoop(noOfFiles, 100)

  await sleep(10000)
  await driver.deleteSession()
}

runTest().catch((e) => {
  log(e)
  process.exit(0)
})

// process.on('SIGINT', () => {
//   console.log('Force Stopping...')
//   process.exit(0)
// })

// process.on('SIGTERM', () => {
//   console.log('Received SIGTERM signal. Cleaning up...')
//   process.exit(0)
// })

// process.on('uncaughtException', () => {
//   console.log('Error: index.ts -> uncaughtException')
// })

// process.on('exit', () => {
//   driver.deleteSession()
// })
