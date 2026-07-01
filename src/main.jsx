import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import router from "./routes/app.routes.jsx";
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#19456d',
          color: '#fff',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '12px 16px',
        },
        success: {
          style: { background: '#1a5c3a', color: '#fff' },
          iconTheme: { primary: '#4ade80', secondary: '#fff' },
        },
        error: {
          style: { background: '#7f1d1d', color: '#fff' },
          iconTheme: { primary: '#f87171', secondary: '#fff' },
        },
        loading: {
          style: { background: '#19456d', color: '#fff' },
        },
      }}
    />
    <RouterProvider router={router} />
  </Provider>
)

