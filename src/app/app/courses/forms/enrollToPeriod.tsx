"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Checkbox, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Enrollment, Period } from "@/types";
import { createPeriodEnrollment } from "@/lib/api";

type FormDataType = {
  confirmed: boolean;
};

type ConfirmStudentPeriodRegistrationFormProps = {
  yearEnrollment?: Enrollment;
  period: Period;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ConfirmStudentPeriodRegistrationForm: FC<
  ConfirmStudentPeriodRegistrationFormProps
> = ({ yearEnrollment, period, open, setOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPeriodEnrollment,
  });

  const onFinish = (values: FormDataType) => {
    if (!values.confirmed) {
      messageApi.error("Vous devez confirmer votre inscription.");
      return;
    }
    mutateAsync(
      {
        year_enrollments_ids: [yearEnrollment?.id!],
        period_id: period.id,
        status: "pending",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["period_enrollments"] });
          messageApi.success("Inscription confirmée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la confirmation de votre inscription."
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
        title={`Confirmation de votre inscription: ${period.name}`}
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
            name="confirm_student_period_registration_form"
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
          description={`Êtes-vous sûr(e) de vouloir confirmer votre inscription à la période ${period.name} ?`}
          type="info"
          showIcon
          style={{ border: 0 }}
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
          <Checkbox>Je confirme mon inscription.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
