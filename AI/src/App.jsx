import AIInterface from './components/AIInterface'
import ASCIIText from './components/ASCIIText'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="ascii-title-container">
        <ASCIIText 
          text="LAB AI" 
          asciiFontSize={7}
          textFontSize={500}
          textColor="#ff7700"
          planeBaseHeight={8}
          enableWaves={true}
        />
      </div>
      <AIInterface />
    </div>
  )
}

export default App
