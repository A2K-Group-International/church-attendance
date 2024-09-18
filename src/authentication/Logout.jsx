import { Button } from "../components/ui/button";
import { useLogout } from "./useLogout";

const Logout = () => {
  const { logout, isLoading } = useLogout();
  return (
    <Button disabled={isLoading} onClick={logout}>
      Logout
    </Button>
  );
};
export default Logout;
