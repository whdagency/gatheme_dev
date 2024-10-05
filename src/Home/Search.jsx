import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { useTranslation } from "react-i18next";
import { SearchBar } from "../components/icons";

const Search = () => {
  const [search, setSearch] = useState();
  const { setSearchProductTerm, restoSlug, table_id } = useMenu();
  const { t } = useTranslation("global");
  const [_, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

    navigate(
      `/menu/${restoSlug}/products?table_id=${table_id}&search=${search}`
    );
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
          placeholder={t("home.searchPlaceholder")}
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
