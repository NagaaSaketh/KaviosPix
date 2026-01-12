import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, status } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUser());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "failed") {
      navigate("/login", { replace: true });
    }
  }, [status, navigate]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
