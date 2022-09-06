import { useEffect, useState } from 'react';
import Modal from './Modal/Modal';
import Searchbar from './Searchbar/Searchbar';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import { Api } from '../services/api/api';
import './App.css';

export const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [error, setError] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [imgTags, showImgTags] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);

  const fetchPictures = async () => {
    try {
      const { data } = await Api.searchImages(page, query);
      setPictures([...pictures, ...data.hits]);
      setLoading(false);
      setError(!data.hits.length);
      if (data.hits.length < 11) {
        setFinish(true);
      }
    } catch (error) {
      setLoading(false);
      setError(false);
    }
  };

  const handleOpenModal = largeImage => {
    setLargeImage(largeImage);
    setShowModal(true);
  };

  const onChangeQuery = query => {
    setQuery(query);
  };

  const loadMore = () => {
    setPage(prevState => {
      return prevState + 1;
    });
    setLoading(true);
  };

  const closeModal = () => {
    setShowModal(!showModal)
  };

  useEffect(() => {
    if (!query) {
      return;
    }
    setPictures([]);
    setLoading(true);
    setFinish(false);

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
