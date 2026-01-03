import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, PieChart, TrendingUp, Users, FileText, Download } from 'lucide-react';

export default function Reports() {
    const { kpiData, userRole, dashboardConfig } = useApp();
    const [activeTab, setActiveTab] = useState('summary');

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>レポート・分析</h2>
                <button className="btn-outline" onClick={() => alert('PDFダウンロード機能は未実装です')}>
                    <Download size={16} style={{ marginRight: '0.5rem' }} /> PDF出力
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <TabButton label="サマリー" icon={<TrendingUp size={16} />} active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
                <TabButton label="提案進捗" icon={<FileText size={16} />} active={activeTab === 'proposal'} onClick={() => setActiveTab('proposal')} />
                <TabButton label="担当者実績" icon={<Users size={16} />} active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} />
            </div>

            {/* Content */}
            <div className="report-content">
                {activeTab === 'summary' && <SummaryTab kpiData={kpiData} userRole={userRole} />}
                {activeTab === 'proposal' && <ProposalTab />}
                {activeTab === 'staff' && <StaffTab />}
            </div>

            <style>{`
                .btn-outline {
                    display: flex;
                    alignItems: center;
                    padding: 0.5rem 1rem;
                    border: 1px solid #cbd5e1;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    color: #475569;
                }
                .btn-outline:hover {
                    background: #f8fafc;
                }
            `}</style>
        </div>
    );
}

function TabButton({ label, icon, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: active ? '2px solid #0f766e' : '2px solid transparent',
                color: active ? '#0f766e' : '#64748b',
                fontWeight: active ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >
            {icon} {label}
        </button>
    );
}

function SummaryTab({ kpiData, userRole }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <KpiCard title="月間新規案件" value={`${kpiData.newClients}件`} diff="+2" color="#0ea5e9" />
            <KpiCard title="提案完了率" value={kpiData.proposalRate} diff="+5%" color="#8b5cf6" />
            <KpiCard title="成約見込額" value={kpiData.revenue} diff="達成率92%" color="#0f766e" />

            <div className="card" style={{ gridColumn: '1 / -1', padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginTop: 0 }}>月次推移</h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '2rem' }}>
                    {/* Mock Bar Chart */}
                    {[40, 65, 50, 80, 70, 92].map((h, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '40px', height: `${h}%`, background: '#cbd5e1', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                {i === 5 && <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', color: '#0f766e' }}>Current</div>}
                                {i === 5 && <div style={{ width: '100%', height: '100%', background: '#0f766e', borderRadius: '4px 4px 0 0' }}></div>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{i + 6}月</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProposalTab() {
    return (
        <div className="card" style={{ padding: '2rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0 }}>提案フェーズ分析</h3>
            <p>各フェーズにおける滞留日数を分析します。(Mock)</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'conic-gradient(#0ea5e9 0% 30%, #f1f5f9 30% 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>30%</div>
                        <div style={{ fontSize: '0.75rem' }}>ヒアリング完了</div>
                    </div>
                </div>
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'conic-gradient(#e11d48 0% 10%, #f1f5f9 10% 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>10%</div>
                        <div style={{ fontSize: '0.75rem' }}>提案中</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StaffTab() {
    return (
        <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0 }}>担当者別パフォーマンス</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem' }}>担当者</th>
                        <th style={{ padding: '0.75rem' }}>担当顧客数</th>
                        <th style={{ padding: '0.75rem' }}>提案実施数</th>
                        <th style={{ padding: '0.75rem' }}>成約数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem' }}>鈴木 花子</td>
                        <td style={{ padding: '0.75rem' }}>45</td>
                        <td style={{ padding: '0.75rem' }}>12</td>
                        <td style={{ padding: '0.75rem' }}>8</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem' }}>山田 太郎</td>
                        <td style={{ padding: '0.75rem' }}>38</td>
                        <td style={{ padding: '0.75rem' }}>8</td>
                        <td style={{ padding: '0.75rem' }}>5</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function KpiCard({ title, value, diff, color }) {
    return (
        <div className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', borderLeft: `4px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{title}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{diff}</div>
        </div>
    );
}
