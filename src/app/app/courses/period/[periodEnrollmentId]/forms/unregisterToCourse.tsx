"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Checkbox, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseEnrollment } from "@/types";
import { deleteCourseEnrollment } from "@/lib/api";

type FormDataType = {
  confirmed: boolean;
};

type UnregisterStudentCourseFormProps = {
  courseEnrollment?: CourseEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const UnregisterStudentCourseForm: FC<
  UnregisterStudentCourseFormProps
> = ({ courseEnrollment, open, setOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteCourseEnrollment,
  });

  const onFinish = (values: FormDataType) => {
    if (!values.confirmed) {
      messageApi.error("Vous devez confirmer votre désinscription.");
      return;
    }
    mutateAsync(courseEnrollment?.id!, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["course_enrollments"] });
        messageApi.success("Désinscription au cours effectuée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la désinscription du cours."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={`Désinscription au cours: ${courseEnrollment?.course.available_course.name}`}
        centered
        okText="Me désinscrire"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
          danger: true,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="unregister_student_course_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ confirmed: false }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={`Êtes-vous sûr(e) de vouloir vous désinscrire du cours "${courseEnrollment?.course.available_course.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ margin:"10px 0 10px 0 " }}
        />
        <Form.Item
          name="confirmed"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Vous devez cocher la case pour confirmer la désinscription."
                      )
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>Je confirme vouloir me désinscrire de ce cours.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
