"use client";

import Avatar from "react-avatar";
import useThreads from "@/hooks/use-threads";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import Select from "react-select";

type OptionType = { label: string; value: string };

type MailInputProps = {
  defaultValues?: OptionType[];
  placeholder: string;
  label: string;
  onChange: (value: OptionType[]) => void;
  value: OptionType[];
};

const MailInput: React.FC<MailInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
}) => {
  const { accountId } = useThreads();
  const [InputValue, setInputValue] = useState<string>("");

  // Fetch the list of suggestions
  const { data: ListofSuggestion } = api.mails.getSuggestionEmails.useQuery({
    accountId,
  });

  // Transform suggestions into react-select options
  const options =
    ListofSuggestion?.map((sug) => ({
      label: (
        <div className="flex items-center gap-2">
          <Avatar name={sug.address} size="26" textSizeRatio={2} round={true} />
          <span>{sug.address}</span>
        </div>
      ),
      value: sug.address,
    })) || [];

  return (
    <div className="flex flex-col space-y-2">
      <label className="pl-1 font-inter text-lg font-medium text-gray-700 text-primary">
        {label}
      </label>
      <div className="rounded-md border">
        <Select
          value={value}
          onInputChange={setInputValue}
          // @ts-ignore
          onChange={(selected) => onChange(selected as OptionType[])}
          placeholder={placeholder}
          isMulti
          // @ts-ignore
          options={
            InputValue
              ? options?.concat({
                  // @ts-ignore
                  label: InputValue,
                  value: InputValue,
                })
              : options
          }
          className="w-full flex-1"
          classNames={{
            control: () =>
              "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent",
            multiValue: () => "dark:!bg-gray-700",
            multiValueLabel: () =>
              "dark:text-white dark:bg-gray-700 rounded-md",
          }}
          classNamePrefix="select"
        />
      </div>
    </div>
  );
};

export default MailInput;
