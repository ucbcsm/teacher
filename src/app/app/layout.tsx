"use client";

import {
  LoadingOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoreOutlined,
  QuestionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Image,
  Layout,
  Menu,
  message,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import { useState } from "react";
import { useYid } from "@/hooks/use-yid";
import { logout } from "@/lib/api/auth";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { removeYid } = useYid();

  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {contextHolder}
      <Layout>
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            borderBottom: `1px solid ${colorBorderSecondary}`,
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          <Link href="/app" style={{ display: "flex", alignItems: "center" }}>
            <div className="flex items-center pr-3">
              <Image
                src="/ucbc-logo.png"
                alt="Logo ucbc"
                width={36}
                height="auto"
                preview={false}
              />
            </div>
            <Typography.Title
              level={5}
              style={{ marginBottom: 0 }}
              className=" hidden sm:block"
            >
              CI-UCBC
            </Typography.Title>
          </Link>
          <Menu
            mode="horizontal"
            theme="light"
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            overflowedIndicator={<MenuOutlined />}
            items={[
              {
                key: `/app`,
                label: "Aperçu",
              },
              {
                key: `/app/courses/`,
                label: "Cours",
              },
              { key: "/app/fees", label: "Frais & Paiements" },
              {
                key: `/app/programs`,
                label: "Programmes d'études",
              },
              {
                key: `/app/documents`,
                label: "Documents",
              },

              {
                key: `/app/discipline`,
                label: "Discipline",
              },
              { key: "/app/terms", label: "Règlement intérieur" },
            ]}
            style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
            onClick={({ key }) => {
              router.push(key);
            }}
          />
          <Space>
            <YearSelector />
            <Dropdown
              menu={{
                items: [
                  {
                    key: "/app/profile",
                    label: "Mon profile",
                    icon: <UserOutlined />,
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    label: "Déconnexion",
                    icon: <LogoutOutlined />,
                  },
                ],
                onClick: async ({ key }) => {
                  if (key === "logout") {
                    setIsLoadingLogout(true);
                    await logout()
                      .then(() => {
                        removeYid();
                        window.location.href = "/auth/login";
                      })
                      .catch((error) => {
                        console.log(
                          "Error",
                          error.response?.status,
                          error.message
                        );
                        messageApi.error(
                          "Ouf, une erreur est survenue, Veuillez réessayer!"
                        );
                        setIsLoadingLogout(false);
                      });
                  } else {
                    router.push(key);
                  }
                },
              }}
              trigger={["hover"]}
            >
              <Button
                disabled={isLoadingLogout}
                type="text"
                icon={<UserOutlined />}
              />
            </Dropdown>
            <Link href="/app/support" className=" hidden sm:block">
              <Button type="text" icon={<QuestionOutlined />}></Button>
            </Link>
            <LanguageSwitcher />
          </Space>
        </Layout.Header>
        <Layout.Content
          style={{
            minHeight: 280,
            // padding: "0 32px 0 32px",
            background: colorBgContainer,
            overflowY: "auto",
            height: "calc(100vh - 64px)",
          }}
        >
          {children}
          <div
            className=""
            style={{
              display: isLoadingLogout ? "flex" : "none",
              flexDirection: "column",
              background: "#fff",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 99,
              height: "100vh",
              width: "100%",
            }}
          >
            <div
              style={{
                width: 440,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
              <Typography.Title
                type="secondary"
                level={3}
                style={{ marginTop: 10 }}
              >
                Déconnexion en cours ...
              </Typography.Title>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </>
  );
}
