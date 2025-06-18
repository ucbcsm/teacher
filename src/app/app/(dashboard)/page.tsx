"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import { getTeacher, getYearEnrollment, getYearProgressPercent } from "@/lib/api";
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
  const { yid } = useYid();
  const {user}=useSessionStore()

   const {
    data: teacher,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["teacher", `${user?.id}`],
    queryFn: ({ queryKey }) => getTeacher(Number(queryKey[1])),
    enabled: !!user?.id,
  });

  const router = useRouter();

  if (isError) {
    return <DataFetchErrorResult />;
  }

  console.log("USER:", user)

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
          <Space>
            {/* <Palette /> */}
          </Space>
        </Layout.Header>
        <Flex vertical={true} gap={24}>
         <Descriptions/>
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
