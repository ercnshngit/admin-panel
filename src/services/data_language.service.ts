import { prisma } from "@/libs/prisma";
import { DataLanguageDto } from "./dto/data_language.dto";
import {
  ConfirmMessages,
  ErrorMessages,
} from "../../constants/messages.constants";
import { LogService } from "./log.service";
import { BaseService } from "./base.service";
import { UpdateDataLanguage } from "@/utils/use-data-language";

export class DataLanguageService extends BaseService {
  constructor(request?: any) {
    super(request);
  }

  async getDataLanguage(id: number) {
    const data_language = await prisma.data_language.findUnique({
      where: { id },
    });
    if (!data_language) {
      return new Response(
        JSON.stringify({ message: ErrorMessages.NOT_FOUND_ERROR() }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(data_language));
  }

  async getDataLanguages() {
    const data_languages = await prisma.data_language.findMany();
    if (data_languages.length < 1) {
      return new Response(
        JSON.stringify({ message: ErrorMessages.NOT_FOUND_ERROR() }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(data_languages));
  }

  async getDataLanguagesByTable(table_name: string) {
    const table = await prisma.database_table.findFirst({
      where: { name: table_name },
    });
    if (!table) {
      return new Response(
        JSON.stringify({ message: ErrorMessages.NOT_FOUND_ERROR() }),
        { status: 404 }
      );
    }
    const data_languages = await prisma.data_language.findMany({
      where: { database_table_id: table.id },
    });
    if (data_languages.length < 1) {
      return new Response(
        JSON.stringify({ message: ErrorMessages.NOT_FOUND_ERROR() }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(data_languages));
  }

  async createDataLanguage(
    data: UpdateDataLanguage & { database_table_id: number }
  ) {
    try {
      // Check if data_language already exist
      const isExist = await prisma.data_language.findFirst({
        where: {
          database_table_id: Number(data.database_table_id),
          data_id: Number(data.data_id),
        },
      });

      let processedData: Partial<typeof data> = data;

      let data_language = null;

      if (isExist) {
        //First is data language have data_group
        if (isExist.data_group && isExist.data_group !== "") {
          const datasWithSameGroup = await prisma.data_language.findMany({
            where: {
              data_group: isExist.data_group,
            },
          });

          if (datasWithSameGroup.length > 1) {
            processedData = {
              ...data,
              data_group: undefined,
            };

            for (const prismaData of datasWithSameGroup) {
              if (
                prismaData.id !== isExist.id &&
                prismaData.language_code === data.language_code
              ) {
                await prisma.data_language.update({
                  where: { id: prismaData.id },
                  data: {
                    data_group: null,
                  },
                });
              }
            }
          }
        }

        data_language = await prisma.data_language.delete({
          where: { id: isExist.id },
        });
      }
      //TODO: language code geliyor aslinda
      data_language = await prisma.data_language.create({
        data: {
          data_id: Number(processedData.data_id),
          language_code: data.language_code || "en",
          database_table_id: Number(data.database_table_id),
          data_group: data.data_group,
        },
      });

      if (!data_language) {
        return new Response(
          JSON.stringify({ message: ErrorMessages.NOT_FOUND_ERROR() }),
          { status: 404 }
        );
      }
      return new Response(JSON.stringify(data_language));
    } catch (error) {
      const logService = new LogService();
      await logService.createLog({ error });
      console.log(error);
      return new Response(
        JSON.stringify({ status: "error", error_message: error })
      );
    }
  }

  async updateDataLanguage(id: number, data: DataLanguageDto) {
    try {
      const data_language = await prisma.data_language.findUnique({
        where: { id },
      });
      if (!data_language) {
        return new Response(
          JSON.stringify({ message: ErrorMessages.NOT_FOUND_ERROR() }),
          { status: 404 }
        );
      }
      Object.assign(data_language, data);
      const new_data_language = await prisma.data_language.update({
        where: { id },
        data,
      });
      if (!new_data_language) {
        return new Response(
          JSON.stringify({ message: ErrorMessages.UPDATE_FAILED_ERROR() }),
          { status: 400 }
        );
      }
      return new Response(JSON.stringify(new_data_language));
    } catch (error) {
      const logService = new LogService();
      await logService.createLog({ error });
      console.log(error);
      return new Response(
        JSON.stringify({ status: "error", error_message: error })
      );
    }
  }

  async deleteDataLanguage(id: number) {
    try {
      const data_language = await prisma.data_language.findUnique({
        where: { id },
      });
      if (!data_language) {
        return new Response(
          JSON.stringify({ message: ErrorMessages.NOT_FOUND_ERROR() }),
          { status: 404 }
        );
      }
      const delete_data_language = await prisma.data_language.delete({
        where: { id },
      });
      if (!delete_data_language) {
        return new Response(
          JSON.stringify({ message: ErrorMessages.DELETE_FAILED_ERROR() }),
          { status: 400 }
        );
      }
      return new Response(
        JSON.stringify({ message: ConfirmMessages.DELETE_SUCCESS_CONFIRM() }),
        { status: 200 }
      );
    } catch (error) {
      const logService = new LogService();
      await logService.createLog({ error });
      console.log(error);
      return new Response(
        JSON.stringify({ status: "error", error_message: error })
      );
    }
  }
}
