"use client";

import { Palette } from "@/components/palette";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Layout,
  List,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import { parseAsStringEnum, useQueryState } from "nuqs";
import TransactionList from "./trans/list";
import { FeesList } from "./fees/list";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum(["fees", "trans"]).withDefault("fees")
  );

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
            {/* {!isPendingPeriods ||
                !isPendingPeriodEnrollements ||
                !isPendingYearEnrollment ? ( */}
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Finances
            </Typography.Title>
            {/* ) : (
                   <Form>
                    <Skeleton.Input active />
                  </Form>
                 )} */}
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Palette /> */}
          </Space>
        </Layout.Header>
        <Card
        // loading={
        //   isPendingPeriods ||
        //   isPendingPeriodEnrollements ||
        //   isPendingYearEnrollment
        // }
        >
          <Tabs
            activeKey={tab}
            defaultActiveKey={tab}
            onChange={(key) => setTab(key as "fees" | "trans")}
            items={[
              {
                key: "fees",
                label: " Frais à payer",
                children: (
                  <>
                    <FeesList />
                  </>
                ),
              },
              {
                key: "trans",
                label: "Transactions des paiements",
                children: (
                  <>
                    <TransactionList />
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
