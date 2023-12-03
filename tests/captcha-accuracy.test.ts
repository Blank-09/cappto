import fs from 'fs'
import path from 'path'

import { expect, it, describe, afterAll } from 'vitest'
import { validateCaptcha, waitUntilReady } from '../src/utils/captcha/captcha-sharp'

import captchaData from './data.json'

//
const TEST_DATA_FOLDER = path.join(__dirname, 'data')
const TEST_OUTPUT_FOLDER = path.join(__dirname, 'output')

type CaptchaType = {
  img: string
  text: string
  receivedText: string
  isValid?: boolean
}

describe('Captcha validation', async () => {
  await waitUntilReady()

  // var i = 0
  for (const captcha of captchaData) {
    // i++
    // if (i > 10) break
    it(`should validate ${captcha.img}`, async () => {
      const text = await validateCaptcha(path.join(TEST_DATA_FOLDER, captcha.img), TEST_OUTPUT_FOLDER)
      expect(text).toBe(captcha.text)
    })
  }

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

// it(
//   'should create captchas.json',
//   async () => {
//     const captchas = fs.readdirSync(TEST_DATA_FOLDER)
//     const data: Omit<CaptchaType, 'receivedText'>[] = []

//     for (var i = 138; i < captchas.length; i++) {
//       console.log(i)
//       const text = await validateCaptcha(path.join(TEST_DATA_FOLDER, captchas[i]))
//       data.push({ img: captchas[i], text: text })
//     }

//     console.log(data)
//     fs.writeFileSync(path.join(__dirname, 'captchas.json'), JSON.stringify(data, null, 2))
//     expect(true).toBe(true)
//   },
//   300 * 1000
// )
