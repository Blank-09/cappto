import type { RemoteOptions } from 'webdriverio'

export const capabilities: WebdriverIO.Capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.DEVICE_NAME,
  'appium:appPackage': process.env.APP_PACKAGE,
  // @ts-ignore
  'appium:appActivity': process.env.APP_ACTIVITY,
  'appium:appWaitActivity': process.env.APP_ACTIVITY,
  'appium:udid': process.env.DEVICE_UDID
}

export const wdOptions: RemoteOptions = {
  hostname: process.env.APPIUM_HOST ?? '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT ?? '4723'),
  logLevel: 'info',
  capabilities
}
