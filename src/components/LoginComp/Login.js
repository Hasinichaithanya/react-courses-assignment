import { Component } from "react";
import Cookies from "js-cookie";
import { Redirect, withRouter } from "react-router-dom";
import "./login.css";

class Login extends Component {
  state = {
    id: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { id } = this.state;
    console.log(this.state, "login");
    const { history } = this.props;
    if (id == "" || parseInt(id) < 100 || parseInt(id) >= 113) {
      alert("Enter correct Id");
    } else if (parseInt(id) > 100 && parseInt(id) < 113) {
      Cookies.set("token_id", id);
      history.push({
        pathname: "/",
        state: { id: id },
      });
      console.log(history.location.state, "login");
    }
  };

  render() {
    const { id } = this.state;
    const token_id = Cookies.get("token_id");
    if (token_id !== undefined) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-container">
        <h1>Log in into your dashBoard</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="id">ID of the Student</label>
          <br />
          <input
            type="number"
            id="id"
            placeholder="Enter your ID (101-112)"
            value={id}
            onChange={(e) => this.setState({ id: e.target.value })}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}
export default withRouter(Login);
