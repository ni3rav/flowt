"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Users2 } from "lucide-react"

interface Member {
  id: string
  name: string
  role: string
}

export default function ApprovalRulesForm() {
  const [members, setMembers] = useState<Member[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [description, setDescription] = useState("")
  const [manager, setManager] = useState<string>("")
  const [isManagerApprover, setIsManagerApprover] = useState(false)
  const [approvers, setApprovers] = useState<Record<string, boolean>>({})
  const [minApprovalPercent, setMinApprovalPercent] = useState<number>(75)
  const [loading, setLoading] = useState(true)
  const [apiResponse, setApiResponse] = useState<any>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/organization/list-members", { credentials: "include" })
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    const payload = {
      userId: selectedUser,
      description,
      manager,
      isManagerApprover,
      approvers: Object.entries(approvers)
        .filter(([_, required]) => required)
        .map(([userId]) => ({ userId })),
      minimumApprovalPercentage: minApprovalPercent,
    }

    try {
      const res = await fetch("/api/approval-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setApiResponse({ status: res.status, data })
    } catch (err) {
      setApiResponse({ error: String(err) })
    }
  }

  const managers = members.filter((m) => m.role === "manager")

  // 🟢 Empty State (no members or still loading)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground space-y-3">
        <div className="animate-spin">
          <Users2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <p>Loading members...</p>
      </div>
    )
  }

  if (members.length===0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-3 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <h2 className="text-lg font-semibold">No members found</h2>
        <p className="text-sm text-muted-foreground">
          Add team members before creating approval rules.
        </p>
        <Button variant="outline" onClick={fetchMembers}>
          Retry
        </Button>
      </div>
    )
  }

  // 🟢 Main Form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create or Edit Approval Rule</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          <div>
            <Label>User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description about the rule</Label>
            <Textarea
              placeholder="e.g. Expense approval for team members under ₹10,000"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Manager</Label>
            <Select value={manager} onValueChange={setManager}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Approvers</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="isManagerApprover"
                checked={isManagerApprover}
                onCheckedChange={(val) => setIsManagerApprover(!!val)}
              />
              <Label htmlFor="isManagerApprover">Is manager an approver?</Label>
            </div>

            <Separator className="my-3" />

            <div className="space-y-2">
              <Label className="font-semibold">Manager Approvals</Label>
              {managers.length ? (
                managers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between">
                    <Label htmlFor={m.id}>{m.name}</Label>
                    <Checkbox
                      id={m.id}
                      checked={approvers[m.id] || false}
                      onCheckedChange={(val) =>
                        setApprovers((prev) => ({
                          ...prev,
                          [m.id]: !!val,
                        }))
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No managers available to assign as approvers.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Label>Minimum Approval Percentage: {minApprovalPercent}%</Label>
            <Slider
              value={[minApprovalPercent]}
              onValueChange={(v) => setMinApprovalPercent(v[0])}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          <Button onClick={handleSubmit} className="mt-4 w-full">
            Save Approval Rule
          </Button>
        </div>
      </CardContent>

      {apiResponse && (
        <div className="p-4 bg-muted rounded-md mt-4 text-xs overflow-auto">
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </Card>
  )
}