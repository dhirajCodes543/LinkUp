import React, { lazy, Suspense } from "react";

const VideoNavbar = lazy(() => import("./VideoNavbar"));
const RandomConnector = lazy(() => import("./RandomConnecter"));

const Main = () => {
  return (
    <Suspense fallback={<div>Loading chat  UI...</div>}>
      <VideoNavbar />
      <RandomConnector />
    </Suspense>
  );
};

export default Main;
