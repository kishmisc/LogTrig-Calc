import { useState } from 'react';
import { evaluate, derivative, parse } from 'mathjs';
import './App.css';

function App() {
  const [val, setVal] = useState("");
  const [base, setBase] = useState("10");
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState("");

  const calculate = (type) => {
    // 1. Safeguard: Do nothing if the input is empty
    if (!val.trim()) {
      setResult("Enter a value");
      return;
    }

    try {
      let res;
      
      // 2. Upgraded logic to handle complex expressions before doing the math
      if (type === 'eval') res = evaluate(val);
      else if (type === 'log') {
        const x = evaluate(val); // Evaluates whatever is in the box first
        const b = parseFloat(base);
        res = Math.log(x) / Math.log(b);
      }
      else if (type === 'sin') res = evaluate(`sin(${val})`);
      else if (type === 'cos') res = evaluate(`cos(${val})`);
      else if (type === 'tan') res = evaluate(`tan(${val})`);
      else if (type === 'diff') res = derivative(val, 'x').toString();
      else if (type === 'int') res = parse(val).integrate('x').toString();
      
      // 3. Catch lingering weird math outputs (like dividing by zero)
      if (Number.isNaN(res) || res === Infinity) {
        throw new Error("Math Error");
      }

      // 4. Clean up long decimals for numeric answers
      const resStr = typeof res === 'number' ? parseFloat(res.toFixed(4)).toString() : res.toString();
      
      setResult(resStr);
      setHistory([`${val} = ${resStr}`, ...history.slice(0, 3)]);
    } catch (e) {
      setResult("Error: Check Syntax");
    }
  };

  return (
    <div className="container">
      <div className="calculator">
        
        {/* The Digital Screen */}
        <div className="display-screen">
          <input 
            type="text" 
            className="main-input" 
            value={val} 
            onChange={(e) => setVal(e.target.value)} 
            placeholder="Expression (e.g. x^2)" 
          />
          <div className="base-input-container">
            <span>Log Base:</span>
            <input 
              type="number" 
              className="base-input" 
              value={base} 
              onChange={(e) => setBase(e.target.value)} 
            />
          </div>
          <div className="result-output">= {result || "0"}</div>
        </div>

        {/* The Keypad */}
        <div className="keypad">
          <button className="btn-action" onClick={() => calculate('eval')}>=</button>
          <button className="btn-math" onClick={() => calculate('log')}>Log<sub>b</sub></button>
          <button className="btn-math" onClick={() => calculate('sin')}>sin</button>
          <button className="btn-math" onClick={() => calculate('cos')}>cos</button>
          <button className="btn-math" onClick={() => calculate('tan')}>tan</button>
          <button className="btn-math" onClick={() => calculate('diff')}>d/dx</button>
          <button className="btn-math" onClick={() => calculate('int')}>∫dx</button>
          <button className="btn-clear" onClick={() => { setVal(""); setResult(""); }}>Clear</button>
        </div>

        {/* The History Tape */}
        <div className="history-tape">
          <div className="history-header">Recent</div>
          {history.map((h, i) => <div className="history-item" key={i}>{h}</div>)}
        </div>

      </div>
    </div>
  );
}

export default App;