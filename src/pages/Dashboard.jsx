import React, { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { mockDashboardStats, mockTasks, mockHearingResults } from '../lib/mockData';
import { clientService } from '../services/clientService';
import { calculateClientRisks } from '../lib/riskLogic';
import { RiskWidget } from '../components/Dashboard/RiskWidget';
import { TaskWidget } from '../components/Dashboard/TaskWidget';
import { Users, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <Card className="p-4" style={{ borderLeft: `4px solid var(--color-${color})` }}>
        <div className="flex justify-between items-start mb-2">
            <div className="text-muted text-sm font-medium">{title}</div>
            <div className={`p-2 rounded-full bg-${color}-50 text-${color}-600`}>
                <Icon size={20} color={`var(--color-${color === 'warning' ? 'warning' : 'primary'})`} />
            </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {trend && <div className="text-xs text-success flex items-center gap-1"><TrendingUp size={12} /> {trend}</div>}
    </Card>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('ALL');
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const data = await clientService.getClients();
            setClients(data);
        };
        fetchClients();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Role Filter Toggle (Simulation) */}
            <div className="flex justify-end">
                <div className="bg-white border rounded-md p-1 flex text-sm">
                    <button
                        className={`px-3 py-1 rounded ${viewMode === 'ALL' ? 'bg-slate-100 font-bold' : ''}`}
                        onClick={() => setViewMode('ALL')}
                    >
                        事務所全体
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${viewMode === 'MY' ? 'bg-slate-100 font-bold' : ''}`}
                        onClick={() => setViewMode('MY')}
                    >
                        自分担当のみ
                    </button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <StatCard
                    title="顧問先総数"
                    value={mockDashboardStats.total_clients}
                    icon={Users}
                    trend="+4件 (先月比)"
                />
                <StatCard
                    title="ヒアリング完了率"
                    value={`${mockDashboardStats.hearing_completion_rate}%`}
                    icon={CheckCircle}
                    color="success"
                />
                <StatCard
                    title="提案中案件"
                    value={mockDashboardStats.active_proposals}
                    icon={Briefcase}
                    color="warning"
                />
                <StatCard
                    title="受任見込額"
                    value={`¥${(mockDashboardStats.expected_revenue / 10000).toLocaleString()}万`}
                    icon={TrendingUp}
                    color="accent"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {/* Risk Alerts */}
                <div className="lg:col-span-2 col-span-2">
                    <RiskWidget
                        clients={clients}
                        hearingResults={mockHearingResults}
                        riskCalculator={calculateClientRisks}
                    />
                </div>

                {/* My Tasks */}
                <div className="col-span-1">
                    <TaskWidget tasks={mockTasks} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
