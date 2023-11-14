import path from 'path'

//
export const SCREENSHOT_FOLDER = //
  path.resolve(__dirname, 'screenshots')

export const SCREENSHOT_SCREEN_FOLDER = //
  path.join(SCREENSHOT_FOLDER, 'screen')

export const CAPTCHA_FOLDER = //
  path.join(SCREENSHOT_FOLDER, 'captcha')

export const CAPTCHA_TEST_FOLDER = //
  path.join(CAPTCHA_FOLDER, 'test')

export const CAPTCHA_VALID_FOLDER = //
  path.join(CAPTCHA_FOLDER, 'valid')

export const CAPTCHA_INVALID_FOLDER = //
  path.join(CAPTCHA_FOLDER, 'invalid')

console.log('Screenshot Folder:', [SCREENSHOT_FOLDER])
