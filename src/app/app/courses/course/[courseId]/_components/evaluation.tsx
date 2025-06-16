"use client";
import React, { useState } from "react";
import { Button, Modal, Rate, Input, Typography, message, Result } from "antd";
import { StarOutlined, FormOutlined } from "@ant-design/icons";

export const StudentCourseEvaluations = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Simulate submit
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setComment("");
      setRating(0);
      message.success("Votre évaluation a bien été envoyée. Merci !");
    }, 1200);
  };

  return (
    <Result
      icon={<FormOutlined />}
      title={"Évaluer ce cours"}
      subTitle={
        <Typography.Paragraph>
          Vous avez la possibilité d&apos;évaluer ce cours et de donner votre
          avis sur l&apos;enseignant.
          <br /> Votre avis est important pour l&apos;amélioration de la qualité
          pédagogique.
          <br />
          <Typography.Text type="secondary">
            Votre évaluation reste totalement anonyme.
          </Typography.Text>
        </Typography.Paragraph>
      }
      extra={
        <>
          <Button
            type="primary"
            icon={<StarOutlined />}
            onClick={() => setOpen(true)}
            style={{ boxShadow: "none" }}
          >
            Évaluer le cours
          </Button>
          <Modal
            title="Évaluation du cours"
            open={open}
            onCancel={() => setOpen(false)}
            onOk={handleSubmit}
            okText="Envoyer"
            okButtonProps={{ disabled: rating === 0 || loading, loading }}
            cancelButtonProps={{ disabled: loading }}
          >
            <Typography.Paragraph strong>Note globale :</Typography.Paragraph>
            <Rate value={rating} onChange={setRating} />
            <Typography.Paragraph className="mt-4" strong>
              Commentaire (optionnel) :
            </Typography.Paragraph>
            <Input.TextArea
              placeholder="Exprimez votre avis ou suggestion..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              disabled={loading}
            />
          </Modal>
        </>
      }
    />
  );
};
