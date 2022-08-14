import "./styles/App.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Nav } from "./components/Nav";
import { Search } from "./pages/Search";
import { MediaPage } from "./pages/MediaPage";
import { Login } from "./pages/Login";
import { Homepage } from "./pages/Homepage";
import { createTheme, ThemeProvider } from "@mui/material";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { PageList } from "./pages/List";
import { MyAccount } from "./pages/MyAccount";
import { Person } from "./pages/Person";

const App = () => {
  const { user } = useAuth();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <HashRouter basename="/">
      <ThemeProvider theme={darkTheme}>
        <Nav />
        <Routes>
          <Route path="/list/:name" element={<PageList />}></Route>
          <Route
            path="/"
            element={user ? <Homepage /> : <Navigate to="/login" />}
          ></Route>
          <Route path="/person/:id/" element={<Person />}></Route>
          <Route path="/user/:user" element={<Profile />}></Route>
          <Route path="/search/:query/:type" element={<Search />}></Route>
          <Route path="/:type/:id/" element={<MediaPage />}></Route>
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          ></Route>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          ></Route>
          <Route path="/account/" element={<MyAccount />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
