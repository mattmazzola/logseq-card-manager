import '@logseq/libs'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

const isDevelopment = import.meta.env.DEV

if (isDevelopment) {
  fetchCards()
  renderApp('browser')

  logseq.ready(() => {
    console.log('logseq.ready()')
  })
} else {
  console.log('=== logseq-card-manager loaded ===')
  logseq.ready(() => {

    logseq.provideModel({
      show() {
        console.group('logseq-card-manager')
        console.log('show')
        fetchCards()
        renderApp('logseq')
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

  console.log({ queryBlocksCount: queryBlocks.length, queryBlocks })
  const cardBlocks = queryBlocks.filter(block => block.content?.includes('#card') ?? false)

  console.log({ cardBlocksCount: cardBlocks.length, cardBlocks })
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

  const blocksWithNonCardProperties: any[] = []
  for (const parsedBlock of cardsWithParsedContent) {
    const normalizedProperties = parsedBlock.parsedContent.map(x => x.replace('#', ''))
    const nonCardProperties = normalizedProperties.filter(p => !p.startsWith('card'))
    const hasNonCardProperty = nonCardProperties.length > 0
    const newBlock = {
      ...parsedBlock,
      nonCardProperties
    }
    blocksWithNonCardProperties.push(newBlock)
  }

  console.log({ blocksWithNonCardProperties })
  const categoryToBlocksMap = new Map()
  for (const block of blocksWithNonCardProperties) {
    for (const nonCardProperty of block.nonCardProperties) {
      const existingBlocks = categoryToBlocksMap.get(nonCardProperty) ?? []
      existingBlocks.push(block)
      categoryToBlocksMap.set(nonCardProperty, existingBlocks)
    }
  }

  console.log({ categoryToBlocksMap })

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

function renderApp(env: string) {
  ReactDOM.render(
    <React.StrictMode>
      <App env={env} />
    </React.StrictMode>,
    document.getElementById('root')
  )
}
