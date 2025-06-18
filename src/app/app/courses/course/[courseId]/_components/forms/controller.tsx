"use client";

import { AttendanceListItem } from "@/types";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Space, Tag, theme } from "antd";
import { FC } from "react";

type AttendanceControllerProps = {
  record: Omit<AttendanceListItem, "id" & { id?: number }>;
  index: number;
  editRecordStatus: (
    status: "present" | "absent" | "justified",
    index: number
  ) => void;
};

export const AttendanceController: FC<AttendanceControllerProps> = ({
  record,
  editRecordStatus,
  index,
}) => {
  const {
    token: { colorTextDisabled, colorSuccess, colorError },
  } = theme.useToken();
  return (
    <Space size={0}>
      <Tag
        icon={<CheckCircleOutlined />}
        color={record.status === "present" ? "success" : "default"}
        onClick={() => editRecordStatus("present", index)}
        bordered={false}
        style={{
          cursor: "pointer",
         
          color: record.status !== "present" ? colorTextDisabled : colorSuccess,
          background: record.status !== "present"?"transparent":""
        }}
      />
      <Tag
        icon={<CloseCircleOutlined />}
        color={record.status === "absent" ? "error" : "default"}
        onClick={() => editRecordStatus("absent", index)}
        bordered={false}
        style={{
          cursor: "pointer",
         
          marginRight: 0,
          color: record.status !== "absent" ? colorTextDisabled : colorError,
          background: record.status !== "absent"?"transparent":""
        }}
      />
    </Space>
  );
};
