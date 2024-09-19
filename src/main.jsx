import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from '@/lib/store.jsx';
import { I18nextProvider } from 'react-i18next'
import {i18nextMenu} from './Theme01/translation/i18trnas.js'
import MenuProvider from './providers/MenuProvider.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <Provider store={store}>
          <MenuProvider>
                  <App />
          </MenuProvider>
        </Provider>
  </React.StrictMode>
)
