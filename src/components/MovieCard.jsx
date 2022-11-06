import React from "react";
import dayjs from "dayjs";

import { FiHeart } from "react-icons/fi";
import { MdMoreHoriz } from "react-icons/md";

import localizedFormat from "dayjs/plugin/localizedFormat";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToLocalFav } from "../store";
dayjs.extend(localizedFormat);

const IMG_PATH = "https://image.tmdb.org/t/p/";

export default function MovieCard({ movie }) {
  const dispatch = useDispatch();

  const authenticated = useSelector(
    (state) => state.aglet.authData.authenticated,
  );
  const token = useSelector((state) => state.aglet.authData.token);
  const handle_favourites = () => {
    if (!authenticated) {
      return alert("Please sign in first to add movies to favourites");
    }
    axios
      .post(
        "http://localhost:5000/api/add/favourite",
        {
          ...movie,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        console.log("success", res.data);
        dispatch(addToLocalFav({ post: movie }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!movie.poster_path) return null;

  return (
    <div className="movie-card mb-3">
      <div className="movie-rating">{movie.vote_average}</div>
      <div className="movie-image">
        <img
          src={`${IMG_PATH}/w500/${movie.poster_path}`}
          alt=""
          className="img-fluid"
        />
      </div>
      <div className="mt-2">
        <div className="movie-title">
          <span>{movie.title}</span>
        </div>
        <div className="mt-2 d-flex justify-content-between align-items-center">
          <span className="release-date">
            {movie?.release_date ? (
              <>
                {dayjs(new Date(movie.release_date).toISOString()).format("LL")}
              </>
            ) : null}
          </span>
          <div className="d-flex align-items-center">
            <button
              onClick={handle_favourites}
              className="movie-add-to-fav-btn mr-2"
            >
              <FiHeart />
            </button>
            <button
              onClick={handle_favourites}
              className="movie-add-to-fav-btn"
            >
              <MdMoreHoriz className="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
