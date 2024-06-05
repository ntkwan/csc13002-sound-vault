import { Link } from "react-router-dom";

function SignUpPage() {
  return (
    <div>
      <h1>Sign Up</h1>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
}

export default SignUpPage;
