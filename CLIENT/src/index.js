import React from 'react';
import ReactDOM, {  } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './Redux/Auth/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistedStore } from './Redux/Auth/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
// const root = createRoot(container)

// let persistor = persistStore(store)



root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
      <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

