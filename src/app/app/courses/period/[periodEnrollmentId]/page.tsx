"use client";

import { Palette } from "@/components/palette";
import {
  getApplicationStatusAlertType,
  getApplicationStatusName,
  getCourseEnrollments,
  getPeriodEnrollment,
  getTaughtCoursesByDepartmentAndPeriod,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { CourseEnrollment, PeriodEnrollment, TaughtCourse } from "@/types";
import {
  DownOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Layout,
  List,
  Skeleton,
  Space,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { ConfirmStudentCourseRegistrationForm } from "./forms/enrollToCourse";
import { UnregisterStudentCourseForm } from "./forms/unregisterToCourse";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { MyCoursesList } from "./lists/my-courses";
import { ScheduledCoursesList } from "./lists/scheduled-courses";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum(["my_courses", "scheduled_courses"]).withDefault(
      "my_courses"
    )
  );
  const { periodEnrollmentId } = useParams();

  const {
    data: periodEnrollment,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["period_enrollment", periodEnrollmentId],
    queryFn: ({ queryKey }) => getPeriodEnrollment(Number(queryKey[1])),
    enabled: !!periodEnrollmentId,
  });

  const {
    data: courses,
    isPending: isPendingCourses,
    isError: isErrorCourses,
  } = useQuery({
    queryKey: [
      "taught_courses",
      `${periodEnrollment?.year_enrollment?.academic_year.id}`,
      periodEnrollment?.year_enrollment?.departement.id,
      periodEnrollment?.period.id,
    ],
    queryFn: ({ queryKey }) =>
      getTaughtCoursesByDepartmentAndPeriod(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled:
      !!periodEnrollment?.year_enrollment?.academic_year.id &&
      !!periodEnrollment?.year_enrollment.departement.id &&
      !!periodEnrollment?.period.id,
  });

  const {
    data: courseEnrollments,
    isPending: isPendingCourseEnrollments,
    isError: isErrorCourseEnrollments,
  } = useQuery({
    queryKey: ["course_enrollments"],
    queryFn: getCourseEnrollments,
  });

  const getOpenedCourses = () => {
    const openedCourses = courses?.filter(
      (course) => course.status === "progress" || course.status === "finished"
    );
    return openedCourses;
  };

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <Space>
            {!isPending || !isPendingCourses ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Cours / {periodEnrollment?.period?.name}
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card loading={isPending || isPendingCourses}>
          <Tabs
            activeKey={tab}
            defaultActiveKey={tab}
            onChange={(key) =>
              setTab(key as "my_courses" | "scheduled_courses" | null)
            }
            items={[
              {
                key: "my_courses",
                label: "Mes cours",
                children: <MyCoursesList courses={courseEnrollments} />,
              },
              {
                key: "scheduled_courses",
                label: "Cours programmés",
                children: (
                  <ScheduledCoursesList
                    taughtCourses={getOpenedCourses()}
                    periodEnrollment={periodEnrollment}
                    courseEnrollments={courseEnrollments}
                  />
                ),
              },
            ]}
          />
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: " 24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>
    </Layout>
  );
}
