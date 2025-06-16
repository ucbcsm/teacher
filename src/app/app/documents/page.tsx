"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import { getYearEnrollment } from "@/lib/api";
import { FileOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Checkbox,
  Layout,
  List,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";

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

  if (isError) {
    <DataFetchErrorResult />;
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
              Eléments du dossier
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Palette /> */}
          </Space>
        </Layout.Header>
        <Card loading={isPending}>
          <List
            dataSource={
              enrollment?.common_enrollment_infos.application_documents
            }
            renderItem={(item) => (
              <List.Item
                key={item.id}
                extra={
                  <Space>
                    <Button
                      type="link"
                      icon={<UploadOutlined />}
                      title="Téléverser le document"
                    />
                    <Tag
                      // color={color}
                      bordered={false}
                      style={{ borderRadius: 10 }}
                    >
                      {item.status}
                    </Tag>
                  </Space>
                }
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <FileOutlined /> {item.required_document?.title}
                    </Space>
                  }
                  description={
                    <Space>
                      <Typography.Text type="secondary">
                        En dure:
                      </Typography.Text>
                      <Checkbox checked={item.exist} disabled />

                      <Typography.Text type="secondary">
                        Eléctronique:
                      </Typography.Text>
                      <Checkbox
                        checked={item.file_url ? true : false}
                        disabled
                      />
                    </Space>
                  }
                />
              </List.Item>
            )}
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
