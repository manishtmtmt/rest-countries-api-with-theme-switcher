/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

import { BsSearch } from "react-icons/bs";
import { useTheme } from "./context/themeTypes";

const App = () => {
  const limit = 8;
  const { theme, toggleTheme } = useTheme();
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredCountries.length / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const currentPageData = filteredCountries.slice(startIndex, endIndex);

  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterCountries(query);
  };

  const filterCountries = (query: string) => {
    if (selectedRegion === "") {
      const filtered = countries.filter((country: any) => {
        return country.name.common.toLowerCase().includes(query.toLowerCase());
      });

      setFilteredCountries(filtered);
    } else {
      const filtered = countries.filter(
        (country: any) =>
          country.region === selectedRegion &&
          country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
    filterCountriesByRegion(region);
  };

  const filterCountriesByRegion = (region: string) => {
    if (region === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(
        (country: any) => country.region === region
      );
      setFilteredCountries(filtered);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);
  return (
    <main
      className={`${
        theme === "dark" ? "dark" : "light"
      } text-foreground bg-background`}
    >
      <div className="px-16 box-shadow-md flex items-center justify-between min-h-[10vh] shadow-md">
        <p className="text-3xl font-bold">Where in the world?</p>
        <div className="cursor-pointer" onClick={() => toggleTheme()}>
          {theme === "light" ? (
            <div className="flex items-center gap-2">
              <FaMoon />
              <p>Dark Mode</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FaSun />
              <p>Light Mode</p>
            </div>
          )}
        </div>
      </div>
      <div className="px-16 py-8 min-h-[90vh] flex flex-col gap-4">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="md:w-1/3 lg:w-1/4 w-full">
            <Input
              label="Search"
              radius="lg"
              variant="bordered"
              placeholder="Search for a country..."
              startContent={
                <BsSearch className="text-black/50 mb-0.5 mr-0.5 text-slate-400 pointer-events-none flex-shrink-0" />
              }
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="md:w-1/3 lg:w-1/4 w-full flex gap-3 justify-end">
            <Select
              className="max-w-xs p-0"
              label="Filter by Region"
              variant="bordered"
              value={selectedRegion}
              onChange={handleRegionChange}
              classNames={{
                popoverContent: `${theme === "dark" ? "text-white" : ""}`,
                listboxWrapper: `rounded-xl ${
                  theme === "dark" ? "bg-black" : ""
                }`,
              }}
            >
              <SelectItem key={"Europe"} value={"Europe"}>
                Europe
              </SelectItem>
              <SelectItem key={"Africa"} value={"Africa"}>
                Africa
              </SelectItem>
              <SelectItem key={"Americas"} value={"Americas"}>
                Americas
              </SelectItem>
              <SelectItem key={"Oceania"} value={"Oceania"}>
                Oceania
              </SelectItem>
              <SelectItem key={"Asia"} value={"Asia"}>
                Asia
              </SelectItem>
              <SelectItem key={"Antarctic"} value={"Antarctic"}>
                Antarctic
              </SelectItem>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="bordered"
            size="sm"
            onClick={handlePrev}
            disabled={page === 1}
          >
            {"<"}
          </Button>
          <span>{page}</span>
          <Button
            variant="bordered"
            size="sm"
            onClick={handleNext}
            disabled={page >= totalPages}
          >
            {">"}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPageData.length > 0 &&
            currentPageData.map((country: any) => (
              <Card key={country.cca2}>
                <CardBody className={`overflow-visible py-2`}>
                  <div className="w-full h-[200px]">
                    <img
                      className="w-full h-full rounded-md"
                      src={country.flags.png}
                      alt={country.flags.alt}
                    />
                  </div>
                  <CardHeader className="mt-4 px-4 flex flex-col items-start">
                    <p className="text-xl font-bold">{country.name.common}</p>
                    <div className="flex flex-col gap-1 mt-4">
                      <p className="text-gray-500">
                        <span className="font-bold">Population: </span>
                        {country.population}
                      </p>
                      <p className="text-gray-500">
                        <span className="font-bold">Region: </span>
                        {country.region}
                      </p>
                      <p className="text-gray-500">
                        <span className="font-bold">Capital: </span>
                        {country.capital &&
                          country.capital.length > 0 &&
                          country.capital[0]}
                      </p>
                    </div>
                  </CardHeader>
                </CardBody>
              </Card>
            ))}
        </div>
      </div>
    </main>
  );
};

export default App;
