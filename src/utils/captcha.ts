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

//

async function openAds(driver: WebdriverIO.Browser) {
  let menubar = await driver.$('//android.widget.Image[@text="menuImage"]')

  await menubar.click()
  await sleep(1000)

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

export { openAds, fillCaptcha, detectCaptcha }
