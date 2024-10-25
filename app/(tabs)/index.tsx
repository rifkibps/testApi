import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Platform, View, Text } from "react-native";

import axios, { AxiosResponse } from "axios";

interface Token {
  access: string;
  refresh: string;
}

const HomeScreen = () => {
  const [state, setState] = useState(false);
  const [response, setResponse] = useState<AxiosResponse | null | void>(null);
  const [token, setToken] = useState<Token>({
    access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5ODQ0MDQzLCJpYXQiOjE3Mjk4NDM3NDMsImp0aSI6ImMxYThiYjJiODViZDQ3NGViODA1NDhiYTkzZWMyZTY0IiwidXNlcl9pZCI6MX0.NkzJPKjd3eOQ_plbwFrf0OiPIkKpO38A_VqmwGR1YAE",
    refresh: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNzYyMDQ3NywiaWF0IjoxNzI5ODQ0NDc3LCJqdGkiOiJhNjA5YWYxZmFmNjE0NzRmOGZlOTM3OWY0ZjhjMjM0MiIsInVzZXJfaWQiOjF9.No69dm5rdobLq5TtRje4WU3ElZczthOqsVsTDNXZSCE",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiResponse;
        while (!state) {
          apiResponse = await axios.get('http://192.168.1.37:8000/api', {headers : {Authorization: `Bearer ${token.access}`}})
          console.log('GA VALID')
          if (apiResponse.status !== 200){
            const newTokenResponse = await axios.post('http://192.168.1.37:8000/api/token/refresh', {refresh: token.refresh})
            if (newTokenResponse.status === 200){
              const newTokenData = newTokenResponse.data
              setToken({ access: newTokenData.access, refresh: newTokenData.refresh });
            }else{
              throw new Error('Sorry, your token has expired. Please log in again.');
            }
          }else{
            setState(true);
            setResponse(apiResponse);
            break;
          }
        }
      }catch (error) {
        console.error(error); // Handle errors appropriately (e.g., display an error message)
      }
    }
    fetchData();

  }, [token])

  return (
    <View>
      {state && response? (
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
