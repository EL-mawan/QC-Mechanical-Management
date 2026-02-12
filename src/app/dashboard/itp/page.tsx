import { getITPs } from "@/app/actions/qc-actions"
import { ITPView } from "./ITPView"

export default async function ITPPage() {
  const itps = await getITPs()
  
  return <ITPView initialData={itps} />
}
