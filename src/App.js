import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const [fetchData, setFetchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getdb")
      .then((result) => {
        console.log("Data received:", result.data);
        setFetchData(result.data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  const textHandler = (e) => {
    e.preventDefault();

    setText(newText);

    axios
      .post("http://localhost:5000/postdb", { t: newText })
      .then((response) => {
        console.log("Data is sent successfully:", response);
      })
      .catch((error) => {
        console.log("Error sending data:", error);
      });

    setNewText("");
  };

  const handleCheckboxChange = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const deleteHandler = () => {
    const itemsToDelete = selectedItems.map((index) => fetchData[index]);

    axios
      .delete("http://localhost:5000/deletedb", { data: itemsToDelete })
      .then((response) => {
        console.log("Item deleted successfully: ", response);
        axios.get("http://localhost:5000/getdb").then((result) => {
          setFetchData(result.data);
          setSelectedItems([]);
        });
      })
      .catch((error) => {
        console.log("Error deleting item: ", error);
      });
  };

  const updateHandler = () => {
    const itemsToUpdate = selectedItems.map((index) => {
      const item = fetchData[index];
      return { _id: item._id, t: newText };
    });

    axios
      .put("http://localhost:5000/updatedb", itemsToUpdate)
      .then((response) => {
        console.log("Item updated successfully: ", response);
        return axios.get("http://localhost:5000/getdb");
      })
      .then((result) => {
        setFetchData(result.data);
        setSelectedItems([]);
      })
      .catch((error) => {
        console.log("Error updating item: ", error);
      });
  };

  const refreshHandler = () => {
    axios
      .get("http://localhost:5000/getdb")
      .then((result) => {
        console.log("Data received:", result.data);
        setFetchData(result.data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  };

  const deleteAllHandler = () => {
    axios
      .delete("http://localhost:5000/deleteall")
      .then((response) => {
        console.log("All items deleted successfully: ", response);
        setFetchData([]);
        setSelectedItems([]);
      })
      .catch((error) => {
        console.log("Error deleting all items: ", error);
      });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
      <form onSubmit={textHandler}>
        <label>Enter Text:</label>
        <input
          type="text"
          value={newText}
          onChange={(event) => setNewText(event.target.value)}
        />
        <button type="submit">Next</button>
        <button type="button" onClick={deleteHandler}>
          Delete Selected
        </button>
        <button type="button" onClick={updateHandler}>
          Update Selected
        </button>
        <button type="button" onClick={refreshHandler}>
          Refresh
        </button>
        <button type="button" onClick={deleteAllHandler}>
          Delete All
        </button>
        <br />
        <p>This input is: {text}</p>
        <br />
        <div className="list-container">
          <p>
            This is data:{" "}
            {fetchData.length > 0 ? (
              fetchData.map((item, index) => (
                <div
                  key={index}
                  className={`list-item ${selectedItems.includes(index) ? 'selected' : ''}`}
                  onClick={() => handleCheckboxChange(index)}
                >
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={selectedItems.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                    className="checkbox"
                  />
                  <label htmlFor={`checkbox-${index}`}>
                    {typeof item === "object" ? item.t : item}
                  </label>
                </div>
              ))
            ) : (
              <li>No data available</li>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}

export default App;
