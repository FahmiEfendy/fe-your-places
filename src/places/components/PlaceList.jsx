import React from "react";
import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import { useParams } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
  const { userId } = useParams();
  const userData = JSON.parse(localStorage.getItem("userData"));

  return props.items.length === 0 ? (
    <div className="place-list center">
      {userData ? (
        userId === userData.id ? (
          <Card>
            <h2>No Places Found! Maybe Create One?</h2>
            <Button to="/place/new">SHARE PLACE</Button>
          </Card>
        ) : (
          <Card>
            <h2>This user doesn't have a place yet.</h2>
            <Button to="/">BACK TO HOMEPAGE</Button>
          </Card>
        )
      ) : (
        <Card>
          <h2>This user doesn't have a place yet.</h2>
          <Button to="/">BACK TO HOMEPAGE</Button>
        </Card>
      )}
    </div>
  ) : (
    <ul className="place-list">
      {props.items.map((place) => {
        return (
          <PlaceItem
            key={place.id}
            id={place.id}
            imageUrl={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creator={place.creator}
            coordinates={place.coordinates}
            onDelete={props.onDelete}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
