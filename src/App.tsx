import "./App.css"

const App = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center text-white">
      <div
        className="w-screen h-screen fixed top-0 left-0 bg-blue-900/30"
        onClick={() => logseq.hideMainUI()}
      ></div>
      <div className="w-5/6 h-5/6 z-0 bg-gradient-to-tr from-blue-800 via-green-800 to-blue-900 flex flex-col items-center justify-center">
        <h1 className="font-bold text-4xl">logseq-card-manager</h1>
        <h2 className="text-2xl mt-6">
          Current Env: {import.meta.env.VITE_MODE}
        </h2>
      </div>
    </div>
  )
}

export default App
