"use client";

import React from "react";
import { Button, Card, Layout, Result, Space, theme, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { Palette } from "@/components/palette";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
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
              Règlement d'Ordre Intérieur (ROI)
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card>
          <Result
            className="max-w-3xl mx-auto"
            icon={<FileTextOutlined style={{ color: "#4096ff" }} />}
            title="Règlement d'Ordre Intérieur"
            subTitle={
              <>
                Le règlement d'ordre intérieur définit les droits, devoirs et
                comportements attendus de chaque membre de la communauté
                académique.
                <br />
                <br />
                Il vise à garantir un climat de respect, d'intégrité et de
                discipline, essentiels au bon fonctionnement de l'institution.
                <ul
                  style={{
                    textAlign: "left",
                    display: "inline-block",
                    margin: 0,
                  }}
                >
                  <li>
                    Respect mutuel entre étudiants, enseignants et personnel
                    administratif.
                  </li>
                  <li>Respect des horaires et des lieux d'apprentissage.</li>
                  <li>
                    Interdiction de toute forme de fraude, triche ou violence.
                  </li>
                  <li>
                    Utilisation responsable des ressources et équipements
                    scolaires.
                  </li>
                </ul>
                <br />
                Pour une lecture complète du règlement, veuillez consulter le
                document officiel disponible auprès de l'administration.
              </>
            }
            extra={[
              <Button
                color="primary"
                variant="solid"
                key="download"
                icon={<FileTextOutlined />}
                style={{ boxShadow: "none" }}
                target="_blank"
              >
                Consulter le document complet
              </Button>,
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
