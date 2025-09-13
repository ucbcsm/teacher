"use client";

import { Avatar, Flex, List, Space, Table, Typography } from "antd";
import { FC } from "react";
import { AttendanceListItem } from "@/types";
import { getHSLColor } from "@/lib/utils";
import { AttendanceController } from "./controller";

type ListItemProps = {
  item: Omit<AttendanceListItem, "id" & { id?: number }>;
  index: number;
  editRecordStatus?: (
    status: "present" | "absent" | "justified",
    index: number
  ) => void;
};
const ListItem: FC<ListItemProps> = ({ item, index, editRecordStatus }) => {
  return (
    <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
      <List.Item.Meta
        title={
          <Typography.Text>
            {item.student.user.first_name} {item.student.user.last_name}{" "}
            {item.student.user.surname}
          </Typography.Text>
        }
        description={
          <Flex justify="space-between" align="center">
            <Typography.Text type="secondary">
              {item.student.user.matricule.padStart(6, "0")}
            </Typography.Text>
            <AttendanceController
              record={item}
              index={index}
              editRecordStatus={editRecordStatus!}
            />
          </Flex>
        }
      />
    </List.Item>
  );
};

type ListAttendanceProps = {
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[];
  editRecordStatus?: (
    status: "present" | "absent" | "justified",
    index: number
  ) => void;
};

export const ListAttendance: FC<ListAttendanceProps> = ({
  items,
  editRecordStatus,
}) => {
  return (
    <List
      header={
        <Flex justify="space-between">
          <Typography.Text strong>Étudiant</Typography.Text>
          <Typography.Text strong>Statut</Typography.Text>
        </Flex>
      }
      dataSource={items}
      renderItem={(item, index) => (
        <ListItem
          key={index}
          index={index}
          item={item}
          editRecordStatus={editRecordStatus}
        />
      )}
      // columns={[
      //   {
      //     title: "Photo",
      //     dataIndex: "avatar",
      //     key: "avatar",
      //     render: (_, record, __) => (
      //       <Avatar
      //         style={{
      //           backgroundColor: getHSLColor(
      //             `${record.student.year_enrollment.user.first_name} ${record.student.year_enrollment.user.last_name} ${record.student.year_enrollment.user.surname}`
      //           ),
      //         }}
      //       >
      //         {record.student.year_enrollment.user.first_name
      //           ?.charAt(0)
      //           .toUpperCase()}
      //         {record.student.year_enrollment.user.last_name
      //           ?.charAt(0)
      //           .toUpperCase()}
      //       </Avatar>
      //     ),
      //     width: 58,
      //     align: "center",
      //   },
      //   {
      //     title: "Matricule",
      //     dataIndex: "matricule",
      //     key: "matricule",
      //     width: 92,
      //     render: (_, record, __) =>
      //       record.student.year_enrollment.user.matricule.padStart(6, "0"),
      //     align: "center",
      //   },
      //   {
      //     title: "Noms",
      //     dataIndex: "available_course",
      //     key: "available_course",
      //     render: (_, record) => (
      //       <>
      //         {record.student.year_enrollment.user.first_name}{" "}
      //         {record.student.year_enrollment.user.last_name}{" "}
      //         {record.student.year_enrollment.user.surname}
      //       </>
      //     ),
      //   },
      //   {
      //     title: "Status",
      //     key: "actions",
      //     render: (_, record, index) => (
      //       <AttendanceController
      //         record={record}
      //         index={index}
      //         editRecordStatus={editRecordStatus!}
      //       />
      //     ),
      //   },
      // ]}
      // rowKey="id"
      // rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
      pagination={false}
    />
  );
};
