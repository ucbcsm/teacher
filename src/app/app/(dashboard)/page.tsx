"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import { getYearEnrollment, getYearProgressPercent } from "@/lib/api";
import { getMaritalStatusName, percentageFormatter } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Layout,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Tableau de bord
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Palette /> */}
          </Space>
        </Layout.Header>
        <Flex vertical={true} gap={24}>
          <Row
            gutter={[
              { xs: 16, sm: 18, md: 24 },
              { xs: 16, sm: 18, md: 24 },
            ]}
          >
            <Col xs={24} md={18}>
              <Row
                gutter={[
                  { xs: 16, sm: 18, md: 24 },
                  { xs: 16, sm: 18, md: 24 },
                ]}
              >
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Flex>
                      <Statistic
                        loading={isPending}
                        title="Année"
                        value={enrollment?.academic_year.name}
                      />
                      {!isPending ? (
                        <Progress
                          type="line"
                          percent={getYearProgressPercent(
                            enrollment?.academic_year.start_date!,
                            enrollment.academic_year.end_date!
                          )}
                          style={{
                            position: "absolute",
                            right: 16,
                            width: 100,
                          }}
                        />
                      ) : (
                        <Skeleton.Input
                          size="small"
                          active
                          style={{
                            position: "absolute",
                            right: 16,
                            width: 100,
                          }}
                        />
                      )}
                    </Flex>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      loading={isPending}
                      title="Promotion actuelle"
                      value={enrollment?.class_year.acronym}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      loading={isPending}
                      title="Matricule"
                      value={enrollment?.user.matricule}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Flex justify="space-between">
                      <Statistic
                        loading={isPending}
                        title="Statut académique"
                        value={
                          enrollment?.status === "enabled" ? "Actif" : "Abandon"
                        }
                      />
                      {!isPending ? (
                        <Progress
                          type="dashboard"
                          size={58}
                          percent={100}
                          status={
                            enrollment?.status === "enabled"
                              ? "success"
                              : "exception"
                          }
                        />
                      ) : (
                        <Skeleton.Avatar size={58} active />
                      )}
                    </Flex>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Flex justify="space-between">
                      <Statistic
                        loading={isPending}
                        title="Frais d'inscription"
                        value={
                          enrollment?.enrollment_fees === "paid"
                            ? "Payé"
                            : "Non payé"
                        }
                      />
                      {!isPending ? (
                        <Progress
                          type="dashboard"
                          percent={100}
                          size={58}
                          status={
                            enrollment?.enrollment_fees === "paid"
                              ? "success"
                              : "exception"
                          }
                        />
                      ) : (
                        <Skeleton.Avatar size={58} active />
                      )}
                    </Flex>
                  </Card>
                </Col>
                {/* <Col span={8}>
            <Card>
              <Statistic
                loading={isPending}
                title="Frais académiques"
                value={`${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(200)} / ${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(500)}`}
              />
            </Card>
          </Col> */}

                {/* <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Résultat S1"
                  value="60%"
                />
               
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Résultat S2"
                  value="62%"
                />
              
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Moyenne générale"
                  value="61%"
                />
              </Flex>
            </Card>
          </Col> */}

                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      loading={isPending}
                      title="Date de validation"
                      value={
                        enrollment?.date_of_enrollment
                          ? `${new Intl.DateTimeFormat("fr", {
                              dateStyle: "long",
                            }).format(
                              new Date(`${enrollment?.date_of_enrollment}`)
                            )}`
                          : ""
                      }
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Typography.Title level={5}>Mon profile</Typography.Title>
                  <Card>
                    <Space direction="vertical" size="large">
                      <Descriptions
                        extra={
                          <Button
                            type="link"
                            style={{ boxShadow: "none" }}
                            onClick={() => router.push("/app/profile")}
                          >
                            Gérer mon compte
                          </Button>
                        }
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
                              enrollment?.common_enrollment_infos
                                .place_of_birth || "",
                          },
                          {
                            key: "date_naissance",
                            label: "Date de naissance",
                            children: enrollment?.common_enrollment_infos
                              .date_of_birth
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
                              enrollment?.common_enrollment_infos.nationality ||
                              "",
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
                              enrollment?.common_enrollment_infos
                                .physical_ability === "normal"
                                ? "Normale"
                                : "Handicapé",
                          },
                          {
                            key: "religious_affiliation",
                            label: "Affiliation religieuse",
                            children:
                              enrollment?.common_enrollment_infos
                                .religious_affiliation,
                          },
                          {
                            key: "spoken_language",
                            label: "Langues parlées",
                            children:
                              enrollment?.common_enrollment_infos
                                .spoken_language,
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
                                {enrollment?.common_enrollment_infos
                                  .phone_number_1 || ""}
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
                                {enrollment?.common_enrollment_infos
                                  .phone_number_2 || ""}
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
                              enrollment?.common_enrollment_infos
                                .country_of_origin,
                          },
                          {
                            key: "province_origin",
                            label: "Province",
                            children:
                              enrollment?.common_enrollment_infos
                                .province_of_origin,
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
                            children:
                              enrollment?.common_enrollment_infos.current_city,
                          },
                          {
                            key: "commune",
                            label: "Commune",
                            children:
                              enrollment?.common_enrollment_infos
                                .current_municipality,
                          },
                          {
                            key: "adresse",
                            label: "Adresse",
                            children:
                              enrollment?.common_enrollment_infos
                                .current_neighborhood,
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
                              enrollment?.common_enrollment_infos.father_name ||
                              "",
                          },
                          {
                            key: "nom_mere",
                            label: "Nom de la mère",
                            children:
                              enrollment?.common_enrollment_infos.mother_name,
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
                              enrollment?.common_enrollment_infos
                                .section_followed || "",
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
                              enrollment?.common_enrollment_infos
                                .diploma_number || "",
                          },
                          {
                            key: "diploma_percent",
                            label: "Pourcentage du diplome",
                            children: percentageFormatter(
                              Number(
                                enrollment?.common_enrollment_infos
                                  .diploma_percentage
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
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={6}>
              <Card loading={isPending}>
                <Descriptions
                  title="Filières"
                  column={1}
                  items={[
                    {
                      key: "cycle",
                      label: "Cycle",
                      children: enrollment?.cycle.name,
                    },
                    {
                      key: "domaine",
                      label: "Domaine",
                      children: enrollment?.field.name || "",
                    },
                    {
                      key: "faculte",
                      label: "Faculté",
                      children: enrollment?.faculty.name || "",
                    },
                    {
                      key: "departement",
                      label: "Département",
                      children: enrollment?.departement.name || "",
                    },

                    {
                      key: "class",
                      label: "Promotion",
                      children: enrollment?.class_year.acronym,
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
          {/* </Card> */}
        </Flex>
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
