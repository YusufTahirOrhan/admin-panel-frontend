"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, normalizeList } from "@/lib/management-api";
import { toTransactionType, type TransactionCategory, type TransactionType } from "@/lib/transaction-types";

/** Active transaction types of one category (what staff may pick in a form). */
export function useTransactionTypes(category: TransactionCategory) {
  const [types, setTypes] = useState<TransactionType[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    apiGet<unknown>("/api/v1/sales/transaction-types")
      .then((data) => {
        if (!active) return;
        setTypes(
          normalizeList(data)
            .map(toTransactionType)
            .filter((type): type is TransactionType => type !== null && type.active && type.category === category),
        );
        setLoaded(true);
      })
      .catch(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [category, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { types, loaded, reload, defaultTypeId: types[0]?.id };
}
