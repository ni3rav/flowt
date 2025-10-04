'use client'

import React, { useState } from 'react'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApproveRules() {
    // Dummy data
    const users = [
        'Alice Johnson',
        'Bob Williams',
        'Charlie Brown',
        'Diana Miller',
    ]
    const managers = ['Robert Smith', 'Susan Davis', 'John Carter']

    // Local state
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [manager, setManager] = useState<string>('')
    const [isManagerApprover, setIsManagerApprover] = useState<boolean>(false)
    const [minApproval, setMinApproval] = useState<number>(50)
    const [approvers, setApprovers] = useState<Record<string, boolean>>({
        'Robert Smith': false,
        'Susan Davis': false,
        'John Carter': false,
    })
    const [description, setDescription] = useState('')

    const toggleApprover = (name: string) => {
        setApprovers((prev) => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Approval Rules</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT SIDE */}
                    <div className="space-y-5">
                        {/* User */}
                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select value={selectedUser} onValueChange={setSelectedUser}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u} value={u}>
                                            {u}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Rule Description */}
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe the rule or approval condition..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>

                        {/* Manager */}
                        <div className="space-y-2">
                            <Label>Manager</Label>
                            <Select value={manager} onValueChange={setManager}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a manager" />
                                </SelectTrigger>
                                <SelectContent>
                                    {managers.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-6">
                        {/* Is manager an approver */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="isManagerApprover"
                                checked={isManagerApprover}
                                onCheckedChange={(checked) =>
                                    setIsManagerApprover(checked as boolean)
                                }
                            />
                            <Label htmlFor="isManagerApprover">
                                Is the manager an approver?
                            </Label>
                        </div>

                        {/* Approver List */}
                        <div className="space-y-2">
                            <Label>Managers requiring approval</Label>
                            <div className="border rounded-md divide-y">
                                {managers.map((m) => (
                                    <div
                                        key={m}
                                        className="flex items-center justify-between px-3 py-2"
                                    >
                                        <span>{m}</span>
                                        <Checkbox
                                            checked={approvers[m]}
                                            onCheckedChange={() => toggleApprover(m)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Minimum Approval Percentage */}
                        <div className="space-y-2">
                            <Label>Minimum Approval Percentage</Label>
                            <Input
                                type="number"
                                value={minApproval}
                                onChange={(e) => setMinApproval(Number(e.target.value))}
                                min={0}
                                max={100}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}