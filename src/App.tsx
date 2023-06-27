import React from 'react';
import logo from './logo.svg';
import './App.css';
import InfiniteScroll from './InfinityScroll';

function App() {
  return (
    <div className="App">
      <InfiniteScroll/>
    </div>
  );
}
// const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageRef.current}&_limit=10`);

export default App;
