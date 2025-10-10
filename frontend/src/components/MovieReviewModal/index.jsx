import { useState } from "react";
import { Modal, Divider, Flex, Rate, Input } from "antd";
import { HeartFilled } from "@ant-design/icons";
import "./moviereviewmodal.css";

export default function MovieReviewModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { TextArea } = Input;

  const handleOk = () => {
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Modal
      title="Avaliar Filme"
      open={isOpen}
      onOk={handleOk}
      onCancel={onClose}
      okText="Avaliar"
      cancelText="Cancelar"
      className="custom-modal"
    >
      <Divider className="custom-modal-divider" />

      <div className="review-section">
        <label>Nota do filme:</label>
        <Flex vertical gap="middle">
          <Rate
            character={<HeartFilled />}
            allowHalf
            count={10}
            className="custom-heart-rate"
            value={rating}
            onChange={setRating}
          />
        </Flex>
      </div>

      <div className="review-section">
        <label>Comentário:</label>
        <TextArea
          placeholder="Conte para as pessoas o que você achou deste filme..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </Modal>
  );
}
