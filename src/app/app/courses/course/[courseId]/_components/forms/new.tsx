"use client";

import { FC, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Drawer,
  Flex,
  Form,
  message,
  Modal,
  Row,
  Space,
  theme,
  DatePicker,
  Tag,
  TimePicker,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { AttendanceListItem, CourseEnrollment, TaughtCourse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAttendanceList,
  getAttendanceAbsentCount,
  getAttendanceItemsFromCourseEnrollments,
  getAttendancePresentCount,
} from "@/lib/api";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { ListAttendance } from "./list";
import { useSessionStore } from "@/store";

type NewAttendanceListFormProps = {
  course?: TaughtCourse;
  courseEnrollements?: CourseEnrollment[];
};

export const NewAttendanceListForm: FC<NewAttendanceListFormProps> = ({
  course,
  courseEnrollements,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { courseId } = useParams();
  const [newAttendance, setNewAttendance] = useQueryState(
    "new_attendance",
    parseAsBoolean.withDefault(false)
  );
  const [cancel, setCancel] = useState<boolean>(false);
  const [attendanceItems, setAttendanceItems] = useState<
    Omit<AttendanceListItem, "id" & { id?: number }>[]
  >([]);
  const queryClient = useQueryClient();

  const { user } = useSessionStore();

  const onClose = () => {
    setNewAttendance(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAttendanceList,
  });

  const editAttendanceItemStatus = (
    status: "present" | "absent" | "justified",
    index: number
  ) => {
    const updatedItems = [...attendanceItems];
    const item = attendanceItems?.[index];
    if (course) {
      updatedItems[index] = {
        ...item,
        status: status,
      };
      setAttendanceItems(updatedItems);
    }
  };

  const onFinish = (values: any) => {
    mutateAsync(
      {
        ...values,
        course_id: Number(courseId),
        student_attendance_status: attendanceItems.map((item) => ({
          ...item,
          student: item.student.id,
        })),
        verified_by_user_id: user?.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["attendances-lists", courseId],
          });
          messageApi.success("Liste de présence créée avec succès !");
          setNewAttendance(false);
          form.resetFields();
          setAttendanceItems(getAttendanceItemsFromCourseEnrollments(courseEnrollements!));
        },
        onError: () => {
          messageApi.error(
            "Erreur lors de la création de la liste de présence."
          );
        },
      }
    );
  };

  useEffect(() => {
    if (courseEnrollements && course) {
      setAttendanceItems(
        getAttendanceItemsFromCourseEnrollments(courseEnrollements!)
      );
    }
  }, [courseEnrollements, course, form]);

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        style={{ boxShadow: "none" }}
        variant="dashed"
        title="Créer une nouvelle liste de présence"
        onClick={() => setNewAttendance(true)}
      >
        Faire l&apos;appel
      </Button>
      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Nouvelle liste de présence"
        onClose={onClose}
        open={newAttendance}
        closable={false}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => setCancel(true)}
              icon={<CloseOutlined />}
              type="text"
            />
            <Modal
              title="Annuler la création"
              open={cancel}
              onOk={() => {
                setNewAttendance(false);
                form.resetFields();
                setCancel(false);
                setAttendanceItems([]);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la création de cette liste de présence ?"
                description="Toutes les informations saisies seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
        footer={
          <Flex justify="space-between" align="center">
            <Form
              form={form}
              name="form_new-attendance-list"
              initialValues={{
                date: dayjs(),
              }}
              onFinish={onFinish}
              disabled={isPending}
              layout="horizontal"
              style={{ width: "100%" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label="Date de la séance"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez renseigner la date.",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      placeholder="DD/MM/YYYY"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="time"
                    label="Heure"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez renseigner l'heure.",
                      },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      style={{ width: "100%" }}
                      placeholder="HH:mm"
                    />
                  </Form.Item>
                </Col>
                
              </Row>
              <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isPending}
                      style={{ boxShadow: "none" }}
                      block
                    >
                      Sauvegarder
                    </Button>
                  </Form.Item>
            </Form>
          </Flex>
        }
      >
        <div style={{ maxWidth: 1400, margin: "auto" }}>
          <Alert
            type="info"
            icon={<BulbOutlined />}
            message="Instructions"
            description={
              <>
                <div>
                  - Indiquez la date, l&apos;heure et marquez avec précision les
                  étudiants présents et absents
                </div>
                <div>
                  - Présent ={" "}
                  <Tag
                    color="success"
                    icon={<CheckCircleOutlined />}
                    bordered={false}
                  />{" "}
                  Absent ={" "}
                  <Tag
                    color="red"
                    icon={<CloseCircleOutlined />}
                    bordered={false}
                  />
                 
                </div>
                <div>- Puis sauvegarder</div>
              </>
            }
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
          <Space style={{ marginBottom: 16 }} wrap={true}>
            <Tag color="success">
              {getAttendancePresentCount(attendanceItems)} Présence (s)
            </Tag>
            <Tag color="red">
              {getAttendanceAbsentCount(attendanceItems)} Absence (s)
            </Tag>
          </Space>

          <ListAttendance
            items={attendanceItems}
            editRecordStatus={editAttendanceItemStatus}
          />
        </div>
      </Drawer>
    </>
  );
};
