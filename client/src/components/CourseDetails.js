// client/src/components/CourseDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [compulsoryModules, setCompulsoryModules] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const result = await api.getCourseDetails(id);
      setCourse(result.course);
      setCompulsoryModules(result.compulsoryModules);
    };
    fetchCourseDetails();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{course.courseName}</h2>
      <p>{course.description}</p>
      <h3>Compulsory Modules</h3>
      <ul>
        {compulsoryModules.map(module => (
          <li key={module._id}>{module.moduleName}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetails;
