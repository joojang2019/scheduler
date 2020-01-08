import { Button} from 'rbx';
import React, {useState} from 'react';
import Course from './Course/Course';
import {saveCourse} from '../App';

const terms = {F: 'Fall', W: 'Winter', S: 'Spring'};
const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};
const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
);

const TermSelector = ({state}) => (
  <Button.Group hasAddons>
    { Object.values(terms)
        .map(value => 
          <Button key={value}
                  color={buttonColor(value === state.term)}
                  onClick={() => state.setTerm(value)}
          >
            {value}
          </Button>
        )
    }
  </Button.Group>
);

const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if(!meets) return;
  const {days} = timeParts(meets);
  if(days) saveCourse(course, meets);
  else moveCourse(course);
}

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});


const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = (x) => {
    setSelected(selected.includes(x) ?
                    selected.filter(y => y!==x) :
                    [x].concat(selected));
  };
  return [selected, toggle];
}

const buttonColor = selected => (
  selected ? 'success': null
);


const CourseList = ({courses, user}) => {
  const [term, setTerm] = useState('Fall');
  const [selected, toggle] = useSelection();
  const termCourses = courses.filter(course => term===getCourseTerm(course));
  
  return (
    <React.Fragment>
      <TermSelector state={{term, setTerm}}/>
      <Button.Group>
        {termCourses.map(course => 
          <Course key={course.id} 
                  course={course} 
                  state={{selected, toggle}}
                  user={user}
                  />
        )}
      </Button.Group>
    </React.Fragment>
  );
};

export default CourseList;
export {getCourseTerm, buttonColor, getCourseNumber, moveCourse, addScheduleTimes};
