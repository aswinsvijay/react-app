import './App.css';
import React, { useState } from 'react';
import { variants } from './variants';

const App: React.FC<NonNullable<unknown>> = () => {
  const [variantIndex, setVariantIndex] = useState(0);

  const setNextVariantIndex = () => {
    setVariantIndex((cur) => (cur + 1) % variants.length);
  };

  return <></>;
};

export default App;
