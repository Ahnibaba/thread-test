import { Box, Button, Container } from "@chakra-ui/react";
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import useAuth from "../store/useAuth";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";



const App = () => {
  const { loggedInUser } = useAuth()
  const { pathname } = useLocation()



  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={loggedInUser ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!loggedInUser ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/:username" element={loggedInUser ?
            (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          } />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route path="/update" element={loggedInUser ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
          <Route path="/chat" element={loggedInUser ? <ChatPage /> : <Navigate to="/auth" />} />
          <Route path="/settings" element={loggedInUser ? <SettingsPage /> : <Navigate to="/auth" />} />
        </Routes>



      </Container>
    </Box>

  );
};

export default App;
