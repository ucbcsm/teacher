"use client";

import { CourseEnrollment } from "@/types";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { UnregisterStudentCourseForm } from "../forms/unregisterToCourse";
import { Button, Dropdown, Input, List, Space, Tag, Typography } from "antd";
import {
  DownOutlined,
  EyeOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  getApplicationStatusAlertType,
  getApplicationStatusName,
} from "@/lib/api";

type CourseListItemProps = {
  item: CourseEnrollment;
};

const CourseListItem: FC<CourseListItemProps> = ({ item }) => {
  const router = useRouter();
  const [openUnregister, setOpenUnregister] = useState<boolean>(false);

  return (
    <>
      <UnregisterStudentCourseForm
        open={openUnregister}
        setOpen={setOpenUnregister}
        courseEnrollment={item}
      />
      <List.Item
        extra={
          <Space>
            {/* {item?.status === "validated" && ( */}
              <Button
                type="link"
                style={{ boxShadow: "none" }}
                onClick={() =>
                  router.push(`/app/courses/course/${item.course.id}`)
                }
                title="Voir le cours"
                icon={<EyeOutlined/>}
              />
               
            {/* )} */}
            {item.status !== "validated" && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "unregister",
                      label: " Se désinscrire",
                      danger: true,
                    },
                  ],
                  onClick: ({ key }) => {
                    if (key === "unregister") {
                      setOpenUnregister(true);
                    }
                  },
                }}
              >
                <Button
                  icon={<MoreOutlined />}
                  type="text"
                  style={{ boxShadow: "none" }}
                />
              </Dropdown>
            )}
          </Space>
        }
      >
        <List.Item.Meta
          title={
            <Space  onClick={() =>
                  router.push(`/app/courses/course/${item.course.id}`)
                }>
              <ReadOutlined />
              {item.course.available_course.name}{" "}
              <span>({item.course.available_course.code})</span>
            </Space>
          }
          description={
            <Space>
              <Typography.Text type="secondary">
                Votre inscription est:
              </Typography.Text>
              <Tag
                color={getApplicationStatusAlertType(item.status!)}
                bordered={false}
              >
                {getApplicationStatusName(item.status!)}
              </Tag>
            </Space>
          }
        />
      </List.Item>
    </>
  );
};

type MyCoursesListProps = {
  courses?: CourseEnrollment[];
};

export const MyCoursesList: FC<MyCoursesListProps> = ({ courses }) => {
  return (
    <List
      dataSource={courses}
      renderItem={(item) => <CourseListItem key={item.id} item={item} />}
    />
  );
};
