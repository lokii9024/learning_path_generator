import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserProfile } from "@/utils/auth_ctb";
import { setUser, logOut } from "@/store/authSlice";
import { persistor } from "@/store";


export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function validateSession() {
      try {
        const { user } = await getUserProfile();
        if (user) {
          dispatch(setUser({ user }));
        } else {
            dispatch(logOut());
        }
      } catch (error) {
        // 🔥 THIS IS THE KEY
        dispatch(logOut());
      }
    }

    validateSession();
  }, [dispatch]);
};
