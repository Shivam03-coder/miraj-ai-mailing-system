"use client";
import { Input } from "@/components/ui/input";
import useThreads from "@/hooks/use-threads";
import { api, RouterOutputs } from "@/trpc/react";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { useAppDispatch } from "@/store/store";
import { setThreadId } from "@/store/states";
import { Spinner } from "@nextui-org/spinner";

// Corrected Type Definition for ThreadData
type ThreadData = RouterOutputs["mails"]["serachEmails"];

const ThreadSearchInput = () => {
  const [searchValue, setSearchValue] = useDebounceValue("", 100);
  const [searchedValue, setSearchedValue] = useState<ThreadData | []>([]);
  const SearchThreads = api.mails.serachEmails.useMutation();
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const { accountId } = useThreads();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!searchValue) return;
    setIsLoading(true);
    SearchThreads.mutate(
      { accountId, text: searchValue },
      {
        onSuccess(data) {
          setIsLoading(false);
          setSearchedValue(data ?? []);
        },
        onError() {
          setIsLoading(false);
        },
      },
    );
  }, [searchValue]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center justify-between gap-2 rounded bg-paleblue px-3 py-1">
        <div className="flex flex-1 items-center gap-3">
          <Search size={25} />
          <Input
            placeholder="Search..."
            className="flex-1 border-none font-inter text-xl shadow-none outline-none placeholder:text-black"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <span
          className="cursor-pointer rounded bg-primary text-secondary"
          onClick={() => {
            setSearchValue("");
            setSearchedValue([]);
          }}
        >
          <X size={25} />
        </span>
      </div>

      {/* Display Loading State */}
      {searchValue && IsLoading && (
        <div className="flex-center absolute left-0 right-0 z-10 mt-2 min-h-24 w-full overflow-y-auto rounded-md bg-primary p-3 text-secondary shadow-lg">
          <Spinner color="default" size="md" />
        </div>
      )}

      {/* Display Search Results */}
      {searchedValue && searchedValue.length > 0 && (
        <div className="absolute left-0 right-0 z-10 mt-2 max-h-80 min-h-24 w-full overflow-y-auto rounded-md bg-primary p-3 text-primary shadow-lg">
          {searchedValue.map((thr) => (
            <Card
              onClick={() => dispatch(setThreadId(thr.id))}
              key={thr.id}
              className={`my-3 flex cursor-pointer flex-col gap-4 bg-secondary p-4 text-primary transition-all hover:bg-paleblue`}
            >
              <div className="flex w-full justify-between">
                <div className="rounded-lg bg-primary px-2 text-left text-secondary">
                  {thr.emails[0]?.from.name || "Anonymous mail"}
                </div>
                <div className="flex-center rounded-full bg-green-300 px-2 font-inter text-sm">
                  {formatDistanceToNow(new Date(thr.lastMessageDate), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="font-inter text-sm font-medium">
                {thr.subject}
              </div>
              <div
                className="font-inter text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(thr.emails[0]?.bodySnippet ?? "", {
                    USE_PROFILES: { html: true },
                  }),
                }}
              />
              {thr.emails[0]?.sysLabels && (
                <div className="flex gap-2">
                  {thr.emails[0]?.sysLabels.map((label) => (
                    <div
                      key={label}
                      className="rounded bg-primary px-1 text-secondary"
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Display No Results Found */}
      {searchValue && searchedValue?.length === 0 && !IsLoading && (
        <div className="absolute left-0 right-0 z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-md bg-secondary p-3 text-primary shadow-lg">
          <h6>
            No results found for:{" "}
            <span className="font-bold">{searchValue}</span>
          </h6>
        </div>
      )}
    </div>
  );
};

export default ThreadSearchInput;
