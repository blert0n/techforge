import type { paths } from "@/types/api";

type AddressesPath = paths["/api/addresses"];

export type Address =
  AddressesPath["get"]["responses"][200]["content"]["application/json"][number];
export type AddressInput = NonNullable<
  AddressesPath["post"]["requestBody"]
>["content"]["application/json"];
export type AddressType = Address["type"];
