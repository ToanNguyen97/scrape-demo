import type { NextRequest } from 'next/server'
import chromiumBrowser from '@sparticuz/chromium'
import { errorResponse, successResponse } from '../responseHandler'
import { chromium } from 'playwright'
// import path from 'path';

export const maxDuration = 300

interface ScrapePayload {
  url: string
}

const sleep = (ms: number) => {
  return new Promise(res => setTimeout(res, ms))
}

async function getBrowser() {
  console.log('process.env.DEV_MODE', process.env.DEV_MODE);
  if (process.env.DEV_MODE !== 'local') {

    const executablePath = await chromiumBrowser.executablePath(
      'https://pic.origapp.com/chromium-v123.0.1-pack.tar'
    )
    const browser = await chromium.launch({
      args: chromiumBrowser.args,
      executablePath,
      headless: true,
    })
    return browser
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  return browser
}

export const POST = async (request: NextRequest) => {
  try {
    const params: ScrapePayload = await request.json()
    const url = params.url
    const browser = await getBrowser()
    const context = await browser.newContext({
      proxy: {
        server: 'brd.superproxy.io:33335',
        username: 'brd-customer-hl_3a75de09-zone-data_center',
        password: 'y80~#eg!f-9%'
      },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    })
    const page = await context.newPage()

    await page.goto(
      `${params.url}`,
      { waitUntil: 'load', timeout: 30000 }
    )
    // const signUp = async () => {
    //   await page.waitForSelector('button[data-automation-id="utilityButtonSignIn"]');
    //   await page.click('button[data-automation-id="utilityButtonSignIn"]');
    //   await sleep(2000)
    //   await page.waitForSelector('button[data-automation-id="createAccountLink"]');
    //   await page.click('button[data-automation-id="createAccountLink"]');
    //   await sleep(2000)
    //   await page.waitForSelector('input[data-automation-id="email"]');
    //   await page.fill('input[data-automation-id="email"]', 'toannguyen21097@gmail.com');
    //   await sleep(2000)
    //   await page.waitForSelector('input[data-automation-id="password"]');
    //   await page.fill('input[data-automation-id="password"]', 'Toan123456!');
    //   await sleep(2000)
    //   await page.waitForSelector('input[data-automation-id="verifyPassword"]');
    //   await page.fill('input[data-automation-id="verifyPassword"]', 'Toan123456!');
    //   await sleep(2000)
    //   const submitButton = await page.locator('button[data-automation-id="createAccountSubmitButton"]');
    //   await submitButton.scrollIntoViewIfNeeded();
    //   await submitButton.click({force: true});
    // }

    const signIn = async () => {
      await page.waitForSelector('button[data-automation-id="utilityButtonSignIn"]');
      await page.click('button[data-automation-id="utilityButtonSignIn"]');
      await sleep(2000)

      await page.waitForSelector('input[data-automation-id="email"]');
      await page.fill('input[data-automation-id="email"]', 'toannguyen21097@gmail.com');
      await sleep(2000)

      await page.waitForSelector('input[data-automation-id="password"]');
      await page.fill('input[data-automation-id="password"]', 'Toan123456!');
      await sleep(2000)

      const submitButton = await page.locator('button[data-automation-id="signInSubmitButton"]');
      await submitButton.scrollIntoViewIfNeeded();
      await submitButton.click({force: true});
    }

    const handleClickApply = async () => {
      await page.waitForSelector('a[data-automation-id="adventureButton"]');
      await page.click('a[data-automation-id="adventureButton"]');
      await sleep(1000)
      await page.waitForSelector('a[data-automation-id="applyManually"]');
      await page.click('a[data-automation-id="applyManually"]');
    }

    const handleInformationTab = async () => {
      // ref
      await page.waitForSelector('#input-1');
      await page.click('#input-1')
      if (url.includes('drivetime.wd1.myworkdayjobs.com')) {
        await page.waitForSelector('[data-automation-label="Social Media"]');
        await page.click('[data-automation-label="Social Media"]');
        await page.waitForSelector('div[data-automation-label="Instagram"]');
        await page.click('div[data-automation-label="Instagram"]');
      } else {
        await page.waitForSelector('div[data-automation-label="Job Sites"]');
        await page.click('div[data-automation-label="Job Sites"]');
        await page.waitForSelector('div[data-automation-label="LinkedIn"]');
        await page.click('div[data-automation-label="LinkedIn"]');
      }

      // arlo check
      const previousWorker = await page.locator('div[data-automation-id="previousWorker"]').count();

      if (previousWorker) {
        await page.click('input[data-uxi-element-id="radio_2"]');
      }

      // country
      await page.waitForSelector('button[data-automation-id="countryDropdown"]');
      await page.click('button[data-automation-id="countryDropdown"]');
      await page.waitForSelector('li[data-value="db69e8c8446c11de98360015c5e6daf6"]');
      await page.click('li[data-value="db69e8c8446c11de98360015c5e6daf6"]');

      // input name
      await page.fill('[data-automation-id="legalNameSection_lastNameLocal"]', 'Toan');
      await page.fill('[data-automation-id="legalNameSection_firstNameLocal"]', 'Nguyen Van');
      await page.fill('[data-automation-id="legalNameSection_lastName"]', 'June');
      await page.fill('[data-automation-id="legalNameSection_firstName"]', 'Nguyen');

      // address
      await page.waitForSelector('button[data-automation-id="addressSection_countryRegion"]');
      await page.click('button[data-automation-id="addressSection_countryRegion"]');
      await page.waitForSelector('li[data-value="5c92f80d1be246fa93acd76b12a540b7"]');
      await page.click('li[data-value="5c92f80d1be246fa93acd76b12a540b7"]');
      await page.fill('[data-automation-id="addressSection_city"]', 'Nha Trang City');
      await page.fill('[data-automation-id="addressSection_postalCode"]', '650000');
      await page.fill('[data-automation-id="addressSection_addressLine1"]', '02 Nguyen Dinh Chieu st');

      // phone
      await page.waitForSelector('button[data-automation-id="phone-device-type"]');
      await page.click('button[data-automation-id="phone-device-type"]');
      await sleep(1000)
      if (url.includes('drivetime.wd1.myworkdayjobs.com')) {
        await page.click('li[data-value="95b22ca12b3001147b9607896ff00000"]');
      } else {
        await page.click('li[data-value="2fb0b179b6741001f79840fe1d5b0000"]');
      }
      await sleep(1000)
      await page.fill('[data-automation-id="phone-number"]', '0348096333');
      // submit
      await page.waitForSelector('button[data-automation-id="bottom-navigation-next-button"]');
      console.log('click');

      await page.click('button[data-automation-id="bottom-navigation-next-button"]');
      console.log('click xong');
      await sleep(2000)
    }

    const handleExperienceTab = async () => {
      await page.waitForSelector('div[data-automation-id="workExperienceSection"]');
      await page.click('div[data-automation-id="workExperienceSection"] button[data-automation-id="Add"]');

      await page.fill('[data-automation-id="jobTitle"]', 'Senior FullStack Developer')
      await page.fill('[data-automation-id="company"]', 'Betamind')
      await page.click('input[data-automation-id="currentlyWorkHere"]')
      await page.fill('[data-automation-id="dateSectionMonth-input"]', '12')
      await page.fill('[data-automation-id="dateSectionYear-input"]', '2023')
      await page.fill('[data-automation-id="description"]', `I'm responsible for helping member resolve task and clear technical, setup auto deployment, setup server and release project.`)

      await page.click('div[data-automation-id="workExperienceSection"] button[data-automation-id="Add Another"]');
      await page.fill('div[data-automation-id="workExperience-2"] [data-automation-id="jobTitle"]', 'Senior FullStack Developer')
      await page.fill('div[data-automation-id="workExperience-2"] [data-automation-id="company"]', 'Denova')
      await sleep(2000)
      await page.fill('div[data-automation-id="workExperience-2"] div[data-automation-id="formField-startDate"] [data-automation-id="dateSectionMonth-input"]', '12')
      await page.fill('div[data-automation-id="workExperience-2"] div[data-automation-id="formField-startDate"] [data-automation-id="dateSectionYear-input"]', '2022')
      await sleep(2000)
      await page.fill('div[data-automation-id="workExperience-2"] div[data-automation-id="formField-endDate"] [data-automation-id="dateSectionMonth-input"]', '12')
      await page.fill('div[data-automation-id="workExperience-2"] div[data-automation-id="formField-endDate"] [data-automation-id="dateSectionYear-input"]', '2023')
      await sleep(2000)
      await page.fill('div[data-automation-id="workExperience-2"] [data-automation-id="description"]', `I'm responsible for helping member resolve task and clear technical, setup auto deployment, setup server and release project.`)

      // upload resume
      const tempFilePath = path.join(process.cwd(), 'public', 'NguyenVanToan.pdf');
      const fileInputSelector = '[data-automation-id="file-upload-input-ref"]';
      await page.setInputFiles(fileInputSelector, tempFilePath);
      await page.waitForSelector('div[data-automation-id="file-upload-successful"]');
      await sleep(1000)
      await page.click('button[data-automation-id="bottom-navigation-next-button"]');
    }

    const handleApplicationQuestion = async () => {
      await page.waitForSelector('div[data-automation-id="primaryQuestionnairePage"]');
      // desired start date
      if (url.includes('drivetime.wd1.myworkdayjobs.com')) {
        await page.click('button[data-automation-id="4831c1789a580101ff6244afd19d0001"]')
        await page.click('li[data-value="95b22ca12b3001147ba8c7bcef180002"]')
        await sleep(2000)
        await page.click('button[data-automation-id="4831c1789a580101ff62454aff8e0002"]')
        await page.click('li[data-value="95b22ca12b3001147ba8bcd97fb10000"]')
        await sleep(2000)
        await page.click('button[data-automation-id="4831c1789a580101ff62454aff8e0005"]')
        await page.click('li[data-value="95b22ca12b3001147ba8d5a63ae40002"]')
        await sleep(2000)
        await page.click('button[data-automation-id="4831c1789a580101ff62454aff8e0008"]')
        await page.click('li[data-value="95b22ca12b3001147ba8e9213ff60000"]')
        await sleep(2000)
        await page.click('button[data-automation-id="4831c1789a58010204e95954a3290000"]')
        await page.click('li[data-value="4831c1789a58010200628e080d190000"]')
        await sleep(2000)
        await page.click('button[data-automation-id="4831c1789a58010204e959eeb33b0003"]')
        await page.click('li[data-value="4831c1789a58010200628ea1daa50000"]')
      } else {
        await page.fill('[data-automation-id="31fecac5cc9b1007d723ee57c9650000"]', '15 days after I get the offer');
        await page.fill('[data-automation-id="31fecac5cc9b1007d723ee57c9650001"]', '15 days');
        await page.click('button[data-automation-id="31fecac5cc9b1007d723eef1624d0000"]')
        await page.click('li[data-value="31fecac5cc9b1007d7003dc63d8c0000"]')
        await sleep(2000)
        await page.click('button[data-automation-id="31fecac5cc9b1007d7c3d685adbc0000"]')
        await page.click('li[data-value="31fecac5cc9b1007d77ebb6663a80001"]')
        await sleep(2000)
        await page.click('button[data-automation-id="31fecac5cc9b1007d723eef1624d0001"]')
        await page.click('li[data-value="31fecac5cc9b1007d7211f1754ec0000"]')
      }
      await sleep(1000)
      await page.click('button[data-automation-id="bottom-navigation-next-button"]');
    }

    const handleVoluntaryDisclosures = async () => {
      await page.waitForSelector('div[data-automation-id="voluntaryDisclosuresPage"]');
      if (url.includes('drivetime.wd1.myworkdayjobs.com')) {
        await page.click('button[data-automation-id="gender"]')
        await page.click('li[data-value="95b22ca12b3001147b97b799876f0000"]') // male
        await sleep(2000)
        await page.click('button[data-automation-id="ethnicityDropdown"]')
        await page.click('li[data-value="95b22ca12b3001147beda66edba00000"]') // asian
        await sleep(2000)
        await page.click('button[data-automation-id="hispanicOrLatino"]')
        await page.click('li[data-value="2"]') // no
        await sleep(2000)
        await page.click('button[data-automation-id="veteranStatus"]')
        await page.click('li[data-value="95b22ca12b3001147ba0f93759920000"]') // no
      }
      const checkAgree = page.locator('div[data-automation-id="formField-formField-agreementCheckbox"] label')
      await checkAgree.scrollIntoViewIfNeeded();
      await checkAgree.click({force: true})
      await sleep(2000)
      await page.click('button[data-automation-id="bottom-navigation-next-button"]');
      await sleep(1000)
    }

    const handleSelfIdentity = async () => {
      const isExisted = await page.locator('div[data-automation-id="previousWorker"]').count();
      if (isExisted) {
        if (url.includes('drivetime.wd1.myworkdayjobs.com')) {
          await page.fill('input[data-automation-id="name"]', 'June')
          const date = new Date()
          await page.fill('input[data-automation-id="dateSectionMonth-input"]', date.getMonth() + 1 > 9 ? String(date.getMonth() + 1) : `0${date.getMonth() + 1}`)
          await sleep(1000)
          await page.fill('input[data-automation-id="dateSectionDay-input"]', date.getDate() > 9 ? String(date.getDate()) : `0${date.getDate()}`)
          await sleep(1000)
          await page.fill('input[data-automation-id="dateSectionYear-input"]', date.getFullYear().toString())
          await sleep(1000)
          await page.waitForSelector('div[data-automation-id="formField-disability"]');
          await page.click('input[id="64cbff5f364f10000aeec521b4ec0000"]')
          await sleep(1000)
        }
        await page.click('button[data-automation-id="bottom-navigation-next-button"]');
      }
    }
    const handleReviewPage = async () => {
      await page.waitForSelector('div[data-automation-id="reviewJobApplicationPage"]');
      await page.click('button[data-automation-id="bottom-navigation-next-button"]');
      await page.waitForSelector('div[data-automation-id="candidateHomeTaskModal"]')
      await sleep(1000)
    }


    await signIn()
    console.log('=======Logged=====');
    await handleClickApply()
    console.log('=======Start Apply=====');
    await handleInformationTab()
    console.log('=======Complete Information Tab=====');
    await handleExperienceTab()
    console.log('=======Complete Experience Tab=====');
    await handleApplicationQuestion()
    console.log('=======Complete Application Question Tab=====');
    await handleVoluntaryDisclosures()
    console.log('=======Complete VoluntaryDisclosures Tab=====');
    await handleSelfIdentity()
    console.log('=======Complete Self Identity Tab=====');
    await handleReviewPage()
    console.log('=======Complete Apply Job=====');
    await browser.close()
    return successResponse('success')
  } catch (error) {
    return errorResponse(String(error), 400)
  }
}
