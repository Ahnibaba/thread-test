import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
)
