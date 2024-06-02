import "@logseq/libs"
import React from "react"
import proxyLogseq from "logseq-proxy"
import { type Root, createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

if (import.meta.env.VITE_MODE === "web") {
  // run in browser
  console.log(
    "[faiz:] === meta.env.VITE_LOGSEQ_API_SERVER",
    import.meta.env.VITE_LOGSEQ_API_SERVER
  )
  console.log(
    `%c[version]: v${__APP_VERSION__}`,
    "background-color: #60A5FA; color: white; padding: 4px;"
  )
  proxyLogseq({
    config: {
      apiServer: import.meta.env.VITE_LOGSEQ_API_SERVER,
      apiToken: import.meta.env.VITE_LOGSEQ_API_TOKEN,
    },
    settings: window.mockSettings,
  })

  console.group('logseq-card-manager')
  console.log('show')
  fetchCards()
  renderApp()
  console.groupEnd()
} else {
  console.log("=== logseq-plugin-react-boilerplate loaded ===")
  logseq.ready(() => {
    logseq.provideModel({
      show() {
        console.group('logseq-card-manager')
        console.log('show')
        fetchCards()
        renderApp()
        logseq.showMainUI()
        console.groupEnd()
      },
      hide() {
        console.group('logseq-card-manager')
        console.log('hide')
        logseq.hideMainUI()
        console.groupEnd()
      }
    })

    logseq.App.registerUIItem('toolbar', {
      key: 'logseq-card-manager',
      template: '<a data-on-click="show" class="button"><i class="ti ti-layout-list"></i></a>',
    })
  })
}

const CARD_CONTENT_REGEX = /#card|(card-[-\w]+)|#[-\w]+/g

async function fetchCards() {
  const query = '[[card]]'
  const queryBlocks = await logseq.DB.q(query)
  if (!(Array.isArray(queryBlocks) && queryBlocks.length > 0)) {
    console.warn('Query for cards did not return any blocks. Stopping processing.')
    return
  }

  console.log({ queryBlocks })
  const cardBlocks = queryBlocks.filter(block => ['#card', '[[card]]'].some(x => block.content?.includes(x)) ?? false)

  console.log({ cardBlocks })
  if (cardBlocks.length === 0) {
    console.warn('No card blocks found. Aborting fetch.')
    return
  }

  const cardsWithParsedContent = cardBlocks.map(block => {
    return {
      block,
      parsedContent: block.content.match(CARD_CONTENT_REGEX)
    }
  })
  console.log({ cardsWithParsedContent })

  const blocksWithNonCardProperties = cardsWithParsedContent.map(parsedBlock => {
    const normalizedProperties = parsedBlock.parsedContent.map(x => x.replace('#', '').replace('[', '').replace(']', ''))
    const nonCardProperties = normalizedProperties.filter(p => !p.startsWith('card'))
    const newBlock = {
      ...parsedBlock,
      nonCardProperties
    }

    return newBlock
  })

  console.log({ blocksWithNonCardProperties })

  
  const UNCATEGORIZED_CATEGORY_NAME = 'uncategorized'
  const categoryToBlocksMap = new Map()
  for (const block of blocksWithNonCardProperties) {
    if (block.nonCardProperties.length === 0) {
      console.debug('No non-card properties found. Adding to Uncategorized category.', { block })
      const categoryName = UNCATEGORIZED_CATEGORY_NAME
      let existingBlocks = categoryToBlocksMap.get(categoryName)
      if (!existingBlocks) {
        existingBlocks = []
        categoryToBlocksMap.set(categoryName, existingBlocks)
      }

      existingBlocks.push(block)
    }

    for (const nonCardProperty of block.nonCardProperties) {
      const categoryName = nonCardProperty
      let existingBlocks = categoryToBlocksMap.get(categoryName)
      if (!existingBlocks) {
        existingBlocks = []
        categoryToBlocksMap.set(categoryName, existingBlocks)
      }

      existingBlocks.push(block)
    }
  }

  console.log({ categoryToBlocksMap })
  const totalCategorizedBlocks = Array.from(categoryToBlocksMap.values()).reduce((acc, blocks) => acc + blocks.length, 0)
  console.log({ totalCategorizedBlocks })

  // // For each category, transform the value to object with the percentage of blocks in that category
  // const categoryToBlocksPercentageMap = new Map()
  // for (const [categoryName, categoryBlocks] of categoryToBlocksMap.entries()) {
  //   const percentage = categoryBlocks.length / blocksWithNonCardProperties.length
  //   categoryToBlocksPercentageMap.set(categoryName, {
  //     blocks: categoryBlocks,
  //     percentage
  //   })
  // }
  // console.log({ categoryToBlocksPercentageMap })

  // const nonCardProperties = cardBlocks.flatMap(block => Object.entries(block.properties ?? {}).filter(([key, value]) => !key.startsWith('card')))
  // console.log({ nonCardProperties })
  // const nonCardPropertiesMap = new Map(nonCardProperties)
  // console.log({ nonCardPropertiesSet: nonCardPropertiesMap.values() })

  // const firstCardBlock = cardBlocks.at(0)
  // console.log({ firstCardBlock })
  // console.log('Upsert Block Property.')
  // console.log('Block property upserted.')
  // console.log('Fetching block properties...')
  // const firstBlockProperties = await logseq.Editor.getBlockProperties(firstCardBlock.uuid)
  // console.log({ firstBlockProperties })
}

function renderApp() {
  const root = createRoot(document.getElementById("root")!)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
