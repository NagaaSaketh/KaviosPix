import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/store";

import Body from "./components/Body";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Albums from "./components/Albums";
import AlbumImages from "./components/AlbumImages";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Body />}>
            <Route index element={<Home />} />
            <Route path="albums" element={<Albums />} />
            <Route path="albums/:albumId/images" element={<AlbumImages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
