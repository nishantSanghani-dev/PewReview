/* eslint-disable react-hooks/globals */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';
import Loader from '../components/common/loader/Loader';

export const loaderContext = createContext();

let setGlobalLoaderState = () => {};

export const setGlobalLoader = (value) => {
  setGlobalLoaderState(Boolean(value));
};

export default function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  setGlobalLoaderState = setLoading;

  return (
    <loaderContext.Provider>
      {loading && <Loader />}
      {children}
    </loaderContext.Provider>
  );
}
