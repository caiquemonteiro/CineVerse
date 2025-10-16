import { useEffect, useState } from 'react';
import { Avatar, Empty } from 'antd';
import { formatDateTime } from "../../utils";
import { IMAGE_BASE_URL, EMPTY_IMAGE_URL } from '../../utils/constants';
import CineVerseHeart from '../../assets/cineVerseHeart.png';
import ReactMarkdown from 'react-markdown';
import './review.css';

const ReviewComponent = ({ reviews = [] }) => {
  
  return (
    <div className="reviews">
      
      {reviews.map((review, index) => (
          
        <div key={index} className="review-card">
          
          <div className="review-header">
            
            <Avatar src={`${IMAGE_BASE_URL}${review.author_details.avatar_path}`} />

            <div className="user-infor">
              <div>{review.author}</div>
              <div className="review-date">{formatDateTime(review.created_at)}</div>
            </div>

            <div className="rating-badge">
              <img src={CineVerseHeart} alt="Nota CineVerse" style={{ height: 24 }} />
              <span className="rating-value">{review.author_details.rating}</span>
            </div>

          </div>

          {review.content && (
            <div className="review-comment">
              <ReactMarkdown>{review.content}</ReactMarkdown>
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default ReviewComponent;
