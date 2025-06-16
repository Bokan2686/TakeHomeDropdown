import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import type { User } from "../../utils/fetch/users";
import { getShortZipCode } from "../../utils/helpers";

interface UserName {
  label: string;
  id: number;
}

const UserAutoComplete = ({
  users,
  names,
  error,
  loading,
}: {
  users: Array<User>;
  names: Array<UserName>;
  error?: string | null;
  loading?: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: UserName | null
  ) => {
    if (
      event.type === "keydown" &&
      "key" in event &&
      (event as React.KeyboardEvent).key !== "Enter"
    ) {
      return;
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
