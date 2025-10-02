import React from 'react';
import { HeartFilled } from "@ant-design/icons";
import './review.css';

const ReviewComponent = ({ movie }) => {
  return (
    <div className="reviews">
      
      {movie.reviews.map((review, index) => (
        
        <div key={index} className="review-card">
          
          <div className="review-header">
            
            <div className="avatar">
              {review.user.charAt(0).toUpperCase()}
            </div>

            <div className="user-infor">
              <div>{review.user}</div>
              <div className="review-date">{review.date}</div>
            </div>

            <div className="rating-badge">
              <HeartFilled style={{ color: "#CF1322", fontSize: 16, marginRight: 4 }} />
              <span className="rating-value">{review.rating}</span>
            </div>

          </div>

          {review.comment && (
            <div className="review-comment">
              {review.comment}
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default ReviewComponent;
