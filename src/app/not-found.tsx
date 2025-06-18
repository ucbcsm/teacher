"use client";
import { Palette } from "@/components/palette";
import { Button, Layout, Result, Space, Typography } from "antd";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Content style={{ padding: "50px" }}>
        <Result
          title="Non trouvé"
          subTitle="Impossible de trouver la ressource demandée"
          status="404"
          extra={
            <Link href="/app">
              <Button type="primary" style={{ boxShadow: "none" }}>
                Retour à l&apos;accueil
              </Button>
            </Link>
          }
        />
      </Layout.Content>
      <Layout.Footer
        style={{
          display: "flex",
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
    </Layout>
  );
}

