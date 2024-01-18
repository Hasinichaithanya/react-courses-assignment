import { Component } from "react";
import Cookies from "js-cookie";
import { Link, Redirect } from "react-router-dom/";
import Header from "../HeaderComp/Header";
import "./dashboard.css";

const constants = {
  initial: "INITIAL",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
};

class StudentDashBoard extends Component {
  state = {
    studentData: "",
    isCompleted: {},
    id: "",
    isLoading: constants.initial,
  };

  componentDidMount() {
    const cachedId = localStorage.getItem("user_id");
    if (cachedId) {
      this.setState({ id: cachedId }, () => this.callApi());
    }
  }

  callApi = async () => {
    const { isLoading } = this.state;
    this.setState({
      isLoading: constants.inProgress,
    });
    const { id } = this.state;
    const i = parseInt(id);
    if (id) {
      const options = {
        method: "GET",
      };
      const response = await fetch(
        `https://apigenerator.dronahq.com/api/OQFAWr_1/data?id=${i - 100}`,
        options
      );
      const data = await response.json();
      const isCompleted = {};
      data[0].enrollments.forEach((enrollment) => {
        const cookieValue = Cookies.get(`isCompleted_${enrollment.courseId}`);
        isCompleted[enrollment.courseId] = cookieValue === "true";
      });

      this.setState(
        {
          studentData: data,
          isCompleted,
          isLoading: constants.success,
        },
        () => {
          localStorage.setItem("user_id", id);
        }
      );
    } else {
      console.log("error");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { id } = this.state;
    if (id == "" || parseInt(id) < 100 || parseInt(id) >= 113) {
      alert("Enter correct Id");
    } else this.callApi();
  };

  handleMarkCompleted = (courseId) => {
    this.setState((prevState) => {
      const updatedIsCompleted = {
        ...prevState.isCompleted,
        [courseId]: true,
      };
      console.log(updatedIsCompleted);
      Cookies.set(`isCompleted_${courseId}`, true);

      return { isCompleted: updatedIsCompleted };
    });
  };

  markAsComplete = async (id) => {
    const { studentData } = this.state;
    const updatedEnrollments = studentData[0].enrollments.map((enrollment) =>
      enrollment.courseId == id
        ? { ...enrollment, isCompleted: true, progress: 100 }
        : enrollment
    );
    console.log(updatedEnrollments);
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enrollments: updatedEnrollments,
      }),
    };
    const response = await fetch(
      `https://apigenerator.dronahq.com/api/OQFAWr_1/data/${id}`,
      options
    );
    const data = await response.json();
    console.log(response);
    if (response.ok) {
      this.callApi();
      console.log("Hi");
    }
  };

  renderLoading = () => <h1 className="loading-text">Loading...</h1>;

  info = () => {
    const { studentData, isCompleted } = this.state;
    const { student, enrollments } = studentData[0];

    return (
      <div>
        <h1 className="std-name">Hi {student.name}</h1>
        <p className="std-name">
          Your enrolled courses... start learning today{" "}
        </p>
        {enrollments && enrollments.length > 0 && (
          <ul>
            {enrollments.map((enrollment, index) => (
              <li key={index} className="student-details">
                <img
                  src={enrollment.thumbnail}
                  alt={enrollment.name}
                  className="thumbnail"
                />
                <div>
                  <p>
                    {enrollment.courseName} - Due Date: {enrollment.dueDate},
                  </p>
                  <p> Progress: {enrollment.progress}%</p>
                  <progress value={enrollment.progress} max={100}>
                    {enrollment.progress}%
                  </progress>
                  <br />
                  <div>
                    <button
                      className="complete-btn"
                      onClick={() => this.markAsComplete(enrollment.courseId)}
                    >
                      {enrollment.isCompleted
                        ? "Completed"
                        : "Mark as completed"}
                    </button>
                    <Link to={`/course/${enrollment.courseId}`}>
                      <button type="button" className="go-to-course-btn">
                        Go to course
                      </button>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  renderInfo = () => {
    const { isLoading } = this.state;

    switch (isLoading) {
      case constants.success:
        return this.info();
      case constants.inProgress:
        return this.renderLoading();
      default:
        return null;
    }
  };

  render() {
    const { studentData, id } = this.state;
    const cachedId = localStorage.getItem("user_id");
    if (cachedId)
      return (
        <div className="dashboard">
          <Header />({this.renderInfo()})
        </div>
      );
    return (
      <div className="dashboard">
        <Header />
        <div className="dashboard-info">
          {!studentData || studentData.length === 0 ? (
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="id">Enter your ID</label>
              <br />
              <input
                type="number"
                id="id"
                placeholder="Enter your ID (101-112)"
                value={id}
                onChange={(e) => this.setState({ id: e.target.value })}
              />
              <br />
              <button type="submit" className="go-to-course-btn">
                Login
              </button>
            </form>
          ) : (
            this.renderInfo()
          )}
        </div>
      </div>
    );
  }
}

export default StudentDashBoard;
