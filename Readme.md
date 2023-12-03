# Cappto - Captcha Auto Solver

Cappto is a simple CLI tool to automatically fill captcha forms in Android app. It uses [Tesseract.js](https://www.npmjs.com/package/tesseract.js) to read the captcha image and [Appium](https://appium.io/) to interact with the Android device.

> ⚠ Note: It is still in development and the captcha accuracy is 50% - 60%.

## 🚀 Features

- Automatically fill captcha forms in Android app
- Captcha accuracy is 50% - 60%
- Easy to use

## ⭐ Prerequisites

- Node.js & NPM
- Java JDK (11.x.x or above)
- Android SDK

## 📦 Installation

- Clone this repository
- [Install Appium](https://appium.io/docs/en/2.1/quickstart/install/)
- [Install UiAutomator2 Driver](https://appium.io/docs/en/2.1/quickstart/uiauto2-driver/)
- Run `npm install`
- Rename `.env.example` to `.env`
- Fill the `.env` file with your credentials

## 🎨 Usage

- Connect your Android device to your computer
- Make sure to enable **USB debugging**
- Run `npm run dev`
- And it will automatically fill captchas for you

## 📝 How it works

Cappto uses [Tesseract.js](https://www.npmjs.com/package/tesseract.js) and [Sharp](https://www.npmjs.com/package/sharp) to read the captcha image and [Appium](https://appium.io/) to interact with the Android device.

## 🤝 Contribution

Contributions are welcome! Please share any features, and add unit tests! Use the pull request and issue systems to contribute.
