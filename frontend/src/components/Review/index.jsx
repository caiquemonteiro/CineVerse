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
            <Avatar className="user-avatar">
              {review.usuario?.nome?.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <div className="user-infor">
              <div>{review.usuario?.nome}</div>
              <div className="review-date">{formatDateTime(review.data)}</div>
            </div>
            <span className="rating-value">
              <img src={CineVerseHeart} alt="Nota CineVerse" style={{ height: 24 }} />
              {review.nota ?? "-"}
            </span>
          </div>
          {review.comentario && (
            <div className="review-comment">
              <ReactMarkdown>{review.comentario}</ReactMarkdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewComponent;
