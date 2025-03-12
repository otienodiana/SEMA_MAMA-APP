import { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("https://sema-mama-app.onrender.com/api/files")
      .then(response => response.json())
      .then(data => setFiles(data))
      .catch(error => console.error("Error fetching files:", error));
  }, []);

  return (
    <DataContext.Provider value={{ files }}>
      {children}
    </DataContext.Provider>
  );
}
