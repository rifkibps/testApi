import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import axios, { AxiosError, AxiosResponse } from "axios";
// interface Token {
//   access: string;
//   refresh: string;
// }

const HomeScreen = () => {
  const [state, setState] = useState(false);
  const [response, setResponse] = useState<AxiosResponse | null | void>(null);
  const [tokenAccess, setTokenAccess] = useState<string>('');
  const [tokenRefresh, setTokenRefresh] = useState<string>('');

  const [result, setResult] = useState<string | null>();


  const storeToken = async () => {
    console.log("storeToken sedang dijalankan");
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.setItem("access", tokenAccess);
        await AsyncStorage.setItem("refresh", tokenRefresh);
      } else {
        await SecureStore.setItemAsync("access", tokenAccess);
        await SecureStore.setItemAsync("refresh", tokenRefresh);
      }
      console.log("storeToken selesai dijalankan");
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  const getToken = async () => {
    try {
      console.log("Get token sedang dijalankan");
      let access, refresh;
      if (Platform.OS === "web") {
        [access, refresh] = await Promise.all([
          AsyncStorage.getItem("access"),
          AsyncStorage.getItem("refresh"),
        ]);
      } else {
        [access, refresh] = await Promise.all([
          SecureStore.getItemAsync("access"),
          SecureStore.getItemAsync("refresh"),
        ]);
      }

      if (!access || !refresh) {
        console.log("Inisialisasi token dijalankan");
        access = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwMDIwMDU2LCJpYXQiOjE3MzAwMTk5OTYsImp0aSI6ImJiYTc3ZGVmYjczZDRkN2NiZDE3NmVmYmMzMzIzYzVkIiwidXNlcl9pZCI6MTN9.qlolnbHbJeQZOO7P_m00FGv-Hb206l-ajssLxRnsdSc'
        refresh = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNzc5NTU2OSwiaWF0IjoxNzMwMDE5NTY5LCJqdGkiOiJiMjU1MDdkNjI1N2Y0NzgwOTYzMTc0N2NlZTk3ZTkyYSIsInVzZXJfaWQiOjEzfQ.SKMHVWprzMuFxNWJZw03seFAb_GM7WDgCz3XqSbEhI0'
      }
      console.log("Token Akses: ", access)
      console.log("Token Refresh: ", refresh)
      setTokenAccess(access)
      setTokenRefresh(refresh)
      await storeToken()
      console.log("Get token telah selesai dijalankan");
    } catch (error) {
      console.error("Error retrieving tokens:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      try {
        const response = await axios.get("http://192.168.88.169:8000/api", {
          headers: { Authorization: `Bearer ${tokenAccess}` },
        })
        setResponse(response);
      } catch (error) {
        // const err = error as AxiosError
        // if (err.response && err.response.status === 401) {
        //   console.log('renew');
        //   try {
        //     const newTokenResponse = await axios.post(
        //       "http://192.168.88.169:8000/api/token/refresh",
        //       { refresh: token.refresh }
        //     );
        //     const newTokenData = newTokenResponse.data;
        //     setToken({ access: newTokenData.access, refresh: newTokenData.refresh });
        //     await storeToken();
        //   }catch (refreshError){
        //     throw new Error(
        //       "Sorry, your token API has expired (90 days). Please renew your session."
        //     );
        //   }
        // }
      }
    };
    fetchData();
  }, [getToken]);

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
