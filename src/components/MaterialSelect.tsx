"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getMaterials } from "@/app/actions/master-actions"

interface MaterialSelectProps {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
  required?: boolean
  placeholder?: string
}

export function MaterialSelect({ 
  value, 
  onValueChange, 
  disabled, 
  placeholder = "Select material reference..." 
}: MaterialSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [materials, setMaterials] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getMaterials()
        setMaterials(data)
      } catch (error) {
        console.error("Failed to load materials", error)
      } finally {
        setLoading(false)
      }
    }
    loadMaterials()
  }, [])

  const selectedMaterial = materials.find((m) => m.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-800"
          disabled={disabled || loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading materials...</span>
            </div>
          ) : selectedMaterial ? (
            <div className="flex flex-col items-start overflow-hidden">
               <span className="truncate">{selectedMaterial.name || selectedMaterial.markNo}</span>
               <span className="text-[10px] text-slate-400 font-mono truncate">{selectedMaterial.heatNumber || 'No Heat'}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl border-none shadow-2xl overflow-hidden">
        <Command>
          <CommandInput placeholder="Search material description, mark, or heat..." className="h-12 border-none focus:ring-0" />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-slate-400 font-medium">No materials found.</CommandEmpty>
            <CommandGroup className="p-2">
              {materials.map((m) => (
                <CommandItem
                  key={m.id}
                  value={`${m.name} ${m.markNo} ${m.heatNumber} ${m.dwgNo}`}
                  onSelect={() => {
                    onValueChange(m.id)
                    setOpen(false)
                  }}
                  className="rounded-xl p-3 cursor-pointer mb-1 focus:bg-teal-50"
                >
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-slate-800">{m.name || m.markNo || m.markSpec}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5">
                       <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">{m.heatNumber || 'HEAT-NA'}</span>
                       <span>•</span>
                       <span>{m.dwgNo || 'No Drawing'}</span>
                       <span>•</span>
                       <span className="text-teal-600 font-bold">{m.quantity} {m.unit}</span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-teal-600",
                      value === m.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
