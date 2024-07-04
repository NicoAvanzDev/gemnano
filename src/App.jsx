import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import "./App.css";

function App() {
  const [context, setContext] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    async function loadAI() {
      const canCreateContext = await window.ai?.canCreateGenericSession();

      if (canCreateContext && canCreateContext !== "no") {
        const context = await window.ai.createGenericSession();

        setContext(context);
      }
    }

    loadAI();
  }, []);

  const query = async () => {
    if (!context) {
      return;
    }

    setPrompt("");

    const response = context.promptStreaming(prompt);

    for await (const chunk of response) {
      setOutput(chunk);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      query();
      e.preventDefault();
    }
  };

  return (
    <>
      <div>
        <h1>Gemini Nano</h1>
        <div className="preview">
          <Markdown className="output">{output}</Markdown>
        </div>

        <div className="prompt-container">
          <textarea
            className="prompt"
            placeholder="Enter your text here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleEnter}
          ></textarea>

          <button
            type="submit"
            className="query"
            onClick={async () => await query()}
            disabled={context == null}
          >
            Prompt
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
