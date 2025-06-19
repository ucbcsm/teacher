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
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  getAttendancesListByCourse,
  getAttendanceAbsentCount,
  getAttendancePresentCount,
  getHoursTrackings,
  getCumulativeHours,
} from "@/lib/api";
import dayjs from "dayjs";
import {
  AttendanceList,
  CourseEnrollment,
  HourTracking,
  TaughtCourse,
} from "@/types";
import { useParams } from "next/navigation";
import { NewAttendanceListForm } from "./forms/new";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DeleteAttendanceListForm } from "./forms/delete";
import { EditAttendanceListForm } from "./forms/edit";

type ListItemProps = {
  item: HourTracking;
};
const ListItem: FC<ListItemProps> = ({ item }) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <>
      <List.Item
        key={item.id}
        // extra={
        //   <Space>
           
        //   </Space>
        // }
      >
        <List.Item.Meta
          title={
            <Flex justify="space-between" >
            <Space
              size={2}
              onClick={() => {
                setOpenEdit(true);
              }}
            >
              <ClockCircleOutlined style={{ color: colorTextDisabled }} />{" "}
              {dayjs(item.date).format("DD/MM/YYYY")}  
            </Space>
            De {dayjs(item.start_time, "HH:mm").format("HH:mm")} à{" "}
                {dayjs(item.end_time, "HH:mm").format("HH:mm")}
            </Flex>
          }
          description={
            <Flex justify="space-between">
              {/* <Typography.Text type="secondary">
               
              </Typography.Text> */}
              <Space size={1}>
                <Tag
                  color={item.teacher_validation ? "success" : "error"}
                  icon={
                    item.teacher_validation ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                  bordered={false}
                >
                  Ens.
                </Tag>
                <Tag
                  color={item.cp_validation ? "success" : "error"}
                  icon={
                    item.cp_validation ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                  bordered={false}
                  style={{ marginRight: 0 }}
                >
                  CP
                </Tag>
              </Space>
               <Tag color="blue" style={{marginRight:0}} bordered={false}>{item.hours_completed} Heures</Tag>
            </Flex>
          }
        />
      </List.Item>
    </>
  );
};

type CourseHoursTrackingListProps = {
  taughtCourse?: TaughtCourse;
  hours?: HourTracking[];
};

export const CourseHoursTrackingList: FC<CourseHoursTrackingListProps> = ({
  taughtCourse,
  hours,
}) => {
  const { courseId } = useParams();

  //    const { data:hours, isPending:isPendingCourseHoursTracking, isError:isErrorCourseHoursTracking } = useQuery({
  //     queryKey: ["course_hours_tracking", courseId],
  //     queryFn: ({ queryKey }) => getHoursTrackings(Number(queryKey[1])),
  //     enabled: !!courseId,
  //   });

  //   if (isPendingCourseHoursTracking) {
  //     return <DataFetchErrorResult />;
  //   }

  return (
    <>
      <Typography.Title level={5}>Heures prestées </Typography.Title>
      {/* <Card variant="borderless" >
        <Flex justify="space-between" align="flex-end">
          <Statistic
            // loading={isPendingCourseHoursTracking}
            title="Heures prestées"
            value={getCumulativeHours(hours) || 0}
          />
        </Flex>
      </Card> */}

      <List
        // loading={isPendingCourseHoursTracking}
        header={
          <Flex justify="space-between">
            <Typography.Text strong>Date</Typography.Text>
            <Typography.Text strong>Heures</Typography.Text>
          </Flex>
        }
        dataSource={hours}
        renderItem={(item) => <ListItem key={item.id} item={item} />}
        footer={
          <Flex justify="space-between">
            <Typography.Text strong>Totale</Typography.Text>

            <Typography.Text strong>
              {getCumulativeHours(hours) || 0}
            </Typography.Text>
          </Flex>
        }
      />
    </>
  );
};
