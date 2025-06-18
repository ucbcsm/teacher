import api from "@/lib/fetcher";
import { Year } from "@/types";

export async function getYears() {
  const res = await api.get(`/teacher/academic-year/`);
  return res.data as Year[];
}
    
export function getYearStatusName(
  status: "pending" | "progress" | "finished" | "suspended" | string
) {
  switch (status) {
    case "pending":
      return "En attente";
      break;
    case "progress":
      return "En cours";
      break;
    case "finished":
      return "Terminé";
      break;
    case "suspended":
      return "Suspendu";
      break;
    default:
      return "Inconnu";
  }
}

export function getYearStatusColor(
  status: "pending" | "progress" | "finished" | "suspended" | string
) {
  switch (status) {
    case "pending":
      return "orange";

      break;
    case "progress":
      return "blue";

      break;
    case "finished":
      return "green";

      break;
    case "suspended":
      return "red";

      break;
    default:
      return "default";
  }
}


export function getYearsAsOptions(years?: Year[]) {
  return years?.map((year) => {
    return { value: year.id, label: year.name };
  });
}

function dateDiffInDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  // Calcul de la différence en millisecondes
  const diffTime = end.getTime() - start.getTime()
  // Conversion en jours (arrondi vers le bas)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function getYearProgressPercent(startDate: string, endDate: string): number {
 const today = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (today <= start) return 0
  if (today >= end) return 100

  const totalDays = dateDiffInDays(startDate, endDate)
  const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const percent = (daysPassed / totalDays) * 100
  return Math.round(percent) // Arrondi à l'entier le plus proche
}
