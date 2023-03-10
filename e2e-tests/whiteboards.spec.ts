import { expect } from '@playwright/test'
import { test } from './fixtures'
import { modKey } from './utils'

test('enable whiteboards', async ({ page }) => {
  await expect(page.locator('.nav-header .whiteboard')).toBeHidden()
  await page.click('#head .toolbar-dots-btn')
  await page.click('#head .dropdown-wrapper >> text=Settings')
  await page.click('.settings-modal a[data-id=features]')
  await page.click('text=Whiteboards >> .. >> .ui__toggle')
  await page.waitForTimeout(1000)
  await page.keyboard.press('Escape')
  await expect(page.locator('.nav-header .whiteboard')).toBeVisible()
})

test('create new whiteboard', async ({ page }) => {
  await page.click('.nav-header .whiteboard')
  await page.click('#tl-create-whiteboard')
  await expect(page.locator('.logseq-tldraw')).toBeVisible()
})

test('can right click title to show context menu', async ({ page }) => {
  await page.click('.whiteboard-page-title', {
    button: 'right',
  })

  await expect(page.locator('#custom-context-menu')).toBeVisible()

  await page.keyboard.press('Escape')

  await expect(page.locator('#custom-context-menu')).toHaveCount(0)
})

test('newly created whiteboard should have a default title', async ({ page }) => {
  await expect(page.locator('.whiteboard-page-title .title')).toContainText(
    'Untitled'
  )
})

test('set whiteboard title', async ({ page }) => {
  const title = 'my-whiteboard'

  await page.click('.nav-header .whiteboard')
  await page.click('#tl-create-whiteboard')
  await page.click('.whiteboard-page-title')
  await page.fill('.whiteboard-page-title input', title)
  await page.keyboard.press('Enter')
  await expect(page.locator('.whiteboard-page-title .title')).toContainText(
    title
  )
})

test('update whiteboard title', async ({ page }) => {
  const title = 'my-whiteboard'

  await page.click('.whiteboard-page-title')
  await page.fill('.whiteboard-page-title input', title + '-2')
  await page.keyboard.press('Enter')

  // Updating non-default title should pop up a confirmation dialog
  await expect(page.locator('.ui__confirm-modal >> .headline')).toContainText(
    `Do you really want to change the page name to “${title}-2”?`
  )

  await page.click('.ui__confirm-modal button')
  await expect(page.locator('.whiteboard-page-title .title')).toContainText(
    title + '-2'
  )
})

test('draw a rectangle', async ({ page }) => {
  const canvas = await page.waitForSelector('.logseq-tldraw')
  const bounds = (await canvas.boundingBox())!

  await page.keyboard.press('r')

  await page.mouse.move(bounds.x + 5, bounds.y + 5)
  await page.mouse.down()

  await page.mouse.move(bounds.x + 50, bounds.y + 50 )
  await page.mouse.up()
  await page.keyboard.press('Escape')

  await expect(page.locator('.logseq-tldraw .tl-box-container')).toHaveCount(1)
})

test('clone the rectangle', async ({ page }) => {
  const canvas = await page.waitForSelector('.logseq-tldraw')
  const bounds = (await canvas.boundingBox())!

  await page.mouse.move(bounds.x + 20, bounds.y + 20)

  await page.keyboard.down('Alt')
  await page.mouse.down()

  await page.mouse.move(bounds.x + 100, bounds.y + 100, {steps: 10})
  await page.mouse.up()
  await page.keyboard.up('Alt')

  await expect(page.locator('.logseq-tldraw .tl-box-container')).toHaveCount(2)
})

test('connect rectangles with arrow connector', async ({ page }) => {
  const canvas = await page.waitForSelector('.logseq-tldraw')
  const bounds = (await canvas.boundingBox())!

  await page.keyboard.press('c')

  await page.mouse.move(bounds.x + 20, bounds.y + 20)
  await page.mouse.down()

  await page.mouse.move(bounds.x + 100, bounds.y + 100, {steps: 10})
  await page.mouse.up()
  await page.keyboard.press('Escape')

  await page.waitForTimeout(1000)

  await expect(page.locator('.logseq-tldraw .tl-line-container')).toHaveCount(1)
})

test('delete the first rectangle', async ({ page }) => {
  const canvas = await page.waitForSelector('.logseq-tldraw')
  const bounds = (await canvas.boundingBox())!

  await page.mouse.click(bounds.x + 20, bounds.y + 20)
  await page.keyboard.press('Delete')

  await expect(page.locator('.logseq-tldraw .tl-box-container')).toHaveCount(1)
  await expect(page.locator('.logseq-tldraw .tl-line-container')).toHaveCount(0)
})

