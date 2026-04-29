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
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
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
