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
    return () => {
      setUsers([]);
      setNames([]);
      setSelectedUser(null);
      setLoading(false);
      setError(null);
    };
  }, []);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: UserName | null
  ) => {
    if (
      event.type === "keydown" &&
      "key" in event &&
      (event as React.KeyboardEvent).key !== "Enter"
    ) {
      return; // Ignore non-Enter key events
    }
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
        renderInput={(params) => (
          <TextField
            data-testid="auto-complete-label"
            {...params}
            label="Name"
          />
        )}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {selectedUser && (
        <div className="user-details" data-testid="user-details">
          <p data-testid="detail-name">{selectedUser?.name}</p>
          <p data-testid="detail-street">{selectedUser?.address.street}</p>
          <p data-testid="detail-suite">{selectedUser?.address.suite}</p>
          <p data-testid="detail-zip">
            {getShortZipCode(selectedUser?.address.zipcode)}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserAutoComplete;
