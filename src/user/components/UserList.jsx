import "./UserList.css";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UserList = (props) => {
  return props.items.length === 0 ? (
    <div className="center">
      <Card>
        <h2>No User Found!</h2>
      </Card>
    </div>
  ) : (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            name={user.name}
            image={user.image}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
};

export default UserList;
