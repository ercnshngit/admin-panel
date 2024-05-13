"use client";
import { cn } from "@/libs/utils";
import { Button } from "../ui/button";
import { List, LogOut, icons } from "lucide-react";
import { useTranslate } from "@/langs";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useConfigs, useDatabase } from "@/hooks/use-database";
import { useQuery } from "@tanstack/react-query";
import { getTable, getTypes } from "@/services/dashboard";
import { TypeDto } from "@/services/dto/type.dto";
import useSearchParams from "@/hooks/use-search-params";
import { useLanguage } from "@/contexts/language-context";
import ImageWrapper from "@/libs/image-wrapper";
import Cookies from "universal-cookie";
import { isSuperAdminFn } from "@/utils/cookie";

export function Sidebar({ className }: { className?: string }) {
  const { translate } = useTranslate();
  const cookies = new Cookies();
  const router = useRouter();
  const pathname = usePathname();
  const { getAllQueryString } = useSearchParams();
  const { configs, error } = useConfigs();
  const isSuperAdmin = isSuperAdminFn();

  const groupedConfigs = configs
    ?.filter((item) => (isSuperAdmin ? true : !item.is_hidden))
    ?.sort((a, b) => a.order - b.order)
    .reduce((acc, item) => {
      if (!acc[item.group || "Tablolar"]) {
        acc[item.group || "Tablolar"] = [];
      }

      acc[item.group || "Tablolar"].push(item);

      return acc;
    }, {} as Record<string, any[]>);

  const { data: blockTypes } = useQuery<TypeDto[]>(["block_types"], () =>
    getTypes("block")
  );

  return (
    <div
      className={cn("pb-12 bg-background border-r shadow-md h-full", className)}
    >
      <div className="py-4 space-y-4">
        <div className="px-3">
          <ImageWrapper
            className="aspect-[2380/952] h-[90px] w-full"
            src="/new-assets/renkli.png"
            imageClassName="object-contain"
            local
            alt="logo"
          />
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Bloklar
          </h2>
          <div className="flex flex-col space-y-1">
            {blockTypes?.map((item) => (
              <Button
                key={item.id}
                asChild
                variant={
                  Object.values(getAllQueryString()).includes(String(item.id))
                    ? "default"
                    : "ghost"
                }
                className="justify-start "
              >
                <Link
                  href={{
                    pathname: "/dashboard/block",
                    query: { type_id: item.id },
                  }}
                >
                  <List className="w-5 h-5 mr-2" />

                  {translate(item.name)}
                </Link>
              </Button>
            ))}

            <Button
              asChild
              variant={
                pathname === "/dashboard/type/table/menu" ? "default" : "ghost"
              }
              className="justify-start "
            >
              <Link href={"/dashboard/type/table/menu"}>
                <List className="w-5 h-5 mr-2" />

                {translate("MENU_TYPES")}
              </Link>
            </Button>
            {groupedConfigs &&
              Object.entries(groupedConfigs).map(([key, value]) => (
                <div key={key}>
                  <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
                    {key}
                  </h2>
                  {value.map((item) => {
                    const Icon = icons[item.icon as keyof typeof icons];

                    return (
                      <Button
                        asChild
                        key={item.name}
                        variant={
                          pathname === "/dashboard/" + item.name
                            ? "default"
                            : "ghost"
                        }
                        className="justify-start w-full"
                      >
                        <Link href={"/dashboard/" + item.name}>
                          {item.icon ? (
                            <Icon className="w-5 h-5 mr-2" />
                          ) : (
                            <List className="w-5 h-5 mr-2" />
                          )}
                          {translate(item.name)}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              ))}
            <Button
              variant={"destructive"}
              className="justify-start "
              onClick={() => {
                cookies.remove("token", { path: "/" });
                cookies.remove("user", { path: "/" });
                router.push("/dashboard");
                router.refresh();
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
