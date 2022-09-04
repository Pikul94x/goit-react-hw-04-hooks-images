import { useEffect, useState } from 'react';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import { Api } from '../Services/Api/Api';
import './App.css';

const initialState = {
  pictures: [],
  largeImage: '',
  imgTags: '',
  error: false,
  showModal: false,
  loading: false,
  finish: false,
};

export const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [state, setState] = useState(initialState);

  const { pictures, loading, error, showModal, largeImage, imgTags, finish } =
    state;

  const fetchPictures = async () => {
    try {
      const { data } = await Api.searchImages(page, query);
      setState(({ pictures }) => {
        const newState = {
          pictures: [...pictures, ...data.hits],
          loading: false,
          error: false,
        };
        if (data.hits.length < 11) {
          newState.finish = true;
        }
        if (!data.hits.length) {
          newState.error = true;
        }
        return newState;
      });
    } catch (error) {
      setState({
        loading: false,
        error: false,
      });
    }
  };

  const handleOpenModal = largeImage => {
    setState({
      ...state,
      largeImage,
      showModal: true,
    });
  };

  const onChangeQuery = query => {
    setQuery(query);
  };

  const loadMore = () => {
    setPage(prevState => {
      return prevState + 1;
    });
    state.loading = true;
    setState({ ...state });
  };

  const closeModal = () => {
    setState(({ showModal }) => {
      return {
        ...state,
        showModal: !showModal,
      };
    });
  };

  useEffect(() => {
    if (!query) {
      return;
    }
    setState({ pictures: [], loading: true, finish: false });
    fetchPictures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (!query) {
      return;
    }
    fetchPictures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="App">
      <Searchbar onSubmit={onChangeQuery} />
      {error && <h1>Impossible to load the pictures!</h1>}
      {!error && <ImageGallery pictures={pictures} onClick={handleOpenModal} />}
      {!finish && pictures.length !== 0 && <Button onClick={loadMore} />}
      {loading && <Loader />}
      {showModal && (
        <Modal showModal={closeModal}>
          <img src={largeImage} alt={imgTags} />
        </Modal>
      )}
    </div>
  );
};
