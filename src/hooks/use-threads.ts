import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useThreads = () => {
  const { data: accounts, isError: accountsError } =
    api.mails?.getAccounts.useQuery();

  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage("Current-tab", "inbox");
  const [done] = useLocalStorage("done", false);

  const {
    data: threads,
    isFetching,
    refetch,
    isError: threadsError,
  } = api.mails.getThreads.useQuery(
    {
      accountId,
      done,
      tab,
    },
    {
      enabled: !!accountId,
    },
  );

  if (accountsError) {
    console.error("Error fetching accounts data.");
  }

  if (threadsError) {
    console.error("Error fetching threads data.");
  }

  return {
    threads: threads || [],
    isFetching,
    refetch,
    accountId,
    account: accounts?.find((e) => e.id === accountId) || null,
  };
};

export default useThreads;
