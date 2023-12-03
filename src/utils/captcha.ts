// import { getCaptcha } from '../tools/text-recognizer'

import { sleep } from '.'

//
async function fillCaptcha(driver: WebdriverIO.Browser, captcha: string) {
  let captchaTextField = await driver.$('android.widget.EditText')

  await captchaTextField.setValue(captcha)
  await sleep(3000 + Math.random() * 3000)

  let submitButton = await driver.$('//android.widget.Button[@text="SUBMIT"]')
  await submitButton.click()
}

async function openVideo(driver: WebdriverIO.Browser) {
  const videoItem = await driver.$('~Video')
  const isVideoItemExists = await videoItem.isExisting()

  if (isVideoItemExists) {
    await videoItem.click()
    await sleep(15 * 1000)
  }
}

//

async function openAds(driver: WebdriverIO.Browser) {
  let adsMenuItem = await driver.$('~Advertisement')
  await adsMenuItem.click()
}

async function detectCaptcha(driver: WebdriverIO.Browser): Promise<Boolean> {
  return await driver.waitUntil(
    async () => {
      const captchaElement = await driver.$('//android.widget.TextView[@text="Captcha"]')

      if (!captchaElement) {
        console.log('Not Found! Trying again')
        return false
      }

      // console.log(await captchaElement.isDisplayed())
      console.log(await captchaElement.getText())
      console.log('Found')
      return true
    },
    {
      timeout: 300 * 1000, // 5 minutes
      interval: 5000, // check every 5 seconds
      timeoutMsg: 'Captcha not found'
    }
  )
}

export { openAds, openVideo, fillCaptcha, detectCaptcha }
