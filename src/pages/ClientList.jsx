import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { Search, Filter, Plus, FileDown } from 'lucide-react';
import clsx from 'clsx';
import { clientService } from '../services/clientService';
import './ClientList.css';

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL'); // ALL, CORPORATE, INDIVIDUAL
    const [filterRisk, setFilterRisk] = useState('ALL'); // ALL, HIGH, MED, LOW

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await clientService.getClients();
                setClients(data || []);
            } catch (error) {
                console.error("Failed to fetch clients:", error);
                setClients([]);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch = client.name.includes(searchTerm) ||
                (client.representative && client.representative.includes(searchTerm));
            const matchesType = filterType === 'ALL' || client.type === filterType;
            const matchesRisk = filterRisk === 'ALL' || client.risk_level === filterRisk;

            return matchesSearch && matchesType && matchesRisk;
        });
    }, [clients, searchTerm, filterType, filterRisk]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="search-bar-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="顧問先検索 (社名、代表者名)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={FileDown}>CSV出力</Button>
                    <Button icon={Plus}>新規登録</Button>
                </div>
            </div>

            <Card>
                <div className="filter-bar">
                    <div className="flex gap-2">
                        <FilterButton active={filterType === 'ALL'} onClick={() => setFilterType('ALL')}>全て</FilterButton>
                        <FilterButton active={filterType === 'CORPORATE'} onClick={() => setFilterType('CORPORATE')}>法人</FilterButton>
                        <FilterButton active={filterType === 'INDIVIDUAL'} onClick={() => setFilterType('INDIVIDUAL')}>個人</FilterButton>
                    </div>
                    <div className="flex gap-2 items-center border-l pl-4 ml-2">
                        <span className="text-sm text-muted">リスク:</span>
                        <select
                            className="select-filter"
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                        >
                            <option value="ALL">全て</option>
                            <option value="HIGH">High</option>
                            <option value="MED">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>種別</th>
                                <th>顧客名 / 代表者</th>
                                <th>ステータス</th>
                                <th>概算資産</th>
                                <th>リスク判定</th>
                                <th>タグ</th>
                                <th>最終接触</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-muted">
                                        読み込み中...
                                    </td>
                                </tr>
                            ) : filteredClients.length > 0 ? (
                                filteredClients.map(client => (
                                    <tr key={client.id} className="cursor-pointer hover:bg-slate-50">
                                        <td>
                                            <Badge variant={client.type === 'CORPORATE' ? 'blue' : 'green'}>
                                                {client.type === 'CORPORATE' ? '法人' : '個人'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Link to={`/clients/${client.id}`} className="block w-full h-full text-main font-medium">
                                                {client.name}
                                                {client.representative && <span className="text-xs text-muted block">{client.representative}</span>}
                                            </Link>
                                        </td>
                                        <td>{client.status}</td>
                                        <td>¥{((client.assets_approx || 0) / 100000000).toFixed(1)}億</td>
                                        <td>
                                            <Badge variant={
                                                client.risk_level === 'HIGH' ? 'red' :
                                                    client.risk_level === 'MED' ? 'yellow' : 'green'
                                            }>
                                                {client.risk_level || 'LOW'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="flex gap-1 flex-wrap">
                                                {(client.tags || []).slice(0, 2).map(tag => (
                                                    <Badge key={tag} variant="gray" className="text-xs">{tag}</Badge>
                                                ))}
                                                {(client.tags || []).length > 2 && <span className="text-xs text-muted">+{client.tags.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="text-muted text-sm">{client.last_contact || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-muted">
                                        該当する顧問先は見つかりませんでした
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const FilterButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            active ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
        )}
    >
        {children}
    </button>
);

export default ClientList;
