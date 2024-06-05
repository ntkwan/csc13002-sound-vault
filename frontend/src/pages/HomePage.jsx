import { Link } from "react-router-dom";

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
    </div>
  );
}

export default HomePage;
