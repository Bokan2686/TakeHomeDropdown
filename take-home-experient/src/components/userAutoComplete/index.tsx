import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import fetchUsers from "../../utils/fetch/users";
import type { User } from "../../utils/fetch/users";
import { getName, getShortZipCode } from "../../utils/helpers";

interface UserName {
  label: string;
  id: number;
}

const UserAutoComplete = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [names, setNames] = useState<Array<UserName>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        const names = data.map((user: User) => {
          return {
            label: getName(user),
            id: user.id,
          };
        });
        interface NameOption {
          label: string;
          id: number;
        }

        names.sort((a: NameOption, b: NameOption): number => {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
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
    newValue: UserName | null
  ) => {
    if (newValue) {
      const user = users.find((user) => user.id === newValue.id);
      if (user) {
        setSelectedUser({
          ...user,
          name: newValue.label,
        });
      }
    } else {
      setSelectedUser(null);
    }
  };

  return (
    <div className="auto-complete">
      <Autocomplete
        disablePortal
        options={names}
        sx={{ width: 300 }}
        onChange={handleChange}
        loading={loading}
        renderInput={(params) => <TextField {...params} label="Name" />}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {selectedUser && (
        <div className="user-details">
          <p>{selectedUser?.name}</p>
          <p>{selectedUser?.address.street}</p>
          <p>{selectedUser?.address.suite}</p>
          <p>{getShortZipCode(selectedUser?.address.zipcode)}</p>
        </div>
      )}
    </div>
  );
};

export default UserAutoComplete;
