import React, { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { taskService } from '../services/taskService';
// Temporarily removed icons to fix crash
// import { Plus, Layout, List as ListIcon, Calendar, CheckCircle, CircleDashed, Clock } from 'lucide-react';
import clsx from 'clsx';
import './TaskManage.css';

const TaskManage = () => {
    const [view, setView] = useState('BOARD'); // BOARD or LIST
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await taskService.getTasks();
            setTasks(data);
        };
        fetchTasks();
    }, []);

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 bg-white rounded-lg p-1 border">
                    <button
                        className={clsx('view-metrics', view === 'BOARD' && 'active')}
                        onClick={() => setView('BOARD')}
                    >
                        <span>[Kanban]</span>
                        <span>カンバン</span>
                    </button>
                    <button
                        className={clsx('view-metrics', view === 'LIST' && 'active')}
                        onClick={() => setView('LIST')}
                    >
                        <span>[List]</span>
                        <span>リスト</span>
                    </button>
                </div>
                <Button>タスク追加</Button>
            </div>

            {view === 'BOARD' ? <BoardView tasks={tasks} /> : <ListView tasks={tasks} />}
        </div>
    );
};

const BoardView = ({ tasks }) => {
    const columns = [
        { id: 'TODO', label: '未着手', color: 'slate' },
        { id: 'IN_PROGRESS', label: '進行中', color: 'blue' },
        { id: 'DONE', label: '完了', color: 'green' }
    ];

    return (
        <div className="flex gap-6 h-full overflow-x-auto pb-4">
            {columns.map(col => (
                <div key={col.id} className="board-column">
                    <div className="column-header">
                        <div className={`icon-wrapper bg-${col.color}-100 text-${col.color}-600`}>
                            <span>#</span>
                        </div>
                        <span className="font-bold text-slate-700">{col.label}</span>
                        <Badge variant="gray" className="ml-auto">
                            {tasks.filter(t => t.status === col.id).length}
                        </Badge>
                    </div>
                    <div className="column-body">
                        {tasks.filter(t => t.status === col.id).map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ListView = ({ tasks }) => (
    <Card>
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                    <th className="p-4">タスク名</th>
                    <th className="p-4">顧客名</th>
                    <th className="p-4">期限</th>
                    <th className="p-4">優先度</th>
                    <th className="p-4">ステータス</th>
                    <th className="p-4">担当</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => (
                    <tr key={task.id} className="border-b hover:bg-slate-50">
                        <td className="p-4 font-medium">{task.title}</td>
                        <td className="p-4">{task.client_name}</td>
                        <td className="p-4">{task.due_date}</td>
                        <td className="p-4">
                            <Badge variant={task.priority === 'HIGH' ? 'red' : task.priority === 'MED' ? 'yellow' : 'blue'}>
                                {task.priority}
                            </Badge>
                        </td>
                        <td className="p-4">
                            <Badge variant={task.status === 'DONE' ? 'green' : 'gray'}>
                                {task.status}
                            </Badge>
                        </td>
                        <td className="p-4">{task.assignee_name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

const TaskCard = ({ task }) => (
    <div className="task-card">
        <div className="flex justify-between items-start mb-2">
            <Badge variant={task.priority === 'HIGH' ? 'red' : task.priority === 'MED' ? 'yellow' : 'blue'}>
                {task.priority}
            </Badge>
            {task.auto_generated && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded border border-purple-200">AUTO</span>
            )}
        </div>
        <h4 className="font-medium text-slate-800 mb-1">{task.title}</h4>
        <p className="text-xs text-slate-500 mb-3">{task.client_name}</p>

        <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
                <span>Due:</span>
                {task.due_date}
            </div>
            <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px]">
                    {task.assignee_name[0]}
                </div>
                {task.assignee_name}
            </div>
        </div>
    </div>
);

export default TaskManage;
