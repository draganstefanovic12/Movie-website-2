import {
  Button,
  ClickAwayListener,
  Container,
  Input,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AddFavoriteMedia } from "./AddFavoriteMedia";
import { MediaStringUndefined, NewListProps, List } from "../types/types";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";

export const NewList = ({ usr, setAdd, setLists }: NewListProps) => {
  const [desc, setDesc] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<any>([]);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  const addList = async () => {
    if (content.length > 0 && name.length > 3) {
      await axios.post(`http://localhost:5000/lists/new/${usr}`, {
        name: name,
        content: JSON.stringify(content),
        description: desc,
        username: usr,
      });
    } else {
      setError(
        "List can't be empty and list name must be longer than 5 characters."
      );
    }
  };

  const addListToProfile = async () => {
    if (content.length > 0 && name.length > 3) {
      await axios(`http://localhost:5000/user/newlist/${usr}`, {
        method: "POST",
        headers: {
          Authorization: `${user?.username} ${user?.token}`,
        },
        data: {
          name: name,
          content: JSON.stringify(content),
          description: desc,
        },
      });
    }
  };

  const handleFilter = (date: string) => {
    setContent(
      content.filter((list: MediaStringUndefined) => list.createdAt !== date)
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setAdd(false)}>
      <Container className="new-list-cont">
        <Typography>List name</Typography>
        <Input
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        <Typography>Description</Typography>
        <TextareaAutosize
          style={{ backgroundColor: "#14181c", color: "#cccccc" }}
          minRows={3}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Typography>List content</Typography>
        <AddFavoriteMedia setContent={setContent} />
        {content.map((media: MediaStringUndefined) => (
          <Container sx={{ display: "flex", gap: "1em" }}>
            <Typography>{media.title}</Typography>

            <DeleteIcon
              onClick={() => handleFilter(media.createdAt!)}
              className="svg"
            />
          </Container>
        ))}
        <Button
          sx={{ width: "10em", margin: "0 auto" }}
          onClick={() => {
            content.length > 0 && setAdd(false);
            addList();
            addListToProfile();
            setLists((currLists: List[]) => [
              { name: name, content: content, description: desc },
              ...currLists,
            ]);
          }}
        >
          Submit
        </Button>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
      </Container>
    </ClickAwayListener>
  );
};
