import { Switch, Route } from "react-router-dom";
import Home from "./components/HomeComp/Home";
import CourseDetails from "./components/CourseDetailsComp/CourseDetails";
import StudentDashboard from "./components/DashboardComp/StudentDashboard";
import "./App.css";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard/" exact component={StudentDashboard} />
        <Route path="/course/:id" exact component={CourseDetails} />
      </Switch>
    </>
  );
}

export default App;
