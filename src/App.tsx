import AudioTranscriber from "./components/AudioTranscriber";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8">
        <AudioTranscriber />
      </div>
    </div>
  );
}

export default App;
