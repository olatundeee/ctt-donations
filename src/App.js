import './App.css';
import routes from "./routes";
import { useState, Suspense, useMemo, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


function App() {
  
const allRoutes = useMemo((allRoutes) =>
routes.map((route) => {
  if (route.route !== null) {
    return <Route exact path={route.route} element={route.component} key={route.key} />;
  }

  return null;
}), [routes]);

  return (
    <div style={{backgroundColor: '#f2f2f2'}}>
      <Routes>
        {allRoutes}
      </Routes>
    </div>
  );
}

export default App;
