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

interface ActionConfigProps {
    actionId: string;
    onSaveConfig: (actionId: string, metadata: Record<string,any>) => void;
    existingMetadata?: Record<string,any>;
}

export default function ActionConfig({actionId, onSaveConfig, existingMetadata}: ActionConfigProps) {
    const [field, setField] = useState<Field[]>([]);
    const [choices, setChoices] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [values, setValues] = useState<Record<string,any>>(existingMetadata || {});
    const [loading, setLoading] = useState(false);

    const fetchField = async () => {
        try {
            setLoading(true);
            const fetchedField = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/actions/${actionId}/fields`)
            setField(fetchedField.data.fields || []);
        } catch (error) {
            console.log("Error fetching fields:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchChoices = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes`);
            
            // Check if the response contains an error message
            if (response.data && response.data.error) {
                setError(response.data.error);
                setChoices([]);
                return;
            }
            
            // If the response is a valid array, use it
            if (Array.isArray(response.data)) {
                setChoices(response.data);
            } else {
                // If we don't recognize the response format
                console.warn("Unexpected response format:", response.data);
                setError("Invalid response format");
                setChoices([]);
            }
        } catch (error: any) {
            console.error("Error fetching choices:", error);
            setError(error.message || "Failed to fetch classes");
            setChoices([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchField();
        fetchChoices();
    }, [actionId]);

    const handleChange = (name: string, value: string) => {
        setValues((prev) => ({
            ...prev,
            [name]: value
        }));
        
    }

    const handleSubmit = () => {
        // First log for debugging
        console.log('Saving action configuration:', actionId, values);
        
        // Then pass the actionId and the current values to the parent component
        // This will trigger the onUpdateActionMetadata function in the parent
        // which will update the metadata and save it to the database
        onSaveConfig(actionId, values);
    }

    const handleRetry = () => {
        fetchChoices();
    }

    return (
        <div className="mt-2 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Configure Action</h3>
            {loading && <div className="text-gray-400 mb-2 animate-in text-center text-sm">Loading...</div>}
            {field.length === 0 ? (
                <p className="mt-2 text-center">No configuration fields available.</p>
            ) : (
                <div className="space-y-4">
                    {field.map((f) => (
                        <div key={f.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {f.label}{f.required && <span className="text-red-500">*</span>}
                            </label>
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
                                                {error === "Google Classroom account not connected" 
                                                    ? "You need to connect your Google Classroom account first" 
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
                                            <SelectValue placeholder={error ? "Please fix errors above" : "Select a class"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {choices.length > 0 ? (
                                                choices.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name || c.title || "Unnamed class"}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-options" disabled>
                                                    {error ? "Error loading classes" : "No classes available"}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </>     
                                )
                            }
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            disabled={!!error}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}