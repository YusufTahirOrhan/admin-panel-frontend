"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Loader2, Phone, Plus, UserRound, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiPost, friendlyApiError } from "@/lib/management-api";
import { customerName, matchesCustomer, useCustomerDirectory, type Customer } from "@/lib/customer-directory";
import { formatPhone, splitFullName } from "@/lib/format";
import { toast } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

interface CustomerPickerProps {
  value: string | null | undefined;
  onChange: (customerId: string | null, customer: Customer | null) => void;
  id?: string;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  placeholder?: string;
  /** Offer "create a new customer" when nobody matches (default true). */
  allowCreate?: boolean;
}

/** Name part of the query ("Ayşe Yılmaz 0532 111" -> Ayşe / Yılmaz). */
function splitFullNameSafe(query: string) {
  return splitFullName(query.replace(/[+\d]/g, " "));
}

/**
 * Search customers by name or phone and pick one; a new customer can be created from the
 * typed name without leaving the form (common at the counter).
 */
export function CustomerPicker({
  value,
  onChange,
  id,
  required,
  invalid,
  describedBy,
  placeholder = "Ad, soyad veya telefon yazın",
  allowCreate = true,
}: CustomerPickerProps) {
  const { customers, loaded, loading, load, add } = useCustomerDirectory();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [creating, setCreating] = useState(false);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(() => customers.find((customer) => customer.id === value) ?? null, [customers, value]);
  const matches = useMemo(() => customers.filter((customer) => matchesCustomer(customer, query)).slice(0, 8), [customers, query]);
  const newName = splitFullNameSafe(query);
  const canCreate = allowCreate && query.trim().length > 0 && !matches.some((c) => customerName(c).toLocaleLowerCase("tr-TR") === query.trim().toLocaleLowerCase("tr-TR"));
  const optionCount = matches.length + (canCreate ? 1 : 0);

  function choose(customer: Customer) {
    onChange(customer.id, customer);
    setQuery("");
    setOpen(false);
  }

  async function createFromQuery() {
    if (!newName) {
      toast.info("Yeni müşteri için ad ve soyadı birlikte yazın (örn. Ayşe Yılmaz).");
      return;
    }
    setCreating(true);
    try {
      const digits = query.replace(/[^\d+]/g, "");
      const record = await apiPost<Record<string, unknown>>("/api/v1/sales/customers", {
        firstName: newName.firstName,
        lastName: newName.lastName,
        phone: digits.length >= 7 ? digits : undefined,
      });
      const customer: Customer = {
        id: String(record.id),
        firstName: String(record.firstName ?? newName.firstName),
        lastName: String(record.lastName ?? newName.lastName),
        phone: record.phone ? String(record.phone) : undefined,
      };
      add(customer);
      choose(customer);
      toast.success(`${customerName(customer)} müşteri olarak eklendi.`);
    } catch (error) {
      toast.error(friendlyApiError(error, "Müşteri eklenemedi."));
    } finally {
      setCreating(false);
    }
  }

  if (selected) {
    return (
      <div
        id={id}
        className="flex min-h-10 items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50/60 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-emerald-950/40"
      >
        <UserRound aria-hidden="true" className="size-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{customerName(selected)}</p>
          {selected.phone && <p className="truncate text-xs text-muted-foreground">{formatPhone(selected.phone)}</p>}
        </div>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-emerald-200 dark:hover:bg-emerald-900"
          onClick={() => {
            onChange(null, null);
            window.setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          Değiştir
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={open && optionCount > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && optionCount > 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        autoComplete="off"
        value={query}
        placeholder={loading && !loaded ? "Müşteriler yükleniyor…" : placeholder}
        className={cn("h-10", invalid && "border-red-500 focus-visible:ring-red-500/30")}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActive((current) => Math.min(optionCount - 1, current + 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((current) => Math.max(0, current - 1));
          } else if (event.key === "Enter" && open && optionCount > 0) {
            event.preventDefault();
            if (active < matches.length) choose(matches[active]);
            else void createFromQuery();
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open && optionCount > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border bg-popover p-1 text-sm shadow-lg"
        >
          {matches.map((customer, index) => (
            <li
              key={customer.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2",
                index === active ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50" : "hover:bg-muted",
              )}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(customer)}
            >
              <span className="truncate font-medium">{customerName(customer)}</span>
              {customer.phone && (
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Phone aria-hidden="true" className="size-3" />
                  {formatPhone(customer.phone)}
                </span>
              )}
            </li>
          ))}
          {canCreate && (
            <li
              id={`${listId}-${matches.length}`}
              role="option"
              aria-selected={active === matches.length}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 font-medium text-emerald-800 dark:text-emerald-200",
                active === matches.length ? "bg-emerald-50 dark:bg-emerald-950" : "hover:bg-muted",
                matches.length > 0 && "mt-1 border-t pt-2.5",
              )}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(matches.length)}
              onClick={() => void createFromQuery()}
            >
              {creating ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Plus aria-hidden="true" className="size-4" />}
              {newName ? (
                <span>
                  Yeni müşteri ekle: <strong>{newName.firstName} {newName.lastName}</strong>
                </span>
              ) : (
                <span className="font-normal text-muted-foreground">Yeni müşteri için ad ve soyad yazın</span>
              )}
            </li>
          )}
        </ul>
      )}
      {query && (
        <button
          type="button"
          aria-label="Aramayı temizle"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
