import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Container } from "@mui/system";
import { NavDropdown } from "./NavDropdown";
import { NavNotifications } from "./NavNotifications";
import { Link, useNavigate } from "react-router-dom";
import { Input, InputAdornment } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import MovieCreationRoundedIcon from "@mui/icons-material/MovieCreationRounded";

export const Nav = () => {
  const [hover, setHover] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const { user, userStats } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <Container className="nav-inner">
        <Link
          className="home-link"
          onMouseLeave={() => setHover(false)}
          onMouseEnter={() => setHover(true)}
          style={{ marginLeft: "1em" }}
          to="/"
        >
          {hover ? <MovieCreationRoundedIcon /> : <MovieCreationOutlinedIcon />}
        </Link>
        <div>
          {user && (
            <Container className="avatar-container">
              <Input
                sx={{
                  marginRight: "0.5em",
                  alignSelf: "  ",
                }}
                placeholder="Search..."
                startAdornment={
                  <InputAdornment position="start">
                    <SearchOutlinedIcon
                      onClick={() => navigate(`/search/${value}/multi`)}
                    />
                  </InputAdornment>
                }
                onChange={(e) => setValue(e.target.value)}
              />
              {userStats && (
                <NavNotifications
                  notifications={userStats?.data.user.notifications}
                />
              )}
              <NavDropdown />
            </Container>
          )}
        </div>
      </Container>
    </nav>
  );
};
