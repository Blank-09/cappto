async function automateVideo(driver: WebdriverIO.Browser) {
  let el2 = await driver.$('//android.widget.Image[@text="menuImage"]')
  await el2.click()
  let el3 = await driver.$('~Video')
  await el3.click()
}

export default automateVideo
