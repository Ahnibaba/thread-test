import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from './components/ui/provider'
import { Skeleton } from '@chakra-ui/react'

const AppWrapper = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Delay mounting App by 200ms to ensure proper color mode hydration
    const timeout = setTimeout(() => setIsClient(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return isClient ? <App /> : <Skeleton height="100vh" fadeDuration={0.3} startColor="gray.dark" endColor="gray.700" />
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <Provider>
           <AppWrapper />
        </Provider>
      </BrowserRouter>
  </StrictMode>,
)
