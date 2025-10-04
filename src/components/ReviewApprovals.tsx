'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Dummy data
const initialRequests = [
    {
        id: 1,
        subject: 'Team Dinner Reimbursement',
        owner: 'Alice Johnson',
        category: 'Meals & Entertainment',
        status: 'Pending',
        amount: 3200,
    },
    {
        id: 2,
        subject: 'Office Supplies Purchase',
        owner: 'Bob Williams',
        category: 'Office Expenses',
        status: 'Pending',
        amount: 1450,
    },
    {
        id: 3,
        subject: 'Client Meeting Travel',
        owner: 'Charlie Brown',
        category: 'Travel',
        status: 'Pending',
        amount: 7200,
    },
    {
        id: 4,
        subject: 'Software Subscription Renewal',
        owner: 'Diana Miller',
        category: 'IT & Software',
        status: 'Pending',
        amount: 5600,
    },
]

export default function ReviewApprovals() {
    const [requests, setRequests] = useState(initialRequests)

    const handleAction = (id: number, action: 'Approved' | 'Rejected') => {
        setRequests((prev) =>
            prev.map((req) =>
                req.id === id ? { ...req, status: action } : req
            )
        )
    }

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Review Approvals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Request Owner</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.subject}</TableCell>
                                    <TableCell>{req.owner}</TableCell>
                                    <TableCell>{req.category}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                req.status === 'Approved'
                                                    ? 'default'
                                                    : req.status === 'Rejected'
                                                        ? 'destructive'
                                                        : 'secondary'
                                            }
                                        >
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>₹{req.amount.toLocaleString()}</TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAction(req.id, 'Approved')}
                                            disabled={req.status !== 'Pending'}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleAction(req.id, 'Rejected')}
                                            disabled={req.status !== 'Pending'}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}