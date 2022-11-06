import { Media } from "@/pages/MediaPage/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Container } from "@mui/system";
import { useParams } from "react-router-dom";
import { CardMedia, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import favBg from "@/assets/fav-movie-bg.png";
import backendApi, { updateFavorites } from "@/features/api/backendApi";
import DebouncedSearch from "@/components/DebouncedSearch";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";

export type FavoritesProps = {
  favorites: Media[] | undefined;
};

const ProfileFavorites = ({ favorites }: FavoritesProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>();
  const [favMedia, setFavMedia] = useState<Media[]>([]);
  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const updateMovies = () => {
      setFavMedia(favorites as Media[]);
    };
    updateMovies();
  }, [favorites, params]);

  const handleRemove = async (mov: string, date: string) => {
    setFavMedia(favMedia!.filter((media: Media) => media.createdAt !== date));
    await backendApi.delete(`/user/removefavorite/${params.user}`, {
      data: {
        content: mov,
      },
    });
  };

  const handleUpdateFavorites = async () => {
    setEdit(!edit);
    await updateFavorites(favMedia);
  };

  const handleEditing = () => {
    setEdit(true);
  };

  return (
    <Container
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      className="favorite-container"
    >
      <div className="fav-text-cont">
        <Typography className="favorite-movies" variant="h6">
          Favorites
        </Typography>
        {user?.username && user.username === params.user && hover && (
          <Typography
            variant="subtitle1"
            className="favorite-movies fav-edit"
            onClick={edit ? handleUpdateFavorites : handleEditing}
          >
            {edit ? "Finish editing" : "Edit"}
          </Typography>
        )}
      </div>
      <div className="favorite-container-card">
        {edit
          ? [...Array(6).keys()].map((i) => (
              <Fragment key={i}>
                <FavoriteCard
                  edit={edit}
                  handleRemove={handleRemove}
                  setFavMovies={setFavMedia}
                  media={favMedia[i] && favMedia[i]}
                />
              </Fragment>
            ))
          : favMedia &&
            favMedia.map((media: Media) => (
              <Fragment key={media.createdAt!}>
                <FavoriteCard edit={edit} handleRemove={handleRemove} media={media} />
              </Fragment>
            ))}
      </div>
    </Container>
  );
};

type FavoriteCardsProps = {
  media: Media;
  handleRemove: (mov: string, date: string) => Promise<void>;
  edit: boolean;
  setFavMovies?: React.Dispatch<React.SetStateAction<Media[]>>;
};

export const FavoriteCard = ({ media, handleRemove, edit, setFavMovies }: FavoriteCardsProps) => {
  const [input, setInput] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  const handleFavoriteMovies = (movie: Media) => {
    setFavMovies!((currMovies) => [...currMovies, movie]);
    setInput(false);
  };

  return (
    <>
      {edit ? (
        <div
          className="fav-edit-cont"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <>
            {hover && media && (
              <HighlightOffOutlinedIcon
                onClick={() => {
                  handleRemove(media!.title, media!.createdAt!);
                }}
                className="fav-remove-icon"
              />
            )}
            <CardMedia
              src={media ? `https://image.tmdb.org/t/p/w500/${media!.poster}` : favBg}
              className="fav-edit-card"
              component="img"
            />
            {!media && hover && (
              <ControlPointOutlinedIcon onClick={() => setInput(!input)} className="fav-add-icon" />
            )}
          </>
          {input && <DebouncedSearch handleClick={handleFavoriteMovies} />}
        </div>
      ) : (
        <a className="profile-fav-link" href={`/Cinema-log/#/${media!.type}/${media!.id}`}>
          <CardMedia
            component="img"
            height="350"
            className="profile-fav-img"
            src={`https://image.tmdb.org/t/p/w500/${media.poster}`}
          />
        </a>
      )}
    </>
  );
};

export default ProfileFavorites;