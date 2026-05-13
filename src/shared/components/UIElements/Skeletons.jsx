import React from "react";

import Card from "./Card";
import Skeleton from "./Skeleton";

import "./Skeleton.css";

export const UserItemSkeleton = () => {
  return (
    <li className="user-item">
      <Card className="user-item__content" style={{ background: "var(--card-bg)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "1.25rem" }}>
          <Skeleton
            width="4.5rem"
            height="4.5rem"
            borderRadius="50%"
            margin="0 1.5rem 0 0"
          />
          <div>
            <Skeleton width="10rem" height="1.25rem" margin="0 0 0.5rem 0" />
            <Skeleton width="5rem" height="0.9rem" />
          </div>
        </div>
      </Card>
    </li>
  );
};

export const PlaceItemSkeleton = () => {
  return (
    <li className="place-item" style={{ listStyle: "none" }}>
      <Card className="place-item__content">
        <Skeleton width="100%" height="15rem" borderRadius="0" />
        <div style={{ padding: "1.5rem" }}>
          <Skeleton width="60%" height="1.5rem" margin="0 0 0.5rem 0" />
          <Skeleton width="40%" height="1rem" margin="0 0 1rem 0" />
          <Skeleton width="90%" height="0.9rem" margin="0 0 0.4rem 0" />
          <Skeleton width="80%" height="0.9rem" />
        </div>
        <div
          style={{
            padding: "1.25rem",
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(255, 255, 255, 0.02)",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Skeleton width="6rem" height="2.5rem" borderRadius="var(--radius)" margin="0 0 0 0.75rem" />
          <Skeleton width="6rem" height="2.5rem" borderRadius="var(--radius)" margin="0 0 0 0.75rem" />
        </div>
      </Card>
    </li>
  );
};
