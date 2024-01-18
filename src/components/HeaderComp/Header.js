import { Link, withRouter } from "react-router-dom";
import { Component } from "react";
import Cookies from "js-cookie";
import "./header.css";

class Header extends Component {
  state = {
    menu: false,
  };

  mobileMenu = () => {
    this.setState((prev) => ({ menu: !prev.menu }));
  };

  onLogout = () => {
    const { history, location } = this.props;
    Cookies.remove("token_id");
    history.push("/login");
  };

  render() {
    const { menu } = this.state;

    return (
      <>
        <nav className="header-container-desktop">
          <Link to="/">Home</Link>

          <ul className="ul-items-desktop">
            <li>
              <Link className="header-heading" to="/dashboard/">
                My Profile
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="header-container-mobile">
          <Link to="/">Home</Link>
          <Link className="header-heading" to="/dashboard/">
            My Profile
          </Link>
        </nav>
        <div></div>
      </>
    );
  }
}

export default withRouter(Header);
