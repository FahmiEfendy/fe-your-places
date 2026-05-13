import React, { useContext, useState } from "react";

import "./PlaceItem.css";
import Map from "../../shared/components/UIElements/Map";
import useFetchImage from "../../shared/hooks/image-hook";
import useHttpRequest from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { imageUrl } = useFetchImage(props.imageUrl);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpRequest();

  const openMapHandler = () => setIsMapOpen(true);

  const closeMapHandler = () => setIsMapOpen(false);

  const openDeleteModalHandler = () => setIsDeleteModalOpen(true);

  const closeDeleteModalHandler = () => setIsDeleteModalOpen(false);

  const confirmDeleteHandler = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/your-places/api';
      await sendRequest(
        `${apiBaseUrl}/places/${props.id}`,
        "DELETE",
        {
          Authorization: `Bearer ${auth.userToken}`,
        }
      );

      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }

    closeDeleteModalHandler();
  };

  return (
    <React.Fragment>
      <Modal
        show={isMapOpen}
        onCancel={closeMapHandler}
        header={
          <div className="modal-header__container">
            <span className="modal-header__title">{props.title}</span>
            <span className="modal-header__address">{props.address}</span>
          </div>
        }
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                props.address
              )}`}
              target="_blank"
            >
              VIEW ON GOOGLE MAPS
            </Button>
            <Button inverse onClick={closeMapHandler}>
              CLOSE
            </Button>
          </React.Fragment>
        }
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>

        <div className="place-item__modal-details">
          <div className="modal-detail__item">
            <span className="modal-detail__label">Address</span>
            <p className="modal-detail__value">{props.address}</p>
          </div>
          <div className="modal-detail__row">
            <div className="modal-detail__item">
              <span className="modal-detail__label">Latitude</span>
              <p className="modal-detail__value">{props.coordinates.lat.toFixed(6)}</p>
            </div>
            <div className="modal-detail__item">
              <span className="modal-detail__label">Longitude</span>
              <p className="modal-detail__value">{props.coordinates.lng.toFixed(6)}</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        show={isDeleteModalOpen}
        header="Are you sure want to delete this place?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            <Button inverse onClick={closeDeleteModalHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed to delete this place? Please note that this
          cant be undone thereafter!
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={imageUrl} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creator && (
              <React.Fragment>
                <Button to={`/place/${props.id}`}>EDIT</Button>
                <Button danger onClick={openDeleteModalHandler}>
                  DELETE
                </Button>
              </React.Fragment>
            )}
          </div>
        </Card>
      </li>

      <ErrorModal error={error} onClear={clearErrorHandler} />
    </React.Fragment>
  );
};

export default PlaceItem;
