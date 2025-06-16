import api from "@/lib/fetcher";
import { Faculty } from "@/types";

export async function getFaculties() {
  const res = await api.get(`/main_config/faculty/`);
  return res.data.results as Faculty[];
}

export async function getFaculty(id: number) {
  const res = await api.get(`/main_config/faculty/${id}/`);
  return res.data as Faculty;
}

export async function createFaculty(params: Omit<Faculty, "id"|"field">&{field_id:number}) {
  const res = await api.post(`/main_config/faculty/`, {
    name: params?.name,
    field: params.field_id,
    acronym: params.acronym,
    coordinator:null,
    secretary:null
  });
  return res.data;
}

export async function updateFaculty({
  id,
  params,
}: {
  id: number;
  params: Omit<Faculty, "id"|"field">&{field_id:number};
}) {
  const res = await api.put(`/main_config/faculty/${id}/`, {
    name: params?.name,
    field: params.field_id,
    acronym: params.acronym,
    coordinator:null,
    secretary:null
  });
  return res.data;
}

export async function deleteFaculty(id: number) {
  const res = await api.delete(`/main_config/faculty/${id}/`);
  return res.data;
}

export function getCurrentFacultiesAsOptions(faculties?: Faculty[]) {
  return faculties?.map((faculty) => {
    return { value: faculty.id, label: faculty.name };
  });
}

export async function getFacultyDashboard(yearId: number, facultyId: number) {
  const res = await api.get(
    `/faculty/faculty-dashboard/?academic_year__id=${yearId}&faculty__id=${facultyId}`
  );
  return res.data as {
    student_counter: number;
    male_count: number;
    female_count: number;
    actif_count: number;
    inactif_count: number;
    departement_count: number;
  };
}