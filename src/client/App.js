import React from 'react';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      counter: 1
    }
  }
  render() {
    const { counter } = this.state
    return <div>{counter}
      <button onClick={() => { this.setState({ counter: counter + 1 }) }}>Click me</button>
    </div>
  }
}

export default App;
