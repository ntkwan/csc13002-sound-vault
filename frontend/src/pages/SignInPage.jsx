import { Link } from "react-router-dom";

function SignInPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default SignInPage;
