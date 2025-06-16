import api, { authApi } from "@/lib/fetcher";
import { User } from "@/types";

export async function getUsers() {
  const res = await authApi.get(`/users/`);
  return res.data as User[];
}

export async function updateUser({
  id,
  params,
}: {
  id: number;
  params: Partial<Omit<User, "id">>;
}) {
  const res = await api.patch(`/account/users/${id}/`, {
    ...params,
  });
  return res.data;
}
