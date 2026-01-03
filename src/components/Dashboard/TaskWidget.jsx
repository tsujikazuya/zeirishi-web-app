import React from 'react';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';

export const TaskWidget = ({ tasks }) => {
    // Filter tasks for dashboard (e.g. Due soon or High Priority)
    const displayTasks = tasks.slice(0, 5); // Show top 5

    const getStatusIcon = (status) => {
        if (status === 'DONE') return <CheckCircle2 className="text-green-500" size={18} />;
        return <Clock className="text-slate-400" size={18} />;
    };

    return (
        <Card title="📝 Myタスク (期限順)" className="h-full">
            <div className="flex flex-col gap-0 divider-y">
                {displayTasks.map((task, index) => (
                    <div key={task.id} className={`p-3 hover:bg-slate-50 flex gap-3 items-start ${index !== displayTasks.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        <div className="mt-1">{getStatusIcon(task.status)}</div>
                        <div className="flex-1">
                            <div className="font-medium text-sm text-slate-800">{task.title}</div>
                            <div className="text-xs text-slate-500 mt-1 flex justify-between">
                                <span>{task.client_name}</span>
                                <span className={`flex items-center gap-1 ${task.priority === 'HIGH' ? 'text-red-600 font-bold' : ''}`}>
                                    <Calendar size={12} /> {task.due_date}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
