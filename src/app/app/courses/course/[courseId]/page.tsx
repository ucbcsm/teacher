"use client";

import { Palette } from "@/components/palette";
import { getPeriodEnrollments, getTaughtCours } from "@/lib/api";
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
import { StudentCourseAttendances } from "./_components/attendances";
import { CourseOverview } from "./_components/overview";
import { StudentCourseEvaluations } from "./_components/evaluation";

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
      "course-evaluation",
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
    data: periodEnrollments,
    isPending: isPendingPeriodEnrollements,
    isError: isErrorPeriodEnrollments,
  } = useQuery({
    queryKey: ["period_enrollments"],
    queryFn: getPeriodEnrollments,
  });

  const checkPeriodEnrollmentInEnrollments = () => {
    const periodEnrollement = periodEnrollments?.find(
      (p) => p.period.id === course?.period?.id
    );

    return periodEnrollement;
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
            {!isPending || !isPendingPeriodEnrollements ? (
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
        <Card loading={isPending || isPendingPeriodEnrollements}>
          <Tabs
            activeKey={tab}
            defaultActiveKey={tab}
            onChange={(key) =>
              setTab(
                key as
                  | "overview"
                  | "attendances"
                  | "assessments"
                  | "course-evaluation"
              )
            }
            items={[
              {
                key: "overview",
                label: "Aperçu",
                children: (
                  <>
                    <CourseOverview course={course} />
                  </>
                ),
              },
              {
                key: "attendances",
                label: "Présences",
                children: (
                  <>
                    <StudentCourseAttendances
                      taughtCourse={course!}
                      periodEnrollment={checkPeriodEnrollmentInEnrollments()}
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
                key: `course-evaluation`,
                label: "Évaluation",
                children: (
                  <>
                    <StudentCourseEvaluations />
                  </>
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
