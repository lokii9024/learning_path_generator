import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { persistor } from "@/store";
import { setUser, logOut } from "@/store/authSlice";
import { getUserProfile } from "@/utils/auth_ctb";

export default function AuthLayout({ children }) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    async function validateSession() {
      try {
        const { user } = await getUserProfile();

        if (user) {
          dispatch(setUser({ user }));
        } else {
          throw new Error("Session invalid");
        }
      } catch (error) {
        dispatch(logOut());
        persistor.purge(); // 🔥 VERY IMPORTANT
      }
    }

    validateSession();
  }, [dispatch]);

  // 🚫 Don't render protected content if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
