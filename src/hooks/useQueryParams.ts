import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {


    const location = useLocation();
    const navigateURL = useNavigate();

    const queryParams = queryString.parse(location.search);

    const handleSearchParams = (conditionKey: string, conditionValue: string) => {
        if (!(conditionKey in queryParams)) {
          const updatedParams = { ...queryParams, [conditionKey]: conditionValue };
          //queryParams = updatedParams;
          navigateURL(`?${queryString.stringify(updatedParams)}`);
        }
      };
    
      const changeSearchParams = (conditionKey: string, conditionValue: string) => {
        if (conditionValue !== queryParams[conditionKey]) {
          queryParams[conditionKey] = conditionValue;
          navigateURL(`?${queryString.stringify(queryParams)}`);
        }
      };

    // const handleSearchParams = (key: string, value: string) => {
    //   console.log(key, value )
    //   if (!(key in queryParams)) {
    //     console.log('set params ran')
    //     const updatedParams = { ...queryParams, [key]: value };
    //     navigateURL(`?${queryString.stringify(updatedParams)}`);
    //   } else if (key in queryParams && value !== queryParams[key]) {
    //     console.log('update params ran')
    //     queryParams[key] = value;
    //     navigateURL(`?${queryString.stringify(queryParams)}`);
    //   }
    // };

    return { queryParams, handleSearchParams, changeSearchParams };

  //   string | undefined,
  //   (value: string) => void,
  //   (value: string) => void
  // ] {
  //   const location = useLocation();
  //   const navigate = useNavigate();

  //   const value = queryString.parse(location.search)[key] as string | undefined;

  //   const setValue = (newValue: string) => {
  //     const currentParams = queryString.parse(location.search); // ✅ always fresh
  //     const currentValue = currentParams[key] as string | undefined;

  //     if (currentValue !== newValue) {
  //       const updatedParams = { ...currentParams, [key]: newValue };
  //       navigate(`?${queryString.stringify(updatedParams)}`);
  //     }
  //   };

  //   const setIfAbsent = (newValue: string) => {
  //     const currentParams = queryString.parse(location.search); // ✅ always fresh

  //     if (!(key in currentParams)) {
  //       const updatedParams = { ...currentParams, [key]: newValue };
  //       if (`?${queryString.stringify(updatedParams)}` !== location.search) {
  //         navigate(`?${queryString.stringify(updatedParams)}`);
  //       }
  //     }
  //   };

  //   return [value, setValue, setIfAbsent];
};
