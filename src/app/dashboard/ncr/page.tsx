import { getNCRs } from "@/app/actions/qc-actions"
import { NCRView } from "./NCRView"

export default async function NCRPage() {
  const ncrs = await getNCRs()
  
  return <NCRView initialData={ncrs} />
}
