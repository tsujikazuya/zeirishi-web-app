import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Filter, ArrowUpDown, AlertCircle, Calendar } from 'lucide-react';

export default function Clients() {
    const navigate = useNavigate();
    const { clients, thresholds } = useApp();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, business, age, asset, period
    const [sortKey, setSortKey] = useState('id'); // id, lastContact, asset

    // Filtering
    const filteredClients = clients.filter(client => {
        // Search
        const searchMatch =
            client.name.includes(searchTerm) ||
            client.person.includes(searchTerm);
        if (!searchMatch) return false;

        // Type Filter (Using simple property check for now, ideally reused logic from mockData or added as prop)
        if (filterType === 'all') return true;

        if (filterType === 'business' && client.note.includes('後継者')) return true;
        if (filterType === 'age' && client.age >= thresholds.ageHighRisk) return true;
        if (filterType === 'asset' && client.asset >= thresholds.assetHighRisk) return true;
        if (filterType === 'period' && client.lastContact >= thresholds.noContactPeriod) return true;

        return false;
    });

    // Sorting
    const sortedClients = [...filteredClients].sort((a, b) => {
        if (sortKey === 'lastContact') return b.lastContact - a.lastContact; // Descending (Longest period first)
        if (sortKey === 'asset') return b.asset - a.asset; // Descending
        return a.id - b.id;
    });

    const handleClientClick = (id) => {
        navigate(`/clients/${id}`);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>顧問先一覧</h2>
                <button className="btn-primary" onClick={() => alert('新規登録機能は未実装です')}>+ 新規登録</button>
            </div>

            {/* Controls */}
            <div className="controls-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="企業名・代表者名で検索..."
                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} color="#64748b" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="all">全てのリスク区分</option>
                        <option value="business">事業承継 (後継者)</option>
                        <option value="age">高齢リスク ({thresholds.ageHighRisk}歳以上)</option>
                        <option value="asset">高資産 ({thresholds.assetHighRisk}M以上)</option>
                        <option value="period">長期未接触 ({thresholds.noContactPeriod}ヶ月以上)</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowUpDown size={18} color="#64748b" />
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="id">ID順</option>
                        <option value="lastContact">未接触期間順</option>
                        <option value="asset">資産規模順</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="client-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sortedClients.map(client => (
                    <div
                        key={client.id}
                        onClick={() => handleClientClick(client.id)}
                        className="client-card"
                        style={{
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{client.name}</h3>
                                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{client.person} 様 ({client.age}歳)</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Badge label={`資産: ${client.asset}百万円`} color="#f1f5f9" textColor="#475569" />
                                <Badge label={`最終接触: ${client.lastContact}ヶ月前`} color={client.lastContact >= thresholds.noContactPeriod ? '#fee2e2' : '#f1f5f9'} textColor={client.lastContact >= thresholds.noContactPeriod ? '#991b1b' : '#475569'} />
                                <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span>担当: {client.assignee === 'staff' ? '田中' : '鈴木(所長)'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ArrowRightCircle />
                        </div>
                    </div>
                ))}

                {sortedClients.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        条件に一致する顧問先は見つかりませんでした
                    </div>
                )}
            </div>

            <style>{`
                .client-card:hover {
                    border-color: #0f766e;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .btn-primary {
                    background: #0f766e;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .btn-primary:hover {
                    background: #0d9488;
                }
            `}</style>
        </div>
    );
}

function Badge({ label, color, textColor }) {
    return (
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: color, color: textColor, fontWeight: '500' }}>
            {label}
        </span>
    );
}

function ArrowRightCircle() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 16 16 12 12 8"></polyline>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
    )
}
