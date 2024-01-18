import { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../HeaderComp/Header";
import { CiSearch } from "react-icons/ci";
import { AiTwotoneLike } from "react-icons/ai";

import "./home.css";

class Home extends Component {
  state = {
    courses: [],
    searchVal: "",
  };

  componentDidMount() {
    this.callAPi();
  }

  callAPi = async () => {
    const options = {
      method: "GET",
    };
    const response = await fetch(
      "https://apigenerator.dronahq.com/api/tMbVjm23/data",
      options
    );
    const data = await response.json();
    this.originalCourses = data;
    console.log(data);
    this.setState({
      courses: data,
    });
  };

  handleSearch = (search) => {
    const { courses } = this.state;
    if (search == "") {
      this.setState({ courses: this.originalCourses });
    } else {
      const filteredCourses = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(search.toLowerCase()) ||
          course.instructor.toLowerCase().includes(search.toLowerCase())
      );
      this.setState({ courses: filteredCourses });
    }
  };

  makeRe = (id, likes) => {
    const increasedLikes = likes + 1;
    console.log(increasedLikes);
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: increasedLikes,
      }),
    };

    fetch(`https://apigenerator.dronahq.com/api/tMbVjm23/data/${id}`, options)
      .then((response) => {
        if (response.status == 200) {
          this.callApi();
          return response.json();
        } else {
          throw new Error(`Failed to update likes for course with id ${id}`);
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  render() {
    const { courses, searchVal } = this.state;

    return (
      <div className="home-container">
        <Header location={this.props.location} />
        <div className="top-container">
          <h1>Welcome!</h1>
          <h3>Here you can find all the available courses...</h3>
          <h4>
            Enroll in your favourite courses and kick start your career, ALL THE
            BEST!
          </h4>
        </div>

        <div className="courses-container">
          <div className="heading-search-container">
            <h2> Courses:</h2>
            <div className="search-container">
              <input
                className="search-input"
                type="text"
                value={searchVal}
                placeholder="Enter course name or instructor"
                onChange={(e) =>
                  this.setState({ searchVal: e.target.value }, () =>
                    this.handleSearch(e.target.value)
                  )
                }
              />
              <CiSearch className="search-icon" />
            </div>
          </div>
          {courses.length === 0 ? (
            <h1>Loading...Please Wait!!</h1>
          ) : (
            <ul className="courses-list">
              {courses.map((course) => (
                <li key={course.id} className="course-item">
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="home-thumbnail"
                  />
                  <div>
                    <p>
                      <b>{course.name}</b>
                    </p>
                    <button
                      onClick={() => this.makeRe(course.id, course.likes)}
                    >
                      {course.likes} <AiTwotoneLike />
                    </button>
                    <p>
                      <b>Instructor: </b>
                      {course.instructor}
                    </p>
                    <Link to={`/course/${course.id}`}>
                      <button className="go-to-course-btn">Go to course</button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}
export default Home;
