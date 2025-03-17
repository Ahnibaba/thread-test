import { Button, Container } from "@chakra-ui/react";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import useAuth from "../store/useAuth";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";


const App = () => {
  const { loggedInUser } = useAuth()



  return (
    <Container maxW="620px">
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
      </Routes>

      

    </Container>

  );
};

export default App;
