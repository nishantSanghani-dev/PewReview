import { RouterProvider } from 'react-router-dom';
import './App.css';
import { routes } from './routes/app.routes';
import { ToastContainer } from 'react-toastify';

import LoaderProvider from './context/LoaderProvider';
import AppProvider from './context/AppProvider';

function App() {
  return (
    <>
      <AppProvider>
        <LoaderProvider>
          <ToastContainer />
          <RouterProvider router={routes} />
        </LoaderProvider>
      </AppProvider>
    </>
  );
}

export default App;
