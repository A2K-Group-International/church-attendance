// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../components/ui/button";
import childrensChurch from "../assets/images/childrens-church.png";
import cross from "../assets/svg/cross.svg";
import { DialogLogin } from "@/components/ui/DialogLogin";
import DialogWalkInRegister from "@/components/ui/DialogWalkInRegister";

const Home = () => {
  return (
    <>
      {/* Hero */}
      <div className="overflow-hidden">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 grid place-content-center h-svh">
          <div className="relative mx-auto max-w-4xl grid space-y-5 sm:space-y-10">
            {/* Title */}
            <div className="text-center">
              <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-3">
                Children's Liturgy
              </p>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Growing in Faith Together: Engaging Children in the Joy of the
                Gospel
              </h1>
            </div>
            {/* End Title */}
            {/* Buttons */}
            <div className="mx-auto max-w-2xl sm:flex sm:space-x-3 p-3 border rounded-lg shadow-lg shadow-primary-foreground ">
              <div className="p-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                <DialogLogin />
                <Button variant="outline">Register</Button>
                <DialogWalkInRegister />
                <Button variant="outline">Edit Registration</Button>
              </div>
            </div>
            {/* End Button */}
            {/* SVG Element */}
            <div
              className="hidden absolute top-2/4 start-0 transform -translate-y-2/4 -translate-x-40 lg:block lg:-translate-x-60"
              aria-hidden="true"
            >
              <img
                src={childrensChurch}
                alt="children in the church"
                className="w-80"
              />
            </div>
            {/* End SVG Element */}
            {/* SVG Element */}
            <div
              className="hidden absolute top-2/4 end-0 transform -translate-y-2/4 translate-x-30 lg:block lg:translate-x-96"
              aria-hidden="true"
            >
              <img src={cross} alt="" />
            </div>
            {/* End SVG Element */}
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
};

// <div className="flex h-screen justify-center items-center gap-10">
//   <Link to="/login">
//     <Button>Login</Button>
//   </Link>
//   <Link to="/registration">
//     <Button>Registration</Button>
//   </Link>
//   <Link to="#">
//     <Button>Edit/Cancel Registration</Button>
//   </Link>
// </div>

export default Home;
