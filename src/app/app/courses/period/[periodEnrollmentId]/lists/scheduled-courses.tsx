"use client";

import { CourseEnrollment, PeriodEnrollment, TaughtCourse } from "@/types";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { ConfirmStudentCourseRegistrationForm } from "../forms/enrollToCourse";
import { UnregisterStudentCourseForm } from "../forms/unregisterToCourse";
import {
  Button,
  Dropdown,
  Input,
  List,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  DownOutlined,
  EyeOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  ReadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getApplicationStatusAlertType,
  getApplicationStatusName,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";

type CourseListItemProps = {
  item: TaughtCourse;
  checkCourseInEnrollments?: CourseEnrollment;
  periodEnrollment?: PeriodEnrollment;
};

const CourseListItem: FC<CourseListItemProps> = ({
  item,
  checkCourseInEnrollments,
  periodEnrollment,
}) => {
  const router = useRouter();
  const [openEnrollment, setOpenEnrollment] = useState<boolean>(false);
  const [openUnregister, setOpenUnregister] = useState<boolean>(false);

  return (
    <>
      <ConfirmStudentCourseRegistrationForm
        open={openEnrollment}
        setOpen={setOpenEnrollment}
        course={item}
        periodEnrollement={periodEnrollment}
      />
      <UnregisterStudentCourseForm
        open={openUnregister}
        setOpen={setOpenUnregister}
        courseEnrollment={checkCourseInEnrollments}
      />
      <List.Item
        extra={
          <Space>
            {/* {checkCourseInEnrollments?.status === "validated" && ( */}
              <Button
                type="link"
                style={{ boxShadow: "none" }}
                onClick={() =>
                  router.push(
                    `/app/courses/course/${item.id}`
                  )
                }
                icon={<EyeOutlined/>}
                title="Voir le cours"
              />
                {/* Voir le cours
              </Button> */}
            {/* )} */}
            {!checkCourseInEnrollments
              ? item.status !== "finished" && (
                  <Button
                    color="primary"
                    variant="dashed"
                    style={{ boxShadow: "none" }}
                    onClick={() => setOpenEnrollment(true)}
                  >
                    S'inscrire
                  </Button>
                )
              : item.status !== "finished" && (
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
            <Space onClick={() =>
                  router.push(
                    `/app/courses/course/${item.id}`
                  )
                }>
              <ReadOutlined />
              {item.available_course.name}{" "}
              <span>({item.available_course.code})</span>
            </Space>
          }
          description={
            checkCourseInEnrollments ? (
              <Space>
                <Typography.Text type="secondary">
                  Votre inscription est:
                </Typography.Text>
                <Tag
                  color={getApplicationStatusAlertType(
                    checkCourseInEnrollments.status!
                  )}
                  bordered={false}
                >
                  {getApplicationStatusName(checkCourseInEnrollments.status!)}
                </Tag>
              </Space>
            ) : (
              <Space>
                <Typography.Text type="secondary">
                  Les inscriptions à ce cours sont:
                </Typography.Text>
                <Tag color={getYearStatusColor(item.status!)} bordered={false}>
                  {getYearStatusName(item.status!)}
                </Tag>
              </Space>
            )
          }
        />
      </List.Item>
    </>
  );
};

type ScheduledCoursesListProps = {
  taughtCourses?: TaughtCourse[];
  courseEnrollments?: CourseEnrollment[];
  periodEnrollment?: PeriodEnrollment;
};
export const ScheduledCoursesList: FC<ScheduledCoursesListProps> = ({
  taughtCourses,
  courseEnrollments,
  periodEnrollment,
}) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();
  const checkCourseInEnrollments = (courseId: number) => {
    const courseEnrollement = courseEnrollments?.find(
      (c) => c.course.id === courseId
    );
    return courseEnrollement;
  };
  return (
    <List
      header={
        <header className="flex pb-3">
          <Space>
            <Input
              placeholder="Rechercher un cours prévu ..."
              variant="borderless"
              prefix={<SearchOutlined style={{ color: colorTextDisabled }} />}
            />
          </Space>
          <div className="flex-1" />
          <Space>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "print",
                    label: "Imprimer",
                    icon: <PrinterOutlined />,
                    title: "Imprimer la liste",
                  },
                  {
                    key: "pdf",
                    label: "PDF",
                    icon: <FilePdfOutlined />,
                    title: "Exporter en PDF",
                  },
                ],
              }}
            >
              <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                Exporter
              </Button>
            </Dropdown>
          </Space>
        </header>
      }
      dataSource={taughtCourses}
      renderItem={(item) => (
        <CourseListItem
          key={item.id}
          item={item}
          checkCourseInEnrollments={checkCourseInEnrollments(item.id)}
          periodEnrollment={periodEnrollment}
        />
      )}
    />
  );
};
