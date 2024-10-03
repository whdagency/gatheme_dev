import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const Search = () => {
  const [search, setSearch] = useState();
  const { setSearchProductTerm } = useMenu();
  const [_, setSearchParams] = useSearchParams();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search === "" || !search || search.length === 0) {
      setSearchProductTerm("");
      setSearchParams((prev) => {
        prev.delete("search");
        return prev;
      });
      return;
    }

    setSearchProductTerm(search);
    setSearchParams((prev) => {
      prev.set("search", search);
      return prev;
    });
  };

  return (
    <div className="px-5 py-3 mt-5">
      <form
        onSubmit={handleSearch}
        className="flex items-center px-6 py-3 bg-[#F5F3F3] rounded-[10px]"
      >
        <SearchBar width={20} height={20} />
        <input
          type="text"
          placeholder="Lets find the food you like"
          className="flex-1 ml-2 text-sm bg-transparent outline-none placeholder:text-[#7A7A7A]"
          onChange={(e) => {
            if (e.target.value === "") {
              setSearchParams((prev) => {
                prev.delete("search");
                return prev;
              });
              setSearch("");
              setSearchProductTerm("");
              return;
            }

            setSearch(e.target.value);
          }}
          value={search}
          name="search"
          id="search"
        />
      </form>
    </div>
  );
};

export default Search;

const SearchBar = ({ width = 18, height = 18 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
    >
      <g clipPath="url(#clip0_1868_21029)">
        <path
          d="M7.66675 13.6666C10.9805 13.6666 13.6667 10.9803 13.6667 7.66663C13.6667 4.35292 10.9805 1.66663 7.66675 1.66663C4.35304 1.66663 1.66675 4.35292 1.66675 7.66663C1.66675 10.9803 4.35304 13.6666 7.66675 13.6666Z"
          stroke="#7A7A7A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.3334 16.3333L12.0001 11.9999M11.0001 7.66659C11.0001 6.78253 10.6489 5.93468 10.0238 5.30956C9.39865 4.68444 8.5508 4.33325 7.66675 4.33325"
          stroke="#7A7A7A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1868_21029">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
