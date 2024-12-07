"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getAurnikoAuthUrl } from "@/lib/aurinko";
import { api } from "@/trpc/react";
import { Mail, Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

const AccountSwitcher = () => {
  const { data: accounts } = api.mails.getAccounts.useQuery();
  const [AccountId, setAccountId] = useLocalStorage("accountId", "");

  if (!accounts) {
    return null;
  }

  const handleAccounts = (value: string) => {
    toast({
      title: `Account switched`,
      className: "bg-green-100 border-black text-black",
    });
    setAccountId(value); // Set the account ID in local storage
  };

  return (
    <Select onValueChange={handleAccounts}>
      <SelectTrigger className="border-none bg-primary text-secondary">
        <div className="flex items-center gap-2">
          <Mail size={20} />
          <Plus size={16} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-secondary text-primary">
        <SelectGroup>
          <SelectLabel>Accounts</SelectLabel>
          {accounts.map((acc) => (
            <SelectItem key={acc.id} value={acc.id}>
              {acc.emailAddress}
            </SelectItem>
          ))}

          <button
            onClick={async () => {
              const url = await getAurnikoAuthUrl("Google");
              window.location.href = url;
            }}
            className="flex gap-2 px-3 text-[0.875rem] text-primary"
          >
            Add accounts <Plus size={18} />
          </button>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
