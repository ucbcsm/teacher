"use client";
import { FC } from "react";
import {
  Button,
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
  MoreOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  getStudentCourseAttendances,
  getAttendanceStudentStatut,
  getAttendancesListByCourse,
  getAttendanceAbsentCount,
  getAttendancePresentCount,
  getAttendanceJustifiedCount,
} from "@/lib/api";
import dayjs from "dayjs";
import { PeriodEnrollment, TaughtCourse } from "@/types";
import { useParams } from "next/navigation";

type StudentCourseAttendancesProps = {
  taughtCourse?: TaughtCourse;
  periodEnrollment?: PeriodEnrollment;
};

export const StudentCourseAttendances: FC<StudentCourseAttendancesProps> = ({
  taughtCourse,
  periodEnrollment,
}) => {
  const { courseId } = useParams();
  const {
    token: { colorTextDisabled },
  } = theme.useToken();
  const { data, isPending, isError } = useQuery({
    queryKey: ["attendances", `${taughtCourse?.id}`, `${periodEnrollment?.id}`],
    queryFn: ({ queryKey }) =>
      getStudentCourseAttendances(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!taughtCourse?.id && !!periodEnrollment?.id,
  });

  const {
    data: attendances,
    isPending: isPendingAttendances,
    isError: isErrorAttendances,
  } = useQuery({
    queryKey: ["attendances-lists", courseId],
    queryFn: ({ queryKey }) => getAttendancesListByCourse(Number(queryKey[1])),
    enabled: !!courseId,
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
      <Typography.Title level={5}>Listes des présences </Typography.Title>
      <Card variant="borderless">
        <Flex justify="space-between" align="flex-end">
          <Statistic
            loading={isPendingAttendances}
            title="Séances"
            value={attendances?.length || 0}
          />
          <Button type="primary" style={{boxShadow:"none"}}>Faire l&apos;appel</Button>
        </Flex>
      </Card>

      <List
        loading={isPendingAttendances}
        header={
          <Flex justify="space-between">
            <Typography.Text strong>Date</Typography.Text>
            {/* <Typography.Text strong>Statut</Typography.Text> */}
          </Flex>
        }
        dataSource={attendances}
        renderItem={(item) => (
          <List.Item key={item.id} >
            <List.Item.Meta
              title={
                <Space size={2}>
                  <ClockCircleOutlined style={{ color: colorTextDisabled }} />{" "}
                  {dayjs(item.date).format("DD/MM/YYYY")}
                </Space>
              }
              description={
                <Flex justify="space-between">
                  {/* <Typography.Text type="secondary">
                     {item.student_attendance_status.length} Inscrit (s)
                  </Typography.Text> */}
                  <Typography.Text>
                    <Tag
                      color="green"
                      bordered={false}
                      
                    >
                      {getAttendancePresentCount(
                        item.student_attendance_status
                      )}{" "}
                      Présent(s)
                    </Tag>
                    <Tag
                      color="red"
                      bordered={false}
                      style={{ marginRight: 0, }}
                    >
                      {getAttendanceAbsentCount(item.student_attendance_status)}{" "}
                      Absent(s)
                    </Tag>{" "}
                    <Tag
                      color="warning"
                      bordered={false}
                      style={{ marginRight: 0, }}
                    >
                      {getAttendanceJustifiedCount(
                        item.student_attendance_status
                      )}{" "}
                      Justifié (s)
                    </Tag>
                  </Typography.Text>
                </Flex>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
