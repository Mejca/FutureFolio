import React, { useState } from 'react';
import { FaStar, FaClock } from 'react-icons/fa';
import styles from './ModuleCard.module.css';

const ModuleCard = ({ module, onInfoClick, onAddModule }) => {
  const [rating, setRating] = useState(module.rating || 0);
  const [review, setReview] = useState('');

  const handleRating = (value) => {
    setRating(value);
    // Here you would typically send this rating to your backend
  };

  const handleReviewSubmit = () => {
    // Here you would typically send this review to your backend
    console.log(`Review for ${module.moduleCode}: ${review}`);
    setReview('');
  };

  const estimateWorkload = () => {
    // This is a simple estimation. You might want to use more sophisticated logic based on module difficulty, credits, etc.
    const hoursPerCredit = 3;
    return module.credits * hoursPerCredit;
  };

  return (
    <div className={styles.moduleCard}>
      <h3>{module.moduleName}</h3>
      <p>{module.moduleCode} - {module.credits} credits</p>
      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((value) => (
          <FaStar
            key={value}
            className={value <= rating ? styles.starFilled : styles.starEmpty}
            onClick={() => handleRating(value)}
          />
        ))}
      </div>
      <div className={styles.workload}>
        <FaClock /> Estimated workload: {estimateWorkload()} hours
      </div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write a review..."
        className={styles.reviewInput}
      />
      <button onClick={handleReviewSubmit} className={styles.reviewButton}>Submit Review</button>
      <button onClick={() => onInfoClick(module)} className={styles.infoButton}>More Info</button>
      <button onClick={() => onAddModule(module)} className={styles.addButton}>Add Module</button>
    </div>
  );
};

export default ModuleCard;