import React from 'react';
import { Button} from 'rbx';
import {getCourseTerm, getCourseNumber, buttonColor, moveCourse} from '../CourseList';
import hasConflict from './time';


const Course = ({course, state, user}) => (
  <Button color={buttonColor(state.selected.includes(course))}
          onClick = { () => state.toggle(course)}
          onDoubleClick={user ? () => moveCourse(course) : null}
          disabled={hasConflict(course, state.selected)}
  >
    {getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
  </Button>
);

export default Course;