import { Button, Container } from "@chakra-ui/react";
import React from "react";
import { useColorMode, useColorModeValue } from "./components/ui/color-mode";
import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";


const App = () => {
  const { toggleColorMode } = useColorMode();
  
  // Custom colors for button based on color mode
  const bg = useColorModeValue("gray.100", "#101010"); // Light: Gray | Dark: Blue Gray
  const color = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <Container maxW="620px">
      <Toaster />
      <Header />
       <Routes>
         <Route path="/" element={<HomePage />} />
         <Route path="/auth" element={<AuthPage />} />
         <Route path="/:username" element={<UserPage />} />
         <Route path="/:username/post/:pid" element={<PostPage />} />
       </Routes>
    </Container> 

  );
};

export default App;
