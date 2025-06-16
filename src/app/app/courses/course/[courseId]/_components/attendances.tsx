"use client";
import { FC } from "react";
import {
  Card,
  Flex,
  List,
  Progress,
  Space,
  Statistic,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  getStudentCourseAttendances,
  getAttendanceStudentStatut,
} from "@/lib/api";
import dayjs from "dayjs";
import { PeriodEnrollment, TaughtCourse } from "@/types";

type StudentCourseAttendancesProps = {
  taughtCourse?: TaughtCourse;
  periodEnrollment?: PeriodEnrollment;
};

export const StudentCourseAttendances: FC<StudentCourseAttendancesProps> = ({
  taughtCourse,
  periodEnrollment,
}) => {
  const {
    token: { colorTextDisabled},
  } = theme.useToken();
  const { data, isPending, isError } = useQuery({
    queryKey: ["attendances", `${taughtCourse?.id}`, `${periodEnrollment?.id}`],
    queryFn: ({ queryKey }) =>
      getStudentCourseAttendances(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!taughtCourse?.id && !!periodEnrollment?.id,
  });

  const getPresentsCount = () => {
    return (
      data?.filter(
        (item) => item.student_attendance_status[0].status === "present"
      ).length || 0
    );
  };

  const getAbsentsCount = () => {
    return (
      data?.filter(
        (item) => item.student_attendance_status[0].status !== "present"
      ).length || 0
    );
  };

  const getPresentsPercent = () => {
    return data?.length! > 0
      ? Math.round((getPresentsCount() / data?.length!) * 100)
      : 0;
  };

  return (
    <>
      <Typography.Title level={5}>Mes présences au cours </Typography.Title>
      <Card variant="borderless">
        <div className=" ">
          <Statistic
            loading={isPending}
            title={
              <>
                Assiduité: {getPresentsPercent()}% ( {getPresentsCount()} présences sur {data?.length || 0} séances)
              </>
            }
            valueRender={() => (
              <Progress
                percent={getPresentsPercent()}
                status={
                  getPresentsPercent() >= 75
                    ? "success"
                    : getPresentsPercent() >= 50
                    ? "active"
                    : "exception"
                }
                showInfo
              />
            )}
          />
        </div>
      </Card>

      <List
        loading={isPending}
        header={
          <Flex justify="space-between">
            <Typography.Text strong>Date</Typography.Text>
            <Typography.Text strong>Statut</Typography.Text>
          </Flex>
        }
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            extra={
              <Space>
                {item.student_attendance_status[0].status === "present" ? (
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                ) : (
                  <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                )}
                <Tag
                  color={
                    item.student_attendance_status[0].status === "present"
                      ? "green"
                      : "red"
                  }
                  bordered={false}
                  style={{ marginRight: 0 }}
                >
                  {getAttendanceStudentStatut(
                    item.student_attendance_status[0].status
                  )}
                </Tag>
              </Space>
            }
          >
            <List.Item.Meta
              title={
                <Space size={2}>
                  <ClockCircleOutlined style={{ color: colorTextDisabled }} />{" "}
                  {dayjs(item.date).format("DD/MM/YYYY")}
                </Space>
              }
              // description={
              //   <Space size={2}>
              //     <Typography.Text strong type="secondary">
              //       Séance:
              //     </Typography.Text>{" "}
              //     <Tag bordered={false}>{item.session}</Tag>
              //   </Space>
              // }
            />
          </List.Item>
        )}
        footer={
          <Flex justify="space-between">
            <Typography.Text strong>Total</Typography.Text>

            <Typography.Text>
              <Tag color="green" bordered={false} style={{fontWeight:"bold"}}>
                {getPresentsCount()} Présent(s)
              </Tag>
              <Tag color="red" bordered={false} style={{marginRight:0, fontWeight:"bold"}}>
                {getAbsentsCount()} Absent(s)
              </Tag>
            </Typography.Text>
          </Flex>
        }
      />
    </>
  );
};
