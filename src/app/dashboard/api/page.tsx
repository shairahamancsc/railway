
"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const CodeBlock = ({ code }: { code: string }) => (
    <pre className="mt-2 rounded-md bg-muted p-4 text-sm font-mono overflow-x-auto">
        <code>{code}</code>
    </pre>
);


export default function ApiPage() {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setBaseUrl(window.location.origin);
    }
  }, []);

  const endpoints = [
    {
      method: "POST",
      path: "/api/login",
      description: "Authenticates a user and returns a token upon success.",
      body: `{\n  "username": "Admin",\n  "password": "password"\n}`,
      successResponse: `{\n  "success": true,\n  "message": "Login successful.",\n  "token": "authenticated"\n}`,
      errorResponse: `{\n  "success": false,\n  "message": "Invalid username or password."\n}`
    },
    {
      method: "GET",
      path: "/api/labourers",
      description: "Returns a list of all registered workers. Requires authentication.",
      successResponse: `[\n  {\n    "id": "uuid-goes-here",\n    "fullName": "Ramesh Kumar",\n    "designation": "Skilled Labour",\n    "daily_salary": 600,\n    ...\n  }\n]`
    },
    {
      method: "GET",
      path: "/api/supervisors",
      description: "Returns a list of all registered supervisors. Requires authentication.",
      successResponse: `[\n  {\n    "id": "uuid-goes-here",\n    "name": "Sanjay Singh",\n    "created_at": "2023-10-27T10:00:00Z"\n  }\n]`
    },
    {
      method: "GET",
      path: "/api/attendance",
      description: "Returns all attendance records. Requires authentication.",
      successResponse: `[\n  {\n    "date": "2023-10-27",\n    "records": [\n      {\n        "labourerId": "uuid-goes-here",\n        "status": "present",\n        "advance": 100,\n        "remarks": "Paid for lunch"\n      }\n    ],\n    ...\n  }\n]`
    },
  ];

  const getCurlCommand = (endpoint: typeof endpoints[0]) => {
    if (endpoint.method === "POST") {
        return `curl -X POST ${baseUrl}${endpoint.path} \\\n  -H "Content-Type: application/json" \\\n  -d '${endpoint.body}'`;
    }
    return `curl ${baseUrl}${endpoint.path} \\\n  -H "Authorization: Bearer YOUR_AUTH_TOKEN"`;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <Code className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
        <div className="hidden md:block">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
            API Documentation
            </h1>
            <p className="text-muted-foreground mt-1">
                A guide to interacting with the application's API endpoints.
            </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
             <KeyRound className="h-6 w-6 text-primary" />
            <CardTitle>Authentication</CardTitle>
          </div>
          <CardDescription>
            Most API endpoints require authentication. In this example, authentication is simulated. In a real-world scenario, you would pass an API key or a bearer token in the Authorization header.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm">After a successful login to the `/api/login` endpoint, you would typically receive a token. This token should be included in the header of subsequent requests like this:</p>
            <CodeBlock code={`Authorization: Bearer YOUR_AUTH_TOKEN`} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold">Endpoints</h2>
        {endpoints.map((endpoint) => (
          <Card key={endpoint.path}>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'} className="w-fit">{endpoint.method}</Badge>
                    <code className="text-sm font-mono font-bold break-all">{endpoint.path}</code>
                </div>
                <CardDescription className="pt-2">{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="curl">
                    <TabsList className="w-full sm:w-auto h-auto flex-wrap justify-start">
                        {endpoint.method === "POST" && <TabsTrigger value="body">Request Body</TabsTrigger>}
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="success">Success Response</TabsTrigger>
                        {endpoint.errorResponse && <TabsTrigger value="error">Error Response</TabsTrigger>}
                    </TabsList>
                    
                    {endpoint.method === "POST" && endpoint.body && (
                        <TabsContent value="body">
                             <CodeBlock code={endpoint.body} />
                        </TabsContent>
                    )}
                     <TabsContent value="curl">
                        <CodeBlock code={getCurlCommand(endpoint)} />
                    </TabsContent>
                    <TabsContent value="success">
                        <CodeBlock code={endpoint.successResponse || ''} />
                    </TabsContent>
                    {endpoint.errorResponse && (
                         <TabsContent value="error">
                            <CodeBlock code={endpoint.errorResponse} />
                        </TabsContent>
                    )}
                </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
