import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, AlertCircle, Filter, Search } from 'lucide-react';

export default function Tasks() {
    const [searchParams] = useSearchParams();
    const { userRole } = useApp();
    const [filter, setFilter] = useState({
        status: 'all', // all, pending, completed
        assignee: 'all', // all, me
        priority: 'all', // all, high
    });

    // Parse query params for initial filter
    useEffect(() => {
        const statusParam = searchParams.get('status');
        const priorityParam = searchParams.get('priority');
        const assigneeParam = searchParams.get('assignee');

        if (statusParam) setFilter(prev => ({ ...prev, status: statusParam }));
        if (priorityParam) setFilter(prev => ({ ...prev, priority: priorityParam }));
        if (assigneeParam) setFilter(prev => ({ ...prev, assignee: assigneeParam }));
    }, [searchParams]);

    // Mock Data
    const mockTasks = [
        { id: 1, title: '佐藤様 定期面談', client: '株式会社 佐藤製作所', assignee: 'staff', dueDate: '2025-10-25', priority: 'high', status: 'pending', type: 'visit' },
        { id: 2, title: '田中様 アポ入れ', client: '田中 茂 様', assignee: 'staff', dueDate: '2025-10-26', priority: 'medium', status: 'pending', type: 'call' },
        { id: 3, title: '鈴木様 相続税試算', client: '鈴木 財閥 様', assignee: 'director', dueDate: '2025-10-24', priority: 'high', status: 'pending', type: 'calc' }, // Overdue
        { id: 4, title: '高橋様 書類回収', client: '高橋 不動産 様', assignee: 'staff', dueDate: '2025-11-01', priority: 'low', status: 'completed', type: 'doc' },
        { id: 5, title: '月次報告書作成', client: '社内', assignee: 'director', dueDate: '2025-10-30', priority: 'medium', status: 'pending', type: 'internal' },
    ];

    const filteredTasks = mockTasks.filter(task => {
        // Role Filter (If role is staff, default to showing only own tasks unless 'all' is explicitly requested? Or simplistic view)
        // For this prototype, we'll rely on the manual filter state mostly.

        if (filter.status !== 'all' && task.status !== filter.status) return false;
        if (filter.priority !== 'all' && task.priority !== filter.priority) return false;

        if (filter.assignee === 'me') {
            // Mock logic: 'staff' role sees 'staff' tasks, 'director' sees 'director' tasks
            if (userRole === 'staff' && task.assignee !== 'staff') return false;
            if (userRole === 'director' && task.assignee !== 'director') return false;
        }

        return true;
    });

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>タスク管理</h2>
                <button className="btn-primary">+ タスク追加</button>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                    <Filter size={18} />
                    <span style={{ fontSize: '0.875rem' }}>絞り込み:</span>
                </div>

                <select
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                >
                    <option value="all">全てのステータス</option>
                    <option value="pending">未完了</option>
                    <option value="completed">完了</option>
                </select>

                <select
                    value={filter.priority}
                    onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                >
                    <option value="all">全ての優先度</option>
                    <option value="high">高（至急）</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                </select>

                <select
                    value={filter.assignee}
                    onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                >
                    <option value="all">全ての担当者</option>
                    <option value="me">自分の担当のみ</option>
                </select>

                <div style={{ flex: 1 }}></div>

                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="タスク・顧客名で検索"
                        style={{ padding: '0.5rem 0.5rem 0.5rem 2.2rem', borderRadius: '4px', border: '1px solid #e2e8f0', width: '250px' }}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>タスク名</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>関連案件</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>期限</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>優先度</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>担当者</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b' }}>ステータス</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{task.title}</td>
                                <td style={{ padding: '1rem' }}>{task.client}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isOverdue(task.dueDate) && task.status !== 'completed' && <AlertCircle size={14} color="#e11d48" />}
                                        <span style={{ color: isOverdue(task.dueDate) && task.status !== 'completed' ? '#e11d48' : 'inherit' }}>
                                            {task.dueDate}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <PriorityBadge level={task.priority} />
                                </td>
                                <td style={{ padding: '1rem' }}>{task.assignee === 'staff' ? '山田 太郎' : '所長'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <StatusBadge status={task.status} />
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button style={{ border: 'none', background: 'transparent', color: '#0f766e', cursor: 'pointer', fontWeight: '500' }}>詳細</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTasks.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                        該当するタスクはありません
                    </div>
                )}
            </div>

            <style>{`
        .btn-primary {
          background: #0f766e;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-primary:hover {
          background: #115e59;
        }
      `}</style>
        </div>
    );
}

function PriorityBadge({ level }) {
    const styles = {
        high: { bg: '#fee2e2', color: '#991b1b', label: '高' },
        medium: { bg: '#ffedd5', color: '#9a3412', label: '中' },
        low: { bg: '#f1f5f9', color: '#475569', label: '低' },
    };
    const style = styles[level] || styles.low;
    return (
        <span style={{ background: style.bg, color: style.color, padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '500' }}>
            {style.label}
        </span>
    );
}

function StatusBadge({ status }) {
    if (status === 'completed') {
        return <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> 完了</span>;
    }
    return <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> 未完了</span>;
}

function isOverdue(dateString) {
    const today = new Date().toISOString().split('T')[0];
    return dateString < today;
}
