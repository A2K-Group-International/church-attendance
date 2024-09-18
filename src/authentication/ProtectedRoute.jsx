import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  //Load the authenticated user
  const { isLoading, isAuthenticated } = useUser();

  //redirect if it's not authenticated
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) {
        navigate("/login");
      }
    },
    [isAuthenticated, isLoading, navigate]
  );

  //While loading
  if (isLoading)
    return <p className="grid place-items-center h-screen">Loading...</p>;

  if (isAuthenticated) return children;
}
export default ProtectedRoute;
