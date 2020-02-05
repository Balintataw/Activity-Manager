import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { List } from "semantic-ui-react";

import Header from "./components/Header";
import "./App.css";

interface IValue {
  id: string;
  name: string;
}

const App: React.FC = () => {
  const [values, setValues] = useState<IValue[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await axios.get<IValue[]>(
        "http://localhost:5000/api/values"
      );
      setValues(response.data);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e);
    }
  };

  return (
    <div>
      <Header />
      <List>
        {values.map((val, idx) => (
          <List.Item key={idx}>{val.name}</List.Item>
        ))}
      </List>
    </div>
  );
};

export default App;
