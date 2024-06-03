import "./App.css"

const App = () => {

  const mockData = {
    categorizedCards: {
      'uncategorized': [],
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center text-highlight font-body font-[500] leading-[24px] text-[16px]">
      <div
        className="w-screen h-screen fixed top-0 left-0 bg-gray-900/50 shadow-black shadow-xl"
      ></div>
      <div className="w-11/12 h-5/6 z-0 rounded-lg bg-primary flex flex-col">
        <header className="font-bold border-b border-tertiary px-4 p-2 flex flex-row">
          <h1 className="flex-1">Card Manager</h1>
          <button className="" onClick={() => logseq.hideMainUI()}>✖️ Close</button>
        </header>
        <div className="flex flex-1 flex-row">
          <aside className="flex-none flex flex-col gap-4 border-r border-tertiary bg-secondary p-4 w-72">
            <div>Cards: <span className="font-bold">650</span></div>
            <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">uncategorized</div>
            <div className="pt-2">Categories: 14</div>
            <div className="flex-1 flex flex-col gap-2 list-none">
              <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">$bjj (10)</div>
              <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">#money (3)</div>
              <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">#biology (12)</div>
            </div>
            <div className="flex flex-row border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">
              <div className="flex-1">New Category</div>
              <div>➕</div>
            </div>
            <div className="flex flex-row border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">
              <div className="flex-1">Settings</div>
              <div>⚙️</div>
            </div>
          </aside>
          <div className="flex-1 p-4">
            <h1 className="mb-4"><span className="font-bold">Uncategorized</span> (135) Cards</h1>
            <div className="flex flex-col gap-2 list-none">
              <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">What is the proper way to regulate health?</div>
              <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">What are the 3 core web vitals?</div>
              <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">What is the benefit of X?</div>
              <div className="border-2 border-transparent hover:border-highlight bg-buttonbg rounded-lg px-4 p-2">What is another card with a longer question length that will be truncated?</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 border-l border-tertiary bg-secondary p-4">
            <h1>Selected Card</h1>
            <div className="p-2 rounded-md bg-highlight/10 shadow-black/20 shadow-md">
              <div>
                <div>What are the 3 core web vitals? <span className="font-bold">#card</span></div>
                <div>some random text</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-tertiary px-4 p-2">
          <h2>Metadata</h2>
          <div>
            Current Env: {import.meta.env.VITE_MODE}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
