"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Checkbox, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PeriodEnrollment } from "@/types";
import { deletePeriodEnrollment } from "@/lib/api";

type FormDataType = {
  confirmed: boolean;
};

type UnregisterStudentPeriodFormProps = {
  periodEnrollment?: PeriodEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const UnregisterStudentPeriodForm: FC<
  UnregisterStudentPeriodFormProps
> = ({ periodEnrollment, open, setOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deletePeriodEnrollment,
  });

  const onFinish = (values: FormDataType) => {
    if (!values.confirmed) {
      messageApi.error("Vous devez confirmer votre désinscription.");
      return;
    }
    mutateAsync(periodEnrollment?.id!, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["period_enrollments"] });
        messageApi.success("Désinscription effectuée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la désinscription."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={`Désinscription ${periodEnrollment?.period.name}`}
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
            name="unregister_student_period_form"
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
          description={`Êtes-vous sûr(e) de vouloir vous désinscrire à la période ${periodEnrollment?.period.name} ? Cette action est irréversible.`}
          type="warning"
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
                      new Error(
                        "Vous devez cocher la case pour confirmer la désinscription."
                      )
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>Je confirme vouloir me désinscrire.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
