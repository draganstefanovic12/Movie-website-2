import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NavPopper } from "./NavPopper";
import { usePopper } from "../hooks/usePopper";
import { ListItem, MenuList } from "@mui/material";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

interface NotificationProps {
  notifications: [];
}

interface Notification {
  content: string | undefined;
  createdAt: string | number | Date;
  user: string | undefined;
  read: boolean;
  _id: number;
}

export const NavNotifications = ({ notifications }: NotificationProps) => {
  const [read, setRead] = useState<boolean>(true);
  const { setOpen, open } = usePopper();
  const { userStats } = useAuth();

  const handleClick = async () => {
    setRead(true);
    await axios.post(
      `http://localhost:5000/user/notifications/${userStats?.data.user.username}`
    );
  };

  useEffect(() => {
    notifications.map(
      (notification: Notification) =>
        notification.read === false && read === true && setRead(false)
    );
  }, []);

  return (
    <NavPopper
      setOpen={setOpen}
      open={open}
      button={
        read ? (
          <NotificationsNoneOutlinedIcon className="notification-icon" />
        ) : (
          <NotificationsIcon
            onClick={handleClick}
            className="notification-icon"
          />
        )
      }
    >
      <MenuList className="menu-list">
        {notifications.length > 0 ? (
          notifications.slice(0, 10).map((notification: Notification) => (
            <ListItem key={notification._id} style={{ whiteSpace: "nowrap" }}>
              <Link
                style={{ marginRight: "0.2em", display: "" }}
                to={`/user/${notification.user}`}
                onClick={() => setOpen(false)}
              >
                {notification.user}{" "}
              </Link>{" "}
              {notification.content}{" "}
              <span style={{ marginLeft: "0.5em" }}>
                {formatDistanceToNow(new Date(notification.createdAt))} ago
              </span>
            </ListItem>
          ))
        ) : (
          <ListItem style={{ color: "white" }}>
            No new notifications...
          </ListItem>
        )}
      </MenuList>
    </NavPopper>
  );
};