test('copy/paste url to create an iFrame shape', async ({ page }) => {
  const canvas = await page.waitForSelector('.logseq-tldraw')
  const bounds = (await canvas.boundingBox())!

  await page.keyboard.press('t')
  await page.mouse.move(bounds.x + 5, bounds.y + 5)
  await page.mouse.down()
  await page.waitForTimeout(100)

  await page.keyboard.type('https://logseq.com')
  await page.keyboard.press(modKey + '+a')
  await page.keyboard.press(modKey + '+c')
  await page.keyboard.press('Escape')

  await page.keyboard.press(modKey + '+v')

  await expect( page.locator('.logseq-tldraw .tl-iframe-container')).toHaveCount(1)
})

test('copy/paste twitter status url to create a Tweet shape', async ({ page }) => {
  const canvas = await page.waitForSelector('.logseq-tldraw')
  const bounds = (await canvas.boundingBox())!

  await page.keyboard.press('t')
  await page.mouse.move(bounds.x + 5, bounds.y + 5)
  await page.mouse.down()
  await page.waitForTimeout(100)

  await page.keyboard.type('https://twitter.com/logseq/status/1605224589046386689')
  await page.keyboard.press(modKey + '+a')
  await page.keyboard.press(modKey + '+c')
  await page.keyboard.press('Escape')

  await page.keyboard.press(modKey + '+v')

  await expect( page.locator('.logseq-tldraw .tl-tweet-container')).toHaveCount(1)
})

test('copy/paste youtube video url to create a Youtube shape', async ({ page }) => {
  const canvas = await page.waitForSelector('.logseq-tldraw')
  const bounds = (await canvas.boundingBox())!

  await page.keyboard.press('t')
  await page.mouse.move(bounds.x + 5, bounds.y + 5)
  await page.mouse.down()
  await page.waitForTimeout(100)

  await page.keyboard.type('https://www.youtube.com/watch?v=hz2BacySDXE')
  await page.keyboard.press(modKey + '+a')
  await page.keyboard.press(modKey + '+c')
  await page.keyboard.press('Escape')

  await page.keyboard.press(modKey + '+v')

  await expect(page.locator('.logseq-tldraw .tl-youtube-container')).toHaveCount(1)
})

test('cleanup the shapes', async ({ page }) => {
  await page.keyboard.press(`${modKey}+a`)
  await page.keyboard.press('Delete')
  await expect(page.locator('[data-type=Shape]')).toHaveCount(0)
})

test('zoom in', async ({ page }) => {
  await page.keyboard.press('Shift+0') // reset zoom
  await page.waitForTimeout(1500) // wait for the zoom animation to finish
  await page.click('#tl-zoom-in')
  await expect(page.locator('#tl-zoom')).toContainText('125%')
})

test('zoom out', async ({ page }) => {
  await page.keyboard.press('Shift+0')
  await page.waitForTimeout(1500)
  await page.click('#tl-zoom-out')
  await expect(page.locator('#tl-zoom')).toContainText('80%')
})

test('open context menu', async ({ page }) => {
  await page.locator('.logseq-tldraw').click({ button: 'right' })
  await expect(page.locator('.tl-context-menu')).toBeVisible()
})

test('close context menu on esc', async ({ page }) => {
  await page.keyboard.press('Escape')
  await expect(page.locator('.tl-context-menu')).toBeHidden()
})

test('quick add another whiteboard', async ({ page }) => {
  // create a new board first
  await page.click('.nav-header .whiteboard')
  await page.click('#tl-create-whiteboard')

  await page.click('.whiteboard-page-title')
  await page.fill('.whiteboard-page-title input', 'my-whiteboard-3')
  await page.keyboard.press('Enter')

  const canvas = await page.waitForSelector('.logseq-tldraw')
  await canvas.dblclick({
    position: {
      x: 100,
      y: 100,
    },
  })

  const quickAdd$ = page.locator('.tl-quick-search')
  await expect(quickAdd$).toBeVisible()

  await page.fill('.tl-quick-search input', 'my-whiteboard')
  await quickAdd$
    .locator('.tl-quick-search-option >> text=my-whiteboard-2')
    .first()
    .click()

  await expect(quickAdd$).toBeHidden()
  await expect(
    page.locator('.tl-logseq-portal-container >> text=my-whiteboard-2')
  ).toBeVisible()
})

test('go to another board and check reference', async ({ page }) => {
  await page
    .locator('.tl-logseq-portal-container >> text=my-whiteboard-2')
    .click()
  await expect(page.locator('.whiteboard-page-title .title')).toContainText(
    'my-whiteboard-2'
  )

  const pageRefCount$ = page.locator('.whiteboard-page-refs-count')
  await expect(pageRefCount$.locator('.open-page-ref-link')).toContainText('1')
})
