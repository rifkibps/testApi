import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  AppRegistry,
} from "react-native";

import axios, { AxiosResponse } from "axios";

interface Token {
  access: string;
  refresh: string;
}

const HomeScreen = () => {
  const [state, setState] = useState(false);
  const [response, setResponse] = useState<AxiosResponse | null | void>(null);
  const [token, setToken] = useState<Token>({
    access:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5ODQ3MTU0LCJpYXQiOjE3Mjk4NDY4NTQsImp0aSI6ImUyNTZiODdmYTRhYzQzZWI5NDhiNDRhNGE5MWFiNzgxIiwidXNlcl9pZCI6MX0.-ukYpS5uuR_rqoz460iniF7bUY7bfJxx4iy2ToVgn9o",
    refresh:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNzYyMjg1NCwiaWF0IjoxNzI5ODQ2ODU0LCJqdGkiOiIwYzY2MzMzMTExMmI0MDRiOWIxYjY5YjBiMWFkMjhkYSIsInVzZXJfaWQiOjF9.QI4vVtS4tmjHJRckURTUoxVwUaMlPPXRo7y-FOZtkiA",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiResponse;
        while (!state) {
          apiResponse = await axios
            .get("http://192.168.1.37:8000/api", {
              headers: { Authorization: `Bearer ${token.access}` },
            })
            .then((response: AxiosResponse) => {
              setState(true);
              setResponse(response);
            })
            .catch(function (error) {
              if (error.response) {
                const newTokenResponse = axios.post(
                  "http://192.168.1.37:8000/api/token/refresh",
                  { refresh: token.refresh }
                ).then((newResponse: AxiosResponse) => {
                  const newTokenData = newResponse.data;
                  console.log(newTokenData)
                  // setToken({
                  //   access: newTokenData.access,
                  //   refresh: newTokenData.refresh,
                  // });
                })
                //.catch(function (error) {
                //   throw new Error(
                //       "Sorry, your token has expired. Please log in again."
                //     );
                // })
              }
            });
        }
      } catch (error) {
        console.error(error); // Handle errors appropriately (e.g., display an error message)
      }
    };
    fetchData();
  }, [token]);

  return (
    <View>
      {state && response ? (
        <Text>API response: {JSON.stringify(response.data, null, 2)}</Text>
      ) : (
        <Text>Fetching data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 20,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
