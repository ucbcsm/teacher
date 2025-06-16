"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import { getYearEnrollment } from "@/lib/api";
import {
  getHSLColor,
  getMaritalStatusName,
  percentageFormatter,
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
import { EditStudentProfileForm } from "./edit";
import { useRouter } from "next/navigation";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { yid } = useYid();
  const router = useRouter();

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
            {enrollment?.user.avatar ? (
              <Image
                height={100}
                width={100}
                src={enrollment?.user.avatar || ""}
                className=" bg-gray-400 object-cover rounded-full"
                style={{ marginBottom: 16 }}
              />
            ) : (
              <Avatar
                size={100}
                style={{
                  background: getHSLColor(
                    `${enrollment?.user.first_name} ${enrollment?.user.last_name} ${enrollment?.user.surname}`
                  ),
                  marginBottom: 16,
                }}
              >
                {`${enrollment?.user.first_name?.[0]}${enrollment?.user.last_name?.[0]}`}
              </Avatar>
            )}
            <Typography.Title
              level={4}
            >{`${enrollment?.user.first_name} ${enrollment?.user.last_name} ${enrollment?.user.surname}`}</Typography.Title>
            <Typography.Text type="secondary">
              Matr. {enrollment?.user.matricule.padStart(6, "0")}
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
              extra={<EditStudentProfileForm data={enrollment} />}
              title="Identité"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "name",
                  label: "Nom",
                  children: enrollment?.user.first_name || "",
                },
                {
                  key: "postnom",
                  label: "Postnom",
                  children: enrollment?.user.last_name || "",
                },
                {
                  key: "prenom",
                  label: "Prénom",
                  children: enrollment?.user.surname || "",
                },
                {
                  key: "sex",
                  label: "Sexe",
                  children:
                    enrollment?.common_enrollment_infos.gender === "M"
                      ? "Masculin"
                      : "Féminin",
                },
                {
                  key: "lieu_naissance",
                  label: "Lieu de naissance",
                  children:
                    enrollment?.common_enrollment_infos.place_of_birth || "",
                },
                {
                  key: "date_naissance",
                  label: "Date de naissance",
                  children: enrollment?.common_enrollment_infos.date_of_birth
                    ? new Intl.DateTimeFormat("fr", {
                        dateStyle: "long",
                      }).format(
                        new Date(
                          `${enrollment?.common_enrollment_infos.date_of_birth}`
                        )
                      )
                    : "",
                },
                {
                  key: "nationalite",
                  label: "Nationalité",
                  children:
                    enrollment?.common_enrollment_infos.nationality || "",
                },
                {
                  key: "marital_status",
                  label: "État civil",
                  children: getMaritalStatusName(
                    `${enrollment?.common_enrollment_infos.marital_status}`
                  ),
                },
                {
                  key: "physical_ability",
                  label: "Aptitude physique",
                  children:
                    enrollment?.common_enrollment_infos.physical_ability ===
                    "normal"
                      ? "Normale"
                      : "Handicapé",
                },
                {
                  key: "religious_affiliation",
                  label: "Affiliation religieuse",
                  children:
                    enrollment?.common_enrollment_infos.religious_affiliation,
                },
                {
                  key: "spoken_language",
                  label: "Langues parlées",
                  children: enrollment?.common_enrollment_infos.spoken_language,
                },
              ]}
            />
            <Descriptions
              title="Contacts"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "email",
                  label: "Email",
                  children: (
                    <a href={`mailto:${enrollment?.user.email}`}>
                      {enrollment?.user.email || ""}
                    </a>
                  ),
                },
                {
                  key: "telephone1",
                  label: "Téléphone 1",
                  children: (
                    <a
                      href={`tel:${enrollment?.common_enrollment_infos.phone_number_1}`}
                    >
                      {enrollment?.common_enrollment_infos.phone_number_1 || ""}
                    </a>
                  ),
                },
                {
                  key: "telephone2",
                  label: "Téléphone 2",
                  children: (
                    <a
                      href={`tel:${enrollment?.common_enrollment_infos.phone_number_2}`}
                    >
                      {enrollment?.common_enrollment_infos.phone_number_2 || ""}
                    </a>
                  ),
                },
              ]}
            />

            <Descriptions
              title="Origine"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "country_origin",
                  label: "Pays",
                  children:
                    enrollment?.common_enrollment_infos.country_of_origin,
                },
                {
                  key: "province_origin",
                  label: "Province",
                  children:
                    enrollment?.common_enrollment_infos.province_of_origin,
                },
                {
                  key: "city",
                  label: "Ville/Térritoire",
                  children:
                    enrollment?.common_enrollment_infos
                      .territory_or_municipality_of_origin,
                },
                {
                  key: "stranger",
                  label: "Etranger?",
                  children: enrollment?.common_enrollment_infos
                    .is_foreign_registration
                    ? "Oui"
                    : "Non",
                },
              ]}
            />

            <Descriptions
              title="Adresse actuelle"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "ville",
                  label: "Ville",
                  children: enrollment?.common_enrollment_infos.current_city,
                },
                {
                  key: "commune",
                  label: "Commune",
                  children:
                    enrollment?.common_enrollment_infos.current_municipality,
                },
                {
                  key: "adresse",
                  label: "Adresse",
                  children:
                    enrollment?.common_enrollment_infos.current_neighborhood,
                },
              ]}
            />

            <Descriptions
              title="Parents"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "nom_pere",
                  label: "Nom du père",
                  children:
                    enrollment?.common_enrollment_infos.father_name || "",
                },
                {
                  key: "nom_mere",
                  label: "Nom de la mère",
                  children: enrollment?.common_enrollment_infos.mother_name,
                },
                {
                  key: "contact_pere",
                  label: "Contact du père",
                  children: (
                    <a
                      href={`tel:${enrollment?.common_enrollment_infos.father_phone_number}`}
                    >
                      {enrollment?.common_enrollment_infos
                        .father_phone_number || ""}
                    </a>
                  ),
                },
                {
                  key: "contact_mere",
                  label: "Contact de la mère",
                  children: (
                    <a
                      href={`tel:${enrollment?.common_enrollment_infos.mother_phone_number}`}
                    >
                      {enrollment?.common_enrollment_infos
                        .mother_phone_number || ""}
                    </a>
                  ),
                },
              ]}
            />

            <Descriptions
              title="Études secondaires"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "school",
                  label: "Ecole",
                  children:
                    enrollment?.common_enrollment_infos
                      .name_of_secondary_school || "",
                },
                {
                  key: "option_section",
                  label: "Option/Section",
                  children:
                    enrollment?.common_enrollment_infos.section_followed || "",
                },
                {
                  key: "year_of_diploma_obtained",
                  label: "Année d'obtention du diplôme",
                  children:
                    enrollment?.common_enrollment_infos
                      .year_of_diploma_obtained,
                },
                {
                  key: "diploma_number",
                  label: "Numèro du diplome",
                  children:
                    enrollment?.common_enrollment_infos.diploma_number || "",
                },
                {
                  key: "diploma_percent",
                  label: "Pourcentage du diplome",
                  children: percentageFormatter(
                    Number(
                      enrollment?.common_enrollment_infos.diploma_percentage
                    )
                  ),
                },
                {
                  key: "country",
                  label: "Pays",
                  children:
                    enrollment?.common_enrollment_infos
                      .country_of_secondary_school || "",
                },
                {
                  key: "province",
                  label: "Province",
                  children:
                    enrollment?.common_enrollment_infos
                      .province_of_secondary_school,
                },
                {
                  key: "city",
                  label: "Ville/Térritoire",
                  children:
                    enrollment?.common_enrollment_infos
                      .territory_or_municipality_of_school,
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
