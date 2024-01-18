import { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Header from "../HeaderComp/Header";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import "./details.css";

class CourseDetails extends Component {
  state = {
    details: [],
    isExpanded: false,
  };

  componentDidMount() {
    this.callApi();
  }

  callApi = async () => {
    const { match } = this.props;
    const { id } = match.params;
    const options = {
      method: "GET",
    };
    const response = await fetch(
      `https://apigenerator.dronahq.com/api/FoEOhFrT/data/${id}`,
      options
    );
    const data = await response.json();
    this.setState({
      details: data,
    });
  };

  renderSyllabus = () => {
    const { details } = this.state;
    const { syllabus } = details;
    console.log(syllabus);
    return (
      <ul className="syllabus-container">
        {syllabus.map((week) => (
          <li key={week.week}>
            <p>
              WEEK {week.week}: {week.topic}
            </p>
            <p>Topics: {week.content}</p>
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { details, isExpanded } = this.state;
    console.log(details);
    if (details.length === 0) {
      return <h1 className="loading-element">Loading...</h1>;
    }

    const course = details;
    const {
      name,
      description,
      thumbnail,
      duration,
      enrollmentStatus,
      instructor,
      location,
      prerequisites,
      schedule,
      syllabus,
    } = course;
    return (
      <div className="course-details-container">
        <Header />

        <div className="details-container">
          <div className="details">
            <h1 className="course-name">{name} Course Details</h1>
            <div>
              <p>
                <span className="span-element">Instructor</span> : {instructor}{" "}
              </p>
              <p>
                <span className="span-element">Duration</span> : {duration}
              </p>
            </div>
            <p>
              <span className="span-element">Overview of the course : </span>
              <br /> {description}
            </p>
            <p>
              <span className="span-element">Enrollment Status</span> :{" "}
              {enrollmentStatus}
            </p>
            <p>
              <span className="span-element">Schedule</span> : {schedule}
            </p>
            <p>
              <span className="span-element">Location</span> : {location}
            </p>
            <p>
              <span className="span-element">Prerequisites</span>:{" "}
              {prerequisites}
            </p>
            <button
              type="button"
              onClick={() =>
                this.setState((prev) => ({ isExpanded: !prev.isExpanded }))
              }
              className="syllabus-btn"
            >
              What you will learn in the course{" "}
              {isExpanded === false ? <FaArrowDown /> : <FaArrowUp />}
            </button>
            {isExpanded === true ? this.renderSyllabus() : ""}
            <div className="explore-btn">
              <Link to="/">
                <button className="go-to-course-btn">
                  Explore More courses
                  <FaArrowRight className="right-icon" />
                </button>
              </Link>
            </div>
          </div>
          <img src={thumbnail} alt={name} className="details-thumbnail" />
        </div>
      </div>
    );
  }
}
export default withRouter(CourseDetails);
