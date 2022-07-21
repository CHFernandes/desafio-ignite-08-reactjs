import { useCallback, useEffect, useState } from 'react';

import { SideBar } from './components/SideBar';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';

type GenreResponseProps = {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

type MovieProps = {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

type MoviesAndGenreDetailsProps = {
  movies: MovieProps[]
  genre: GenreResponseProps
}

async function getMoviesAndGenreDetailsById(selectedGenreId: number) {
  const { data: moviesData } = await api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
  const { data: genreData } = await api.get<GenreResponseProps>(`genres/${selectedGenreId}`)

  const returnObject: MoviesAndGenreDetailsProps = {
    genre: genreData,
    movies: moviesData,
  }

  return returnObject;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  const getMoviesAndGenreDetailsByIdCallback = useCallback(async() => {
    const { movies, genre } = await getMoviesAndGenreDetailsById(selectedGenreId)

    setMovies(movies);
    setSelectedGenre(genre);

  }, [selectedGenreId])

  const buttonClickCallback = useCallback((id: number) => {
    setSelectedGenreId(id);
  }, [])

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    getMoviesAndGenreDetailsByIdCallback();
  }, [selectedGenreId])


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        buttonClickCallback={buttonClickCallback}
      />

      <Content
        selectedGenre={selectedGenre}
        movies={movies}
      />
    </div>
  )
}