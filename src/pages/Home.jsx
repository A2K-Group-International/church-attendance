import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex h-screen justify-center items-center gap-10">
      <Link to="/login">
        <Button>Login</Button>
      </Link>
      <Link to="/registration">
        <Button>Registration</Button>
      </Link>
      <Link to="#">
        <Button>Edit/Cancel Registration</Button>
      </Link>
    </div>
  );
};

export default Home;
