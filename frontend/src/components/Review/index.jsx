import { useEffect, useState } from 'react';
import { Avatar, message, Empty } from 'antd';
import { getMovieReviews } from "../../api/tmdb.api";
import { formatDateTime, removeDuplicateReviews } from "../../utils";
import { IMAGE_BASE_URL, EMPTY_IMAGE_URL } from '../../utils/constants';
import CineVerseHeart from '../../assets/cineVerseHeart.png';
import ReactMarkdown from 'react-markdown';
import './review.css';

const ReviewComponent = ({ movieId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMovieReviews(movieId)
      .then((res) => res.json())
      .then((json) => setReviews(removeDuplicateReviews(json.results)))
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar as avaliações');
      }) 
      .finally(() => setLoading(false))
  }, [movieId])

  return (

    <div className="reviews">

      {contextHolder}

      {reviews.length === 0 ? (
        <Empty
          image={EMPTY_IMAGE_URL}
          styles={{ image: { height: 60 } }}
          description={
            <span className="empty-description">
              Nenhuma avaliação disponível
            </span>
          }
        /> ) : (
        
        reviews.map((review, index) => (
            
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
        ))
      )}
    </div>
  );
};

export default ReviewComponent;
