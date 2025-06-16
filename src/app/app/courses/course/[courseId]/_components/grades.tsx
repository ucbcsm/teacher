'use client'

import React from "react";
import {  Flex, List, Space, Typography } from "antd";
import {
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const gradesData = {
  grades: [
    {
      type: "TD/TP",
      label: "TD (Travaux Dirigés)",
      score: 3.5,
      max: 5,
      date: "2025-03-12",
    },
    {
      type: "TD/TP",
      label: "TP (Travaux Pratiques)",
      score: 2.5,
      max: 5,
      date: "2025-04-07",
    },
    {
      type: "Examen",
      label: "Examen final",
      score: 7,
      max: 10,
      date: "2025-05-21",
    },
  ],
};

export const StudentCourseGrades=()=> {
  const { grades } = gradesData;

  const total = grades.reduce(
    (acc, g) => ({
      score: acc.score + g.score,
      max: acc.max + g.max,
    }),
    { score: 0, max: 0 }
  );

  return (
    <List
      className="mt-7"
      header={
        <Flex justify="space-between">
          <Typography.Text strong>Type</Typography.Text>
          <Typography.Text strong>Note</Typography.Text>
        </Flex>
      }
      dataSource={grades}
      renderItem={(item) => (
        <List.Item key={item.label}>
          <Flex style={{ width: "100%" }} justify="space-between">
            <Space>
              {item.type === "TD/TP" ? (
                <FileTextOutlined style={{ color: "#1677ff" }} />
              ) : (
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
              )}
              {item.label}
            </Space>

            <Typography.Text>
              {item.score} / {item.max}
            </Typography.Text>
          </Flex>
        </List.Item>
      )}
      footer={
        <Flex justify="space-between">
          <Typography.Text strong>Total</Typography.Text>

          <Typography.Text strong>
            {total.score} / {total.max}
          </Typography.Text>
        </Flex>
      }
    />
  );
}
