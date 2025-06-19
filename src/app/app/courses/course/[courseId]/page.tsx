"use client";

import { Palette } from "@/components/palette";
import { getCourseEnrollments,  getCumulativeHours,  getHoursTrackings,  getTaughtCours } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Form,
  Layout,
  Skeleton,
  Space,
  Tabs,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { StudentCourseGrades } from "./_components/grades";
import { CourseAttendancesList} from "./_components/attendances";
import { CourseOverview } from "./_components/overview";
import { DataFetchErrorResult } from "@/components/errorResult";
import { CourseHoursTrackingList } from "./_components/hours-tracking";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { courseId } = useParams();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum([
      "overview",
      "attendances",
      "assessments",
      "hours-tracking",
    ]).withDefault("overview")
  );

  const {
    data: course,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const {
    data: courseEnrollments,
    isPending: isPendingCourseEnrollements,
    isError: isErrorCourseEnrollments,
  } = useQuery({
    queryKey: ["course_enrollments", courseId],
    queryFn: ({queryKey})=> getCourseEnrollments(Number(queryKey[1])),
    enabled:!!courseId
  });

   const { data:hours, isPending:isPendingCourseHoursTracking, isError:isErrorCourseHoursTracking } = useQuery({
    queryKey: ["course_hours_tracking", courseId],
    queryFn: ({ queryKey }) => getHoursTrackings(Number(queryKey[1])),
    enabled: !!courseId,
  });

  if(isError || isErrorCourseEnrollments){
    return <DataFetchErrorResult/>
  }

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
            {!isPending || !isPendingCourseEnrollements ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Cours / {course?.available_course.name}
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>{/* <Palette /> */}</Space>
        </Layout.Header>
        <Card loading={isPending || isPendingCourseEnrollements}>
          <Tabs
            activeKey={tab}
            defaultActiveKey={tab}
            onChange={(key) =>
              setTab(
                key as
                  | "overview"
                  | "attendances"
                  | "assessments"
                  | "hours-tracking"
              )
            }
            items={[
              {
                key: "overview",
                label: "Aperçu",
                children: (
                  <>
                    <CourseOverview course={course} cumulativeHours={getCumulativeHours(hours)} />
                  </>
                ),
              },
              {
                key: "attendances",
                label: "Présences",
                children: (
                  <>
                    <CourseAttendancesList
                      taughtCourse={course!}
                      courseEnrollments={courseEnrollments}
                    />
                  </>
                ),
              },
              {
                key: `assessments`,
                label: "Notes", // TD/TP & Examens
                children: <StudentCourseGrades />,
              },
              {
                key:"hours-tracking",
                label:"Heures",
                children:<CourseHoursTrackingList taughtCourse={course} hours={hours}/>
              }
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
