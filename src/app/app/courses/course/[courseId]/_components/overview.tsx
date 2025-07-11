"use client";
import React, { FC } from "react";
import {
  Card,
  Col,
  Row,
  Space,
  Tag,
  Typography,
  Divider,
  Avatar,
  Descriptions,
  List,
  Statistic,
  Flex,
  Button,
} from "antd";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
import { TaughtCourse } from "@/types";
import {
  getCourseTypeName,
  getTeachingUnitCategoryName,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { useRouter } from "next/navigation";

type CourseOverviewProps = {
  course?: TaughtCourse;
  cumulativeHours:number
};

export const CourseOverview: FC<CourseOverviewProps> = ({ course,cumulativeHours }) => {
  const router=useRouter()
  if (typeof course === "undefined") {
    return undefined;
  }
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={6}>
        <Card variant="borderless">
              <Flex justify="space-between" align="flex-end">
                <Statistic
                  title="Heures prestées"
                  value={`${cumulativeHours}/${
                    course?.theoretical_hours! + course?.practical_hours!
                  }`}
                />
                <Button type="link" onClick={()=>router.push(`/app/courses/course/${course.id}/?tab=hours-tracking`)}>Voir</Button>
              </Flex>
            </Card>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Space direction="vertical" size="middle">
            <Descriptions
              title={
                <Space>
                  <BookOutlined /> <span>Vue d&apos;ensemble du cours</span>
                </Space>
              }
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
              items={[
                {
                  key: "name",
                  label: "Intitulé",
                  children: course?.available_course.name || "",
                },
                {
                  key: "code",
                  label: "Code",
                  children: course?.available_course.code || "",
                },
                {
                  key: "category",
                  label: "Catégorie",
                  children:
                    getCourseTypeName(course?.available_course.course_type) ||
                    "",
                },
                {
                  key: "credits",
                  label: "Crédits",
                  children: course?.credit_count || "",
                },
                {
                  key: "max",
                  label: "Note maximale",
                  children: course.max_value || "",
                },
                {
                  key: "hours",
                  label: "Heures",
                  children:
                    course?.theoretical_hours! + course?.practical_hours! || "",
                },
                {
                  key: "theoretical_hours",
                  label: "Heures théoriques",
                  children: course?.theoretical_hours || "",
                },
                {
                  key: "practical_hours",
                  label: "Heures pratiques",
                  children: course?.practical_hours || "",
                },
                {
                  key: "teaching_unit",
                  label: "UE",
                  children: `${course.teaching_unit?.name} ${
                    course.teaching_unit?.code &&
                    `(${course.teaching_unit?.code})`
                  }`,
                },
                {
                  key: "teaching_unit_category",
                  label: "Catgorie UE",
                  children: getTeachingUnitCategoryName(
                    course.teaching_unit?.category!
                  ),
                },
                {
                  key: "start_date",
                  label: "Date de début",
                  children: course.start_date
                    ? new Intl.DateTimeFormat("fr", {
                        dateStyle: "long",
                      }).format(new Date(`${course.start_date}`))
                    : "",
                },
                {
                  key: "end_date",
                  label: "Date de fin",
                  children: course.end_date
                    ? new Intl.DateTimeFormat("fr", {
                        dateStyle: "long",
                      }).format(new Date(`${course.end_date}`))
                    : "",
                },
                {
                  key: "status",
                  label: "Statut des inscriptions",
                  children: (
                    <Tag
                      color={getYearStatusColor(course.status!)}
                      bordered={false}
                    >
                      {getYearStatusName(course.status!)}
                    </Tag>
                  ),
                },
              ]}
            />
            <Divider />
            <Descriptions
              //   title="Département"
              column={1}
              items={[
                {
                  key: "name",
                  label: "Département",
                  children: course?.departement.name || "",
                },
                {
                  key: "year",
                  label: "Année",
                  children: course?.academic_year?.name || "",
                },
                {
                  key: "period",
                  label: "Semestre",
                  children: `${course?.period?.name} ${
                    course.period?.acronym && `(${course.period?.acronym})`
                  }`,
                },
                {
                  key: "classroom",
                  label: "Salle de classe",
                  children: `${course?.class_room?.name || ""} ${
                    course?.class_room?.code
                      ? `(${course?.class_room?.code})`
                      : ""
                  }`,
                },
              ]}
            />
            <Divider />
          </Space>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Typography.Text type="secondary">Assistants</Typography.Text>
          <List
            dataSource={course?.assistants!}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: getHSLColor(
                          `${item.user.first_name} ${item.user.last_name} ${item.user.surname}`
                        ),
                      }}
                    >
                      {item.user.first_name?.charAt(0).toUpperCase()}
                      {item.user.last_name?.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={`${item?.user.first_name} ${item?.user.last_name} ${item?.user.surname}`}
                  description={item.academic_title}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
