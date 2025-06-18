"use client";

import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import {
  getPeriodsByYear,
  getTaughtCourses,
  getYearEnrollment,
} from "@/lib/api";
import { TaughtCourse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Layout,
  List,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { EyeOutlined, MoreOutlined, ReadOutlined } from "@ant-design/icons";

type CourseListItemProps = {
  item: TaughtCourse;
};

const CourseListItem: FC<CourseListItemProps> = ({ item }) => {
  const router = useRouter();

  return (
    <>
      <List.Item
        extra={
          <Space>
            {/* {checkCourseInEnrollments?.status === "validated" && ( */}
            <Button
              type="link"
              style={{ boxShadow: "none" }}
              onClick={() => router.push(`/app/courses/course/${item.id}`)}
              icon={<EyeOutlined />}
              title="Voir le cours"
            />
            {/* Voir le cours
              </Button> */}
            {/* )} */}

            <Dropdown
              menu={{
                items: [
                  {
                    key: "attendances",
                    label: "Présences",
                  },
                  {
                    key: "assessments",
                    label: "Notes",
                  },
                ],
                onClick: ({ key }) => {
                  router.push(`/app/courses/course/${item.id}/?tab=${key}`);
                },
              }}
            >
              <Button
                icon={<MoreOutlined />}
                type="text"
                style={{ boxShadow: "none" }}
              />
            </Dropdown>
          </Space>
        }
      >
        <List.Item.Meta
          title={
            <Space
              onClick={() => router.push(`/app/courses/course/${item.id}`)}
            >
              <ReadOutlined />
              {item.available_course.name}{" "}
              <span>({item.available_course.code})</span>
            </Space>
          }
          description={item.departement.name}
        />
      </List.Item>
    </>
  );
};

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { yid } = useYid();

  const {
    data: courses,
    isPending: isPendingCourses,
    isError: isErrorCourses,
  } = useQuery({
    queryKey: ["courses", `${yid}`],
    queryFn: ({ queryKey }) => getTaughtCourses(Number(queryKey[1])),
    enabled:!!yid
  });

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
            {!isPendingCourses ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Mes cours
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
        <Card loading={isPendingCourses}>
          <List
            dataSource={courses}
            renderItem={(item) => <CourseListItem key={item.id} item={item} />}
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
