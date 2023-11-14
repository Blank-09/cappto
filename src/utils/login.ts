// Login to the app

import { sleep } from '.'

async function login(driver: WebdriverIO.Browser, username: string, password: string) {
  await driver.touchAction({ action: 'tap', x: 641, y: 291 })
  await sleep(1000)

  let usernameField = await driver.$('//android.widget.EditText[@resource-id="form-value"]')

  await usernameField.setValue(username)
  await sleep(1000)

  let passwordField = await driver.$(
    '//android.view.View[@resource-id="root"]/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]/android.view.View[2]/android.widget.EditText'
  )

  await passwordField.setValue(password)
  await sleep(1000)

  let loginButton = await driver.$('//android.widget.TextView[@text="LOGIN"]')

  await loginButton.click()
}

export default login
