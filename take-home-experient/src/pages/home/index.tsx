import { useState, useEffect } from "react";
import fetchUsers from "../../utils/fetch/users";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface UserName {
  formattedName: string;
  id: number;
}

const Home = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [names, setNames] = useState<Array<UserName>>([]);
  const [selectedUser, setSelectedUser] = useState<User>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User>(users[0]);
  const [inputValue, setInputValue] = useState("");

  function getName(user: User): string {
    console.log("User Name:", user.name);
    let title = null;
    let first = null;
    let last = null;
    const nameArray = user.name.split(" ");
    if (
      nameArray[0] === "Mr." ||
      nameArray[0] === "Ms." ||
      nameArray[0] === "Mrs."
    ) {
      title = nameArray[0];
      nameArray.splice(0, 1);
    }

    first = nameArray[0];
    nameArray.splice(0, 1);

    last = nameArray.join(" ");

    return `${last}, ${first} ${title ? `(${title})` : ""}`;
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        const names = data.map((user: User) => {
          return {
            label: getName(user),
            id: user.id,
          };
        });
        setNames(names);
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: { label: string; id: number } | null
  ) => {
    if (newValue) {
      const user = users.find((user) => user.id === newValue.id);
      if (user) {
        setSelectedUser({
          ...user,
          name: newValue.label,
        });
      }
    }
  };

  const getZipCode = (zip: string): string => {
    const zipCodeMatch = zip.match(/(\d{5})/);
    let zipCode = "";
    if (zipCodeMatch) {
      zipCode = zipCodeMatch[0]; // zipCode will be "12345"
    }

    return zipCode;
  };

  return (
    <div className="container">
      <div className="autocomplete">
        <Autocomplete
          disablePortal
          options={names}
          sx={{ width: 300 }}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} label="Name" />}
        />

        {selectedUser && (
          <div className="user-details">
            <p>{selectedUser?.name}</p>
            <p>{selectedUser?.address.street}</p>
            <p>{selectedUser?.address.suite}</p>
            <p>{getZipCode(selectedUser?.address.zipcode)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
