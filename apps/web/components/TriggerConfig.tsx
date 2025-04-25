"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Field {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "boolean";
    required: boolean; 
    placeholder: string;
    option?: {value:string,label:string}[];
}

interface TriggerConfigProps {
    triggerId: string;
    onSaveConfig: (triggerId: string, metadata: Record<string,any>) => void;
    existingMetadata?: Record<string,any>;
}

export default function TriggerConfig({triggerId, onSaveConfig, existingMetadata}: TriggerConfigProps) {
    const [fields, setFields] = useState<Field[]>([]);
    const [values, setValues] = useState<Record<string,any>>(existingMetadata || {});
    const [loading, setLoading] = useState(false);
    const [folders, setFolders] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchFields = async () => {
        try {
            setLoading(true);
            // This endpoint would need to be implemented to return trigger fields
            const fetchedFields = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/triggers/${triggerId}/fields`)
            // Ensure fields is always an array
            setFields(Array.isArray(fetchedFields.data) ? fetchedFields.data : []);
            console.log('Fetched fields:', fetchedFields.data);
        } catch (error) {
            console.log(error);
            // Initialize with empty array on error
            setFields([]);
        } finally {
            setLoading(false);
        }
    }
    
    const fetchFolders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/drive/folders`);
            
            // Check if the response contains an error message
            if (response.data && response.data.error) {
                setError(response.data.error);
                setFolders([]);
                return;
            }
            
            // If the response is a valid array, use it
            if (Array.isArray(response.data)) {
                setFolders(response.data);
            } else {
                console.warn("Unexpected response format:", response.data);
                setError("Invalid response format");
                setFolders([]);
            }
        } catch (error: any) {
            console.error("Error fetching folders:", error);
            setError(error.message || "Failed to fetch folders");
            setFolders([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFields();
        fetchFolders();
    }, [triggerId])

    const handleChange = (name: string, value: string) => {
        setValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleSubmit = () => {
        setSaving(true);
        console.log('Saving trigger configuration:', triggerId, values);
        onSaveConfig(triggerId, values);
        setTimeout(() => setSaving(false), 500);
    }
    
    const handleRetry = () => {
        fetchFolders();
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Configure Trigger</h3>
            {loading && <div className="text-gray-400 text-center text-sm">Loading...</div>}
            {fields.length === 0 ? (
                <p className="text-gray-500">No fields to configure.</p>
            ) : (
                <div className="space-y-4">
                    {fields.map((f) => (
                        <div key={f.name}>
                            <label className="block text-sm font-medium text-gray-700">{f.label}{f.required && <span className="text-red-500">*</span>}</label>
                            {
                                f.type === "text" && (
                                <input
                                    type="text"
                                    placeholder={f.placeholder}
                                    className="w-full p-2 border rounded-md"
                                    value={values[f.name] ?? ""}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                />
                                )
                            }
                            {
                                f.type === "number" && (
                                <input
                                    type="number"
                                    placeholder={f.placeholder}
                                    className="w-full p-2 border rounded-md"
                                    value={values[f.name] ?? 0}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                />
                                )
                            }
                            {
                                f.type === "select" && (
                                <>
                                    {error && (
                                        <div className="mb-2">
                                            <div className="text-red-500 text-sm mb-2">
                                                {error === "Google Drive account not connected" 
                                                    ? "You need to connect your Google Drive account first" 
                                                    : error}
                                            </div>
                                            <button 
                                                onClick={handleRetry}
                                                className="text-blue-500 text-sm hover:underline flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Retry
                                            </button>
                                        </div>
                                    )}
                                    <Select
                                        value={values[f.name] || ""}
                                        onValueChange={(value) => handleChange(f.name, value)}
                                        disabled={!!error}
                                    >   
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={error ? "Please fix errors above" : "Select an option"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {f.option && f.option.length > 0 ? (
                                                f.option.map((o) => (
                                                    <SelectItem key={o.value} value={o.value}>
                                                        {o.label}
                                                    </SelectItem>
                                                ))
                                            ) : folders.length > 0 ? (
                                                folders.map((folder) => (
                                                    <SelectItem key={folder.id} value={folder.id}>
                                                        {folder.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-options" disabled>
                                                    {error ? "Error loading options" : "No options available"}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </>     
                                )
                            }
                            {
                                f.type === "boolean" && (
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 border rounded"
                                    checked={values[f.name] ?? false}
                                    onChange={(e) => handleChange(f.name, e.target.checked.toString())}
                                />
                                )
                            }
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
                            disabled={!!error || saving}
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : "Save"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}