"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import {
  getDepartmentPrograms,
  getYearEnrollment,
} from "@/lib/api";
import {
  ReadOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Collapse,
  Empty,
  Flex,
  Layout,
  List,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";


export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { yid } = useYid();

  const {
    data: enrollment,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["enrollment", `${yid}`],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!yid,
  });

  const {
    data: programs,
    isPending: isPendingPrograms,
    isError: isErrorPrograms,
  } = useQuery({
    queryKey: ["programs", `${enrollment?.departement.id}`],
    queryFn: ({ queryKey }) => getDepartmentPrograms(Number(queryKey[1])),
    enabled: !!enrollment?.departement.id,
  });

  const getProgramsAsCollapseItems = () => {
    const items = programs?.map((p) => ({
      key: `${p.id}`,
      label: p.name,
      children: (
        <List
          dataSource={p.courses_of_program}
          renderItem={(item) => (
            <List.Item key={item.id} extra={item.credit_count}>
              <List.Item.Meta
                title={
                  <Space>
                    <ReadOutlined />{" "}
                    {`${item.available_course?.name} (${item.available_course?.code})`}
                  </Space>
                }
                // description={getCourseTypeName(
                //   item.available_course?.course_type!
                // )}
              />
            </List.Item>
          )}
        />
      ),
      extra: p.credit_count,
    }));
    return items;
  };

  const countCredits=()=>{
    return programs?.reduce((total, programme) => total + programme?.credit_count!, 0)||0;
  }

  // if (isPending) {
  //   return <DataFetchPendingSkeleton variant="table" />;
  // }

  if (isError || isPendingPrograms) {
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
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Plan du parcours
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>{/* <Palette /> */}</Space>
        </Layout.Header>
        {/* <Card> */}
        {programs?.length! > 0 ? (
          <Flex vertical gap={24}>
            <Alert
              type="info"
              banner
              showIcon={false}
              message={<Typography.Text strong>{enrollment?.departement.name}</Typography.Text>}
              description={<Space>Cycle: <Tag bordered={false} color="success">{enrollment?.cycle.name}</Tag></Space>}
              action={
                <Space>
                  <Typography.Text strong>{countCredits()}</Typography.Text>
                  <Typography.Text>Crédits</Typography.Text>
                </Space>
              }
            />
            <Collapse items={getProgramsAsCollapseItems()} />
          </Flex>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        {/* </Card> */}
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
