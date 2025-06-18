"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import {
  getTaughtCourses,
  getTeacher,
  getYearEnrollment,
  getYearProgressPercent,
  getYears,
} from "@/lib/api";
import { getMaritalStatusName, percentageFormatter } from "@/lib/utils";
import { useSessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Layout,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } = useSessionStore();
  const {yid} = useYid();
    const router = useRouter();

  const {
    data: teacher,
    isPending: isPendingTeacher,
    isError: isErrorTeacher,
  } = useQuery({
    queryKey: ["teacher"],
    queryFn: getTeacher,
    enabled: !!user?.id,
  });

   const {
      data: years,
      isPending:isPendingYears,
      isError:isErrorYears,
    } = useQuery({
      queryKey: ["years"],
      queryFn: getYears,
    });


   const {
      data: courses,
      isPending: isPendingCourses,
      isError: isErrorCourses,
    } = useQuery({
      queryKey: ["courses", `${yid}`],
      queryFn: ({ queryKey }) => getTaughtCourses(Number(queryKey[1])),
      enabled: !!yid,
    });

    const getCurrentYear=()=>{
      return years?.find(y=>y.id===yid)
    }

  if (isErrorTeacher) {
    return <DataFetchErrorResult />;
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
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Tableau de bord
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>{/* <Palette /> */}</Space>
        </Layout.Header>
        <Flex vertical={true} gap={24}>
          <Row
            gutter={[
              { xs: 16, sm: 18, md: 24 },
              { xs: 16, sm: 18, md: 24 },
            ]}
          >
            <Col xs={24} md={18}>
              <Row
                gutter={[
                  { xs: 16, sm: 18, md: 24 },
                  { xs: 16, sm: 18, md: 24 },
                ]}
              >
                 <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      loading={isPendingYears}
                      title="Année"
                     value={getCurrentYear()?.name || ""}
                    />
                  </Card>
                </Col>
                 <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Flex justify="space-between" align="flex-end"><Statistic
                      loading={isPendingCourses}
                      title="Mes cours"
                      value={courses?.length||0}
                     
                    />
                    <Button
                      type="link"
                      onClick={() => router.push("/app/courses")}>
                      Voir les cours
                      </Button>
                    </Flex>
                  </Card>
                </Col>
                 <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      loading={isPendingTeacher}
                      title="Mon titre"
                      value={teacher?.academic_title || "N/A"}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={6}>
              <Card loading={isPendingTeacher}>
                <Descriptions
                  extra={<Button type="link" onClick={() => router.push("/app/profile")}>Gérer</Button>}
                  title="Autres informations"
                  column={1}
                  items={[
                    {
                      key: "education_level",
                      label: "Niveau d'éducation",
                      children: teacher?.education_level || "",
                    },
                    {
                      key: "field_of_study",
                      label: "Domaine d'étude",
                      children: teacher?.field_of_study || "",
                    },
                    {
                      key: "academic_title",
                      label: "Titre académique",
                      children: teacher?.academic_title || "",
                    },
                    {
                      key: "academic_grade",
                      label: "Grade académique",
                      children: teacher?.academic_grade || "",
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Flex>
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
