import { remote } from 'webdriverio'
import { configDotenv } from 'dotenv'
import { wdOptions } from './config/capabilities'

import { detectCaptcha, fillCaptcha, openAds } from './utils/captcha'
import { log, moveCaptchaFileTo, sleep } from './utils'

import fs from 'fs'
import path from 'path'
import login from './utils/login'

import { getCaptchaText, getTextFromScreen, waitForTextOnScreen } from './tools/text-recognizer'
import { CAPTCHA_INVALID_FOLDER, CAPTCHA_TEST_FOLDER, CAPTCHA_VALID_FOLDER } from './constants'
import { validateCaptcha } from '../tests/captcha'

// Configure dotenv
configDotenv()

const username = process.env.MYV3ADS_USERNAME ?? ''
const password = process.env.MYV3ADS_PASSWORD ?? ''

// Run the test
async function runTest() {
  const driver = await remote(wdOptions)
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

    const prevFile = `captcha-${(noOfFiles - 1).toString().padStart(4, '0')}.png`
    const prevfileScrshot = path.join(CAPTCHA_TEST_FOLDER, prevFile)
    const isMenubarExists = await menubar.isExisting()

    if (isMenubarExists) {
      await openAds(driver)
    }

    if (fs.existsSync(prevfileScrshot)) {
      moveCaptchaFileTo(prevFile, !isMenubarExists)
    }

    await sleep(7000)
    console.log('Captcha--', await detectCaptcha(driver))
    await sleep(2000)

    const filename = `captcha-${noOfFiles.toString().padStart(4, '0')}.png`
    const captchaScrshotFile = path.join(CAPTCHA_TEST_FOLDER, filename)
    const captchaContainer = await driver.$('//android.view.View[@resource-id="captcha-sec"]')

    await captchaContainer.saveScreenshot(captchaScrshotFile)

    // const captcha = await getCaptchaText(captchaScrshotFile)
    const captcha = await validateCaptcha(captchaScrshotFile)
    await fillCaptcha(driver, captcha)

    const screen = await getTextFromScreen(driver)
    console.log(screen)

    // const text = await getCaptchaText('./src/screenshots/screen.png', false, {
    //   top: 245,
    //   left: 150,
    //   width: 420,
    //   height: 80
    // })

    // if (text === 'Invalid Captcha') {
    //   moveCaptchaFileTo(filename, false)
    // }

    if (screen.includes('Today earning reached')) {
      // return
    }

    await captchaLoop(noOfFiles + 1)
  }

  await captchaLoop(noOfFiles, 100)

  await sleep(10000)
  await driver.deleteSession()
}

runTest().catch((e) => log(e))
