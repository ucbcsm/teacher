"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Checkbox, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Enrollment, PeriodEnrollment, TaughtCourse } from "@/types";
import { createSingleCourseEnrollment } from "@/lib/api";

type FormDataType = {
  confirmed: boolean;
};

type ConfirmStudentCourseRegistrationFormProps = {
  periodEnrollement?: PeriodEnrollment;
  course: TaughtCourse;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ConfirmStudentCourseRegistrationForm: FC<
  ConfirmStudentCourseRegistrationFormProps
> = ({ periodEnrollement, course, open, setOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createSingleCourseEnrollment,
  });

  const onFinish = (values: FormDataType) => {
    if (!values.confirmed) {
      messageApi.error("Vous devez confirmer votre inscription.");
      return;
    }
    mutateAsync(
      {
        student_id: periodEnrollement?.id!,
        course_id: course.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["course_enrollments"] });
          messageApi.success("Inscription au cours confirmée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la confirmation de votre inscription au cours."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={`Inscription au cours : ${course.available_course.name}`}
        centered
        okText="Confirmer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
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
            name="confirm_student_course_registration_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ confirmed: false }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Confirmer votre inscription"
          description={`Êtes-vous sûr(e) de vouloir confirmer votre inscription au cours "${course.available_course.name}" ?`}
          type="info"
          showIcon
          style={{margin:"10px 0 10px 0" }}
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
                      new Error("Vous devez cocher la case pour confirmer.")
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>Je confirme mon inscription à ce cours.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
