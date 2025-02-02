import { TableService } from "@/services/table.service";
import { TypeService } from "@/services/type.service";
import { createTableConfigsScript } from "./create-table-configs.script";
import { createTableRelationsScript } from "./create-table-relations.script";
import { migrateTableConfig } from "./migrate-table-configs.script";
import { createDemoUser } from "./create-demo-user.script";
import { createTranslations } from "./create-translations.script";

const typesService = new TypeService("table-config-script");
const tableService = new TableService("table-config-script");

async function createTableConfig() {
  try {
    await createTableConfigsScript();
    await typesService.setInputDataTypes();
    await migrateTableConfig();
    await createTableRelationsScript();
    await createDemoUser();
    await createTranslations();
  } catch (error) {
    console.log("error :", error);
    await tableService.createLog(error);
  }
}

createTableConfig();
