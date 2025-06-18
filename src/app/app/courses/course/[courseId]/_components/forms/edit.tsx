"use client";

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Drawer,
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
import {
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { AttendanceList, AttendanceListItem, TaughtCourse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceAbsentCount,
  getAttendancePresentCount,
  updateAttendanceList,
} from "@/lib/api";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { ListAttendance } from "./list";

type EditAttendanceListFormProps = {
  attendanceList: AttendanceList;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditAttendanceListForm: FC<EditAttendanceListFormProps> = ({
  open,
  setOpen,
  attendanceList,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { courseId } = useParams();

  const [cancel, setCancel] = useState<boolean>(false);
  const [attendanceItems, setAttendanceItems] = useState<
    Omit<AttendanceListItem, "id" & { id?: number }>[]
  >([]);

  const queryClient = useQueryClient();

  const onClose = () => {
    setOpen(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateAttendanceList,
  });

  const editAttendanceItemStatus = (
    status: "present" | "absent" | "justified",
    index: number
  ) => {
    const updatedItems = [...attendanceItems];
    const item = attendanceItems?.[index];
    if (item) {
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
        id: attendanceList.id,
        data: {
          ...values,
          course_id: Number(courseId),
          student_attendance_status: attendanceItems.map((item) => ({
            ...item,
            student: item.student.id,
          })),
          verified_by_user_id: attendanceList.verified_by.id,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["attendances-lists", courseId],
          });
          messageApi.success("Liste de présence créée avec succès !");
          setOpen(false);
          form.resetFields();
          setAttendanceItems([]);
        },
        onError: () => {
          messageApi.error(
            "Erreur lors de la création de la liste de présence."
          );
        },
      }
    );
  };

  // Remplir le formulaire à chaque ouverture ou changement de la liste de présence
  useEffect(() => {
    if (attendanceList && open) {
      form.setFieldsValue({
        date: dayjs(attendanceList.date),
        time: dayjs(attendanceList.time, "HH:mm"),
      });
      setAttendanceItems(attendanceList.student_attendance_status);
    }
  }, [attendanceList, open, form]);

  return (
    <>
      {contextHolder}
      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title={<span>Liste de présence du {new Intl.DateTimeFormat("fr",{dateStyle:"long"}).format(new Date(attendanceList.date))}</span>}
        onClose={onClose}
        open={open}
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
              title="Annuler les modifications"
              open={cancel}
              onOk={() => {
                setOpen(false);
                setCancel(false);
                setAttendanceItems([]);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la modification de cette liste de présence ?"
                description="Toutes les modifications apportées seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
        footer={
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
                  Modifiez la date si nécessaire, puis mettez à jour avec
                  précision les étudiants présents et absents.
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
