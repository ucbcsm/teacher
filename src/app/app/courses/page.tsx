"use client";

import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import {
  getApplicationStatusAlertType,
  getApplicationStatusName,
  getPeriodEnrollments,
  getPeriodsByYear,
  getYearEnrollment,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { Enrollment, Period, PeriodEnrollment } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Layout,
  List,
  Skeleton,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { UnregisterStudentPeriodForm } from "./forms/unregisterToPeriod";
import { ConfirmStudentPeriodRegistrationForm } from "./forms/enrollToPeriod";
import { EyeOutlined, MoreOutlined } from "@ant-design/icons";

type PeriodListItemProps = {
  item: Period;
  checkPeriodInEnrollments?: PeriodEnrollment;
  yearEnrollment?: Enrollment;
};

const PeriodListItem: FC<PeriodListItemProps> = ({
  item,
  checkPeriodInEnrollments,
  yearEnrollment,
}) => {
  const router = useRouter();
  const [openEnrollment, setOpenEnrollment] = useState<boolean>(false);
  const [openUnregister, setOpenUnregister] = useState<boolean>(false);

  return (
    <>
      <ConfirmStudentPeriodRegistrationForm
        open={openEnrollment}
        setOpen={setOpenEnrollment}
        period={item}
        yearEnrollment={yearEnrollment}
      />
      <UnregisterStudentPeriodForm
        open={openUnregister}
        setOpen={setOpenUnregister}
        periodEnrollment={checkPeriodInEnrollments}
      />
      <List.Item
        extra={
          <Space>
            {checkPeriodInEnrollments?.status === "validated" && (
              <Button
                type="link"
                style={{ boxShadow: "none" }}
                onClick={() => router.push(`/app/courses/period/${checkPeriodInEnrollments.id}`)}
                title="Voir les cours"
                icon={<EyeOutlined/>}
              />
              
            )}
            {!checkPeriodInEnrollments
              ? item.status !== "finished" && (
                  <Button
                    color="primary"
                    variant="dashed"
                    style={{ boxShadow: "none" }}
                    onClick={() => setOpenEnrollment(true)}
                  >
                    S'inscrire
                  </Button>
                )
              : item.status !== "finished" && (
                  <Dropdown
                    menu={{
                      items: [
                        { key: "unregister", label: " Se désinscrire", danger: true },
                      ],
                      onClick: ({ key }) => {
                        if (key==="unregister") {
                          setOpenUnregister(true);
                        }
                      },
                    }}
                  >
                    <Button
                      icon={<MoreOutlined />}
                      type="text"
                      style={{ boxShadow: "none" }}
                    />
                  </Dropdown>
                )}
          </Space>
        }
      >
        <List.Item.Meta
          title={
            <span  onClick={() => router.push(`/app/courses/period/${checkPeriodInEnrollments?.id}`)}>
              {item.name} ({item.acronym})
            </span>
          }         
          description={
            checkPeriodInEnrollments ? (
              <Space>
                <Typography.Text type="secondary">
                  Votre inscription est:
                </Typography.Text>
                <Tag
                  color={getApplicationStatusAlertType(
                    checkPeriodInEnrollments.status
                  )}
                  bordered={false}
                >
                  {getApplicationStatusName(checkPeriodInEnrollments.status)}
                </Tag>
              </Space>
            ) : (
              <Space>
                <Typography.Text type="secondary">
                  Les inscriptions sont:
                </Typography.Text>
                <Tag color={getYearStatusColor(item.status)} bordered={false}>
                  {getYearStatusName(item.status)}
                </Tag>
              </Space>
            )
          }
        />
      </List.Item>
    </>
  );
};

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { yid } = useYid();

  const {
    data: yearEnrollment,
    isPending: isPendingYearEnrollment,
    isError: isErrorYearEnrollment,
  } = useQuery({
    queryKey: ["enrollment", `${yid}`],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!yid,
  });

  const {
    data: periods,
    isPending: isPendingPeriods,
    isError: isErrorPeriods,
  } = useQuery({
    queryKey: ["periods", `${yearEnrollment?.academic_year.id}`],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!yearEnrollment?.academic_year.id,
  });

  const {
    data: periodEnrollments,
    isPending: isPendingPeriodEnrollements,
    isError: isErrorPeriodEnrollments,
  } = useQuery({
    queryKey: ["period_enrollments"],
    queryFn: getPeriodEnrollments,
  });

  const checkPeriodInEnrollments = (periodId: number) => {
    const periodEnrollement = periodEnrollments?.find(
      (p) => p.period.id === periodId
    );

    return periodEnrollement;
  };

  const getOpenedPeriods = () => {
    const openedPeriods = periods?.filter(
      (period) => period.status === "progress" || period.status === "finished"
    );
    return openedPeriods;
  };

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
            {!isPendingPeriods ||
            !isPendingPeriodEnrollements ||
            !isPendingYearEnrollment ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Cours
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Palette /> */}
          </Space>
        </Layout.Header>
        <Card
          loading={
            isPendingPeriods ||
            isPendingPeriodEnrollements ||
            isPendingYearEnrollment
          }
        >
          <List
            dataSource={getOpenedPeriods()}
            renderItem={(item) => (
              <PeriodListItem
                key={item.id}
                item={item}
                checkPeriodInEnrollments={checkPeriodInEnrollments(item.id)}
                yearEnrollment={yearEnrollment}
              />
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
