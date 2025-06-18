"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import { getTeacher } from "@/lib/api";
import {
  getHSLColor,
  getMaritalStatusName,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  Form,
  Image,
  Layout,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { EditTeacherProfileForm } from "./edit";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { yid } = useYid();
  const { user } = useSessionStore();
  const router = useRouter();

  const {
    data: teacher,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["teacher", `${user?.id}`],
    queryFn: ({ queryKey }) => getTeacher(Number(queryKey[1])),
    enabled: !!user?.id,
  });

  if (isError) {
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
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {/* Mon compte étudiant */}
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>{/* <Palette /> */}</Space>
        </Layout.Header>

        {!isPending ? (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {teacher?.user.avatar ? (
              <Image
                height={100}
                width={100}
                src={teacher?.user.avatar || ""}
                className=" bg-gray-400 object-cover rounded-full"
                style={{ marginBottom: 16 }}
              />
            ) : (
              <Avatar
                size={100}
                style={{
                  background: getHSLColor(
                    `${teacher?.user.first_name} ${teacher?.user.last_name} ${teacher?.user.surname}`
                  ),
                  marginBottom: 16,
                }}
              >
                {`${teacher?.user.first_name?.[0]}${teacher?.user.last_name?.[0]}`}
              </Avatar>
            )}
            <Typography.Title
              level={4}
            >{`${teacher?.user.first_name} ${teacher?.user.last_name} ${teacher?.user.surname}`}</Typography.Title>
            <Typography.Text type="secondary">
              Matr. {teacher?.user.matricule.padStart(6, "0")}
            </Typography.Text>
          </div>
        ) : (
          <Flex vertical align="center" gap={8}>
            <Skeleton.Avatar size={100} active />
            <Skeleton.Input active size="large" />
            <Skeleton.Input active size="small" />
          </Flex>
        )}

        <Card loading={isPending}>
          <Space direction="vertical" size="large">
            <Descriptions
              extra={<EditTeacherProfileForm teacher={teacher} />}
              title="Identité"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "name",
                  label: "Nom",
                  children: teacher?.user.first_name || "",
                },
                {
                  key: "postnom",
                  label: "Postnom",
                  children: teacher?.user.last_name || "",
                },
                {
                  key: "prenom",
                  label: "Prénom",
                  children: teacher?.user.surname || "",
                },
                {
                  key: "sex",
                  label: "Sexe",
                  children: teacher?.gender === "M" ? "Masculin" : "Féminin",
                },
                {
                  key: "lieu_naissance",
                  label: "Lieu de naissance",
                  children: teacher?.place_of_birth || "",
                },
                {
                  key: "date_naissance",
                  label: "Date de naissance",
                  children: teacher?.date_of_birth
                    ? new Intl.DateTimeFormat("fr", {
                        dateStyle: "long",
                      }).format(new Date(`${teacher.date_of_birth}`))
                    : "",
                },
                {
                  key: "nationalite",
                  label: "Nationalité",
                  children: teacher?.nationality || "",
                },
                {
                  key: "marital_status",
                  label: "État civil",
                  children: getMaritalStatusName(`${teacher?.marital_status}`),
                },
                {
                  key: "physical_ability",
                  label: "Aptitude physique",
                  children:
                    teacher?.physical_ability === "normal"
                      ? "Normale"
                      : "Handicapé",
                },
                {
                  key: "religious_affiliation",
                  label: "Affiliation religieuse",
                  children: teacher?.religious_affiliation,
                },
                {
                  key: "email",
                  label: "Email",
                  children: teacher?.user.email || "",
                },
                {
                  key: "phone",
                  label: "Téléphone 1",
                  children: teacher?.phone_number_1 || "",
                },
                {
                  key: "phone",
                  label: "Téléphone 2",
                  children: teacher?.phone_number_2 || "",
                },
              ]}
            />

            <Alert
              showIcon={false}
              type="error"
              description={
                <Descriptions
                  title="Sécurité"
                  items={[
                    {
                      key: "password",
                      label: "Mot de passe",
                      children: "************",
                    },
                  ]}
                />
              }
              action={
                <Button
                  color="danger"
                  variant="solid"
                  onClick={() => router.push(`/auth/reset-password`)}
                >
                  Changer
                </Button>
              }
            />
          </Space>
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
