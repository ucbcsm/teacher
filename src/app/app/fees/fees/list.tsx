"use client";

import { Avatar, List } from "antd";

export const FeesList = () => {
  return (
    <List
      dataSource={[
        {
          key: "1",
          feeName: "Frais d'inscription",
          amount: 50,
        },
        {
          key: "2",
          feeName: "Frais de scolarité",
          amount: 200,
        },
        {
          key: "3",
          feeName: "Frais de bibliothèque",
          amount: 10,
        },
        {
          key: "4",
          feeName: "Frais de laboratoire",
          amount: 30,
        },
      ]}
      renderItem={(item, index) => (
        <List.Item
          key={item.key}
          extra={`${new Intl.NumberFormat("fr", {
            style: "currency",
            currency: "USD",
          }).format(item.amount)} / ${new Intl.NumberFormat("fr", {
            style: "currency",
            currency: "USD",
          }).format(item.amount)}`}
        >
          <List.Item.Meta
            avatar={<Avatar>{index + 1}</Avatar>}
            title={item.feeName}
            description={"Obligatoire"}
          />
        </List.Item>
      )}
    />
  );
};
