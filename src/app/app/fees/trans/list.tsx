import React from "react";
import {
  Button,
  Descriptions,
  Flex,
  Input,
  List,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { PrinterOutlined, SearchOutlined } from "@ant-design/icons";

const data = [
  {
    key: "1",
    transactionId: "TXN001",
    feeName: "Frais d'inscription",
    paymentDate: "2023-10-02",
    amount: 50,
    paymentMethod: "Carte bancaire",
    status: "Réussi",
  },
  {
    key: "2",
    transactionId: "TXN002",
    feeName: "Frais de scolarité",
    paymentDate: "2023-11-16",
    amount: 200,
    paymentMethod: "Espèces",
    status: "Échoué",
  },
  {
    key: "3",
    transactionId: "TXN003",
    feeName: "Frais de bibliothèque",
    paymentDate: "2023-12-02",
    amount: 10,
    paymentMethod: "Virement bancaire",
    status: "Réussi",
  },
];

export default function TransactionList() {
  const {
    token: { colorTextSecondary, colorTextDisabled },
  } = theme.useToken();

  return (
    <div>
      <List
        header={
          <header className="flex pb-3">
            <Space>
              <Input
                placeholder="Rechercher une transaction ..."
                variant="borderless"
                prefix={<SearchOutlined style={{ color: colorTextDisabled }} />}
              />
            </Space>
            <div className="flex-1" />
            <Space>
              <Button
                color="primary"
                variant="dashed"
                style={{ boxShadow: "none" }}
              >
                Filtrer
              </Button>
              <Button
                // type="text"
                icon={<PrinterOutlined />}
                style={{ boxShadow: "none" }}
                title="Imprimer"
              />
            </Space>
          </header>
        }
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            extra={
              <Flex vertical align="end">
                {new Intl.NumberFormat("FR", {
                  style: "currency",
                  currency: "USD",
                }).format(item.amount)}
                <Typography.Text
                  type={item.status === "Réussi" ? "success" : "danger"}
                  style={{ marginRight: 0 }}
                >
                  {item.status === "Réussi" ? "Payé" : "Non payé"}
                </Typography.Text>
              </Flex>
            }
          >
            <List.Item.Meta
              title={
                <Space>
                  <Typography.Text strong>
                    ID : {item.transactionId}
                  </Typography.Text>
                  <Tag
                    color={item.status === "Réussi" ? "green" : "red"}
                    bordered={false}
                  >
                    {item.status === "Réussi" ? "Payé" : "Non payé"}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical">
                  <Descriptions
                    column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                    items={[
                      {
                        key: "feeName",
                        label: "Libellé",
                        children: item.feeName,
                        style: { color: colorTextSecondary },
                      },
                      {
                        key: "date",
                        label: "Date",
                        children: new Intl.DateTimeFormat("fr", {
                          dateStyle: "long",
                        }).format(new Date(item.paymentDate)),
                      },
                      {
                        key: "paymentMode",
                        label: "Mode",
                        children: item.paymentMethod,
                      },
                    ]}
                  />
                </Space>
              }
            />
          </List.Item>
        )}
        pagination={{
          pageSize: 25,
          showSizeChanger: true,
          pageSizeOptions: [25, 50, 75, 100],
          size: "small",
        }}
      />
    </div>
  );
}
