// client/src/components/CourseList.js
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await api.getCourses();
      setCourses(result);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course._id}>{course.courseName}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
