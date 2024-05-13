import Label from "@/components/base-form/components/Label";
import UpdateFormBase from "@/components/base-form/update-form-base";
import Loading from "@/components/loading";
import axiosClient from "@/libs/axios";
import { Mail } from "@/services/mail.service";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Resolver, useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";

const resolver: Resolver<Mail> = async (values) => {
  return {
    values: values.send_to_mail ? values : {},
    errors: !values.send_to_mail
      ? {
          send_to_mail: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

export default function ContactMails() {
  const [mails, setMails] = React.useState<Mail[]>([]);
  React.useEffect(() => {
    (async () => {
      const { data } = await axiosClient.get("/mail");
      setMails(data);
    })();
  }, []);

  return (
    <div>
      <h4 className="text-lg font-medium">İletişim E-posta</h4>
      <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
        {mails.map((mail, index) => {
          return <MailForm key={index} mail={mail} />;
        })}
      </div>
    </div>
  );
}

const MailForm = ({ mail }: { mail: Mail }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Mail>({ resolver, defaultValues: mail });
  const onSubmit = handleSubmit((data) => {
    updateMailMutation.mutate(data);
  });

  const updateMailMutation = useMutation(
    (data: Mail) => axiosClient.post(`/mail/${mail.id}`, data),
    {
      onSuccess: () => {
        console.log("Success");
        toast.success("Mail başarıyla güncellendi");
      },
      onError: () => {
        console.log("Error");
        toast.error("Mail güncellenirken bir hata oluştu");
      },
    }
  );

  return (
    <div className="p-2 bg-gray-100 rounded-xl">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col w-full gap-2 pb-4 border-b border-gray-200">
          <div>
            <label htmlFor={mail.title}>Başlık</label>
          </div>
          <input
            className="px-2 py-1 border border-gray-200 rounded-md "
            readOnly
            {...register("title", {
              required: true,
            })}
          />
          {errors.title && <span>Bu alan gereklidir</span>}
        </div>
        <div className="flex flex-col w-full gap-2 pb-4 border-b border-gray-200">
          <div>
            <label>E-posta Adresi</label>
          </div>
          <input
            className="px-2 py-1 border border-gray-200 rounded-md "
            {...register("send_to_mail", {
              required: true,
            })}
          />
          {errors.send_to_mail && <span>Bu alan gereklidir</span>}
        </div>
        <button
          type="submit"
          className="px-4 py-1 mt-2 w-full text-white text-center bg-blue-500 rounded-md"
          disabled={updateMailMutation.isLoading}
        >
          {updateMailMutation.isLoading ? (
            <ImSpinner2 className="animate-spin h-6 w-6 mx-auto" />
          ) : (
            "Güncelle"
          )}
        </button>
      </form>
    </div>
  );
};
