import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import clientAPI from "client-api/rest-client";
import { setUser } from "../redux/features/userSlice";

interface Props {
  setUserPermissions: (permissions: string[]) => void;
}

const RouteTracker = ({ setUserPermissions }: Props) => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      try {
        const { user_id, email, fullName } = jwtDecode<{
          user_id: string;
          email: string;
          fullName: string;
        }>(userToken);

        dispatch(setUser({ user_id, email, fullName }));

        const fetchPermissions = async () => {
          try {
            const response : {result: string[]} = await clientAPI
              .service("Roles")
              .get(`permission-user/${user_id}`);

            const permissions : string[] = response?.result || [];
            setUserPermissions(permissions);
          } catch (error) {
            console.error("Lỗi lấy quyền người dùng:", error);
            setUserPermissions([]);
          }
        };

        fetchPermissions();
      } catch (err) {
        console.error("Lỗi giải mã token:", err);
      }
    } else {
      setUserPermissions([]);
    }
  }, [location.pathname, dispatch]);

  return null;
};

export default RouteTracker;
