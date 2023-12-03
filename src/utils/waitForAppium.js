const delayMilliseconds = 1000

async function waitForAppium() {
  let maxRetries = 30

  async function checkStatus() {
    try {
      const response = await fetch('http://127.0.0.1:4723/status')
      if (response.ok) {
        console.log('Appium server is ready.')
        return
      }
    } catch (error) {
      // Ignore errors and continue the loop
    }

    if (maxRetries > 0) {
      maxRetries--
      setTimeout(checkStatus, delayMilliseconds)
    } else {
      console.error('Appium server did not become ready within the specified time.')
      process.exit(1)
    }
  }

  await checkStatus()
}

waitForAppium()
