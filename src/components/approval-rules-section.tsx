"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ApprovalRulesSection() {
  const [rules, setRules] = useState<any>(null);
  const [requests, setRequests] = useState<any>(null);
  const [members, setMembers] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const [createRuleData, setCreateRuleData] = useState("");
  const [createRequestData, setCreateRequestData] = useState("");
  const [actionRequestId, setActionRequestId] = useState("");
  const [actionData, setActionData] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchRules(), fetchRequests(), fetchMembers()]);
  };

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/approval-rules");
      const data = await response.json();
      setRules(data);
      setApiResponse({
        type: "GET /api/approval-rules",
        status: response.status,
        data,
      });
    } catch (error) {
      setApiResponse({ type: "GET /api/approval-rules", error: String(error) });
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/approval-requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/auth/organization/list-members", {
        credentials: "include",
      });
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRule = async () => {
    try {
      const payload = JSON.parse(createRuleData);
      const response = await fetch("/api/approval-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setApiResponse({
        type: "POST /api/approval-rules",
        status: response.status,
        data,
      });
      if (response.ok) {
        fetchRules();
      }
    } catch (error) {
      setApiResponse({
        type: "POST /api/approval-rules",
        error: String(error),
      });
    }
  };

  const handleCreateRequest = async () => {
    try {
      const payload = JSON.parse(createRequestData);
      const response = await fetch("/api/approval-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setApiResponse({
        type: "POST /api/approval-requests",
        status: response.status,
        data,
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      setApiResponse({
        type: "POST /api/approval-requests",
        error: String(error),
      });
    }
  };

  const handleAction = async () => {
    try {
      const payload = JSON.parse(actionData);
      const response = await fetch(
        `/api/approval-requests/${actionRequestId}/action`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      setApiResponse({
        type: `POST /api/approval-requests/${actionRequestId}/action`,
        status: response.status,
        data,
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      setApiResponse({
        type: `POST /api/approval-requests/${actionRequestId}/action`,
        error: String(error),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Members Data */}
      <Card>
        <CardHeader>
          <CardTitle>Members (Raw)</CardTitle>
          <CardDescription>
            GET /api/auth/organization/list-members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={fetchMembers}
            variant="outline"
            size="sm"
            className="mb-2"
          >
            Refresh
          </Button>
          <pre className="text-xs overflow-auto bg-muted p-4 rounded-md max-h-96">
            {JSON.stringify(members, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Approval Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Rules (Raw)</CardTitle>
          <CardDescription>GET /api/approval-rules</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={fetchRules}
            variant="outline"
            size="sm"
            className="mb-2"
          >
            Refresh
          </Button>
          <pre className="text-xs overflow-auto bg-muted p-4 rounded-md max-h-96">
            {JSON.stringify(rules, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Create Rule */}
      <Card>
        <CardHeader>
          <CardTitle>Create Approval Rule</CardTitle>
          <CardDescription>POST /api/approval-rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>JSON Payload</Label>
          <textarea
            className="w-full p-2 border rounded-md font-mono text-xs min-h-32"
            placeholder='{"userId":"...","ruleName":"...","isSequential":false,"minimumApprovalPercentage":75,"approvers":[{"userId":"..."}]}'
            value={createRuleData}
            onChange={(e) => setCreateRuleData(e.target.value)}
          />
          <Button onClick={handleCreateRule} size="sm">
            Create Rule
          </Button>
        </CardContent>
      </Card>

      {/* Approval Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests (Raw)</CardTitle>
          <CardDescription>GET /api/approval-requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={fetchRequests}
            variant="outline"
            size="sm"
            className="mb-2"
          >
            Refresh
          </Button>
          <pre className="text-xs overflow-auto bg-muted p-4 rounded-md max-h-96">
            {JSON.stringify(requests, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Create Request */}
      <Card>
        <CardHeader>
          <CardTitle>Create Approval Request</CardTitle>
          <CardDescription>POST /api/approval-requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>JSON Payload</Label>
          <textarea
            className="w-full p-2 border rounded-md font-mono text-xs min-h-20"
            placeholder='{"approvalRuleId":"..."}'
            value={createRequestData}
            onChange={(e) => setCreateRequestData(e.target.value)}
          />
          <Button onClick={handleCreateRequest} size="sm">
            Create Request
          </Button>
        </CardContent>
      </Card>

      {/* Approval Action */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Action</CardTitle>
          <CardDescription>
            POST /api/approval-requests/[id]/action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label>Request ID</Label>
            <Input
              placeholder="Request ID"
              value={actionRequestId}
              onChange={(e) => setActionRequestId(e.target.value)}
            />
          </div>
          <div>
            <Label>JSON Payload</Label>
            <textarea
              className="w-full p-2 border rounded-md font-mono text-xs min-h-20"
              placeholder='{"action":"approved","notes":"..."}'
              value={actionData}
              onChange={(e) => setActionData(e.target.value)}
            />
          </div>
          <Button onClick={handleAction} size="sm">
            Submit Action
          </Button>
        </CardContent>
      </Card>

      {/* API Response */}
      <Card>
        <CardHeader>
          <CardTitle>Last API Response (Raw)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto bg-muted p-4 rounded-md max-h-96">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
