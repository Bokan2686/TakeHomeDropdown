import AutoComplete from "../../components/userAutoComplete";
import { useEffect, useState } from "react";
import { getName } from "../../utils/helpers";
import fetchUsers from "../../utils/fetch/users";
import type { User } from "../../utils/fetch/users";

interface UserName {
  label: string;
  id: number;
}

const Home = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [names, setNames] = useState<Array<UserName>>([]);

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
      setLoading(false);
      setError(null);
    };
  }, []);

  return (
    <div className="container">
      <AutoComplete
        users={users}
        names={names}
        error={error}
        loading={loading}
      />
    </div>
  );
};
export default Home;
