"use client";

import { CustomersResource } from "@/components/management/customers-resource";

export default function SalesCustomersPage() {
  return <CustomersResource allowDelete={false} />;
}
