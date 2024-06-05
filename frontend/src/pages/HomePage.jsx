import { Link } from "react-router-dom";
import { Musicbar } from "@components/index";
function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <div>
        <Link to="/signin">Sign In</Link>
      </div>
      <div>
        <Link to="/signup">Sign Up</Link>
      </div>
      <Musicbar />
    </div>
  );
}

export default HomePage;
