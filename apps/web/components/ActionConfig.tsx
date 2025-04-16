"use client"

import axios from "axios";
import { useEffect, useState } from "react";

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

export default function ActionConfig({actionId,onSaveConfig,existingMetadata}:ActionConfigProps) {
    const [field,setField] = useState<Field[]>([]);
    const [values,setValues] = useState<Record<string,any>>(existingMetadata || {});
    const [loading,setLoading] = useState(false);

    const fetchField = async () => {
        try {
            setLoading(true);
            const Fetchedfield = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/actions/${actionId}/field`)
            setField(Fetchedfield.data);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchField();
    },[actionId])

    const handleChange = (name:string,value:string) => {
        setValues((prev)=>({
            ...prev,
            [name]:value
        }))
    }
    const handleSubmit = () => {
        onSaveConfig(actionId,values);
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">Configure Action</h3>
            {loading && <div className="text-gray-400 animate-ping text-center text-lg">Loading...</div>}
            {field.length === 0 ? (
                <p className="text-gray-500">No fields to configure.</p>
            ):(
                <div className="space-y-4">
                    {field.map((f)=>(
                        <div key={f.name}>
                            <label className="block text-sm font-medium text-gray-700">{f.label}{f.required && <span className="text-red-500">*</span>}</label>
                            {
                                f.type === "text" && (
                                <input
                                type="text"
                                placeholder={f.placeholder}
                                className="w-full p-2 border rounded-md"
                                value={values[f.name] ?? ""}
                                onChange={(e)=>handleChange(f.name,e.target.value)}
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
                                onChange={(e)=>handleChange(f.name,e.target.value)}
                                />
                                )
                            }
                            {
                                f.type === "select" && (
                                <select
                                className="w-full p-2 border rounded-md"
                                value={values[f.name]?? ""}
                                onChange={(e)=>handleChange(f.name,e.target.value)}
                                >   
                                    <option value="">{"Select an option"}</option>
                                    {f.option?.map((o)=>(
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>     
                                )
                            }
                        
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                        Save Configuration
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
