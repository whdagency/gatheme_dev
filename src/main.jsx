import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from '@/lib/store.jsx';
// import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import {i18nextMenu} from './Theme01/translation/i18trnas.js'
import MenuProvider from './providers/MenuProvider.jsx'

// import global_es from "./translation/es/global.json"
// import global_ar from "./translation/ar/global.json"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <I18nextProvider i18n={i18nextMenu}> */}
    <MenuProvider>
        <Provider store={store}>
             <App />
        </Provider>
    </MenuProvider>
    {/* </I18nextProvider> */}
  </React.StrictMode>
)
