"use client";
import { FC, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  List,
  Skeleton,
  Space,
  Statistic,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  getAttendancesListByCourse,
  getAttendanceAbsentCount,
  getAttendancePresentCount,
} from "@/lib/api";
import dayjs from "dayjs";
import { AttendanceList, CourseEnrollment, TaughtCourse } from "@/types";
import { useParams } from "next/navigation";
import { NewAttendanceListForm } from "./forms/new";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DeleteAttendanceListForm } from "./forms/delete";
import { EditAttendanceListForm } from "./forms/edit";

type ListItemProps = {
  item: AttendanceList;
};
const ListItem: FC<ListItemProps> = ({ item }) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <>
      <EditAttendanceListForm
        attendanceList={item}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteAttendanceListForm
        attendanceList={item}
        open={openDelete}
        setOpen={setOpenDelete}
      />
    
    <List.Item
      key={item.id}
      extra={
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={()=>{setOpenEdit(true)}} />
          <Dropdown
            menu={{
              items: [
                // {
                //   key: "edit",
                //   label: "Modifier",
                //   icon: <EditOutlined />,
                // },
                {
                  key: "delete",
                  label: "Supprimer",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
              onClick: ({ key }) => {
                if (key === "edit") {
                  setOpenEdit(true);
                } else if (key === "delete") {
                  setOpenDelete(true);
                }
              },
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      }
    >
      <List.Item.Meta
        title={
          <Space size={2} onClick={()=>{setOpenEdit(true)}}>
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
              <Tag color="green" bordered={false}>
                {getAttendancePresentCount(item.student_attendance_status)}{" "}
                Présent(s)
              </Tag>
              <Tag color="red" bordered={false} style={{ marginRight: 0 }}>
                {getAttendanceAbsentCount(item.student_attendance_status)}{" "}
                Absent(s)
              </Tag>{" "}
            </Typography.Text>
          </Flex>
        }
      />
    </List.Item>
    </>
  );
};

type CourseAttendancesListProps = {
  taughtCourse?: TaughtCourse;
  courseEnrollments?: CourseEnrollment[];
};

export const CourseAttendancesList: FC<CourseAttendancesListProps> = ({
  taughtCourse,
  courseEnrollments,
}) => {
  const { courseId } = useParams();

  const {
    data: attendances,
    isPending: isPendingAttendances,
    isError: isErrorAttendances,
  } = useQuery({
    queryKey: ["attendances-lists", courseId],
    queryFn: ({ queryKey }) => getAttendancesListByCourse(Number(queryKey[1])),
    enabled: !!courseId,
  });

  if (isErrorAttendances) {
    return <DataFetchErrorResult />;
  }

  return (
    <>
      <Typography.Title level={5}>Listes des présences </Typography.Title>
      <Card variant="borderless" >
        <Flex justify="space-between" align="flex-end">
          <Statistic
            loading={isPendingAttendances}
            title="Séances"
            value={attendances?.length || 0}
          />

          {!isPendingAttendances?<NewAttendanceListForm
            course={taughtCourse}
            courseEnrollements={courseEnrollments}
          />:<Skeleton.Button active/>}
        </Flex>
      </Card>

      <List
        loading={isPendingAttendances}
        header={
          <Flex justify="space-between">
            <Typography.Text strong>Date</Typography.Text>
          </Flex>
        }
        dataSource={attendances}
        renderItem={(item) => <ListItem key={item.id} item={item} />}
      />
    </>
  );
};
