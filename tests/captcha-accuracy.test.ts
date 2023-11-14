import fs from 'fs'
import path from 'path'

import { expect, it, describe, test } from 'vitest'
import { validateCaptcha } from './captcha'
import { copyCaptchaFiles } from './copy'

// import data from './data.json'

//
const TEST_DATA_FOLDER = path.join(__dirname, './data')

type CaptchaType = {
  img: string
  text: string
  receivedText: string
  isValid?: boolean
}

describe('Captcha validation', () => {
  // Copy captchas to ./tests/data
  // it('should copy captchas at ./tests/data', () => {
  //   const noOfFiles = copyCaptchaFiles(TEST_DATA_FOLDER)
  //   expect(fs.readdirSync(TEST_DATA_FOLDER).length).toBe(noOfFiles)
  // })

  it(
    'should create captchas.json',
    async () => {
      const captchas = fs.readdirSync(TEST_DATA_FOLDER)
      const data: Omit<CaptchaType, 'receivedText'>[] = []

      console.log(data)
      for (var i = 72; i < captchas.length; i++) {
        console.log(i)
        const text = await validateCaptcha(path.join(TEST_DATA_FOLDER, captchas[i]))
        data.push({ img: captchas[i], text: text })
      }

      console.log(data)
      fs.writeFileSync(path.join(__dirname, 'captchas.json'), JSON.stringify(data, null, 2))
      expect(true).toBe(true)
    },
    300 * 1000
  )

  // it(
  //   'should validate captchas',
  //   async () => {
  //     const captchasData: CaptchaType[] = []
  //     let count = 0

  //     for await (const captcha of data) {
  //       const text = await validateCaptcha(path.join(TEST_DATA_FOLDER, captcha.img))
  //       captchasData.push({ ...captcha, receivedText: text, isValid: text === captcha.text })

  //       if (text === captcha.text) {
  //         count++
  //       }
  //     }

  //     console.log(captchasData)
  //     console.log(`Accuracy: ${count}/${captchasData.length}`)
  //     expect(data.length).toBe(captchasData.length)
  //   },
  //   120 * 1000
  // )
})
