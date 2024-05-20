import '@logseq/libs'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

const isDevelopment = import.meta.env.DEV

if (isDevelopment) {
  renderApp('browser')
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
      template: '<a data-on-click="show" class="button"><i class="ti ti-window"></i></a>',
    })

  })
}

async function fetchCards() {
  const query = '[[card]]'
  const queryBlocks = await logseq.DB.q(query) ?? []
  console.log({ queryBlocksCount: queryBlocks.length, queryBlocks })
  const cardBlocks = queryBlocks.filter(block => block.content?.includes('#card') ?? false)
  console.log({ cardBlocksCount: cardBlocks.length, cardBlocks })
}

function renderApp(env: string) {
  ReactDOM.render(
    <React.StrictMode>
      <App env={env} />
    </React.StrictMode>,
    document.getElementById('root')
  )
}
