import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { ArrowLeft, User, Building, AlertTriangle, Network, Coins, CheckSquare, FileText } from 'lucide-react';
import { AssetList } from '../components/Client/AssetList';
import { FamilyTree } from '../components/Client/FamilyTree';
import clsx from 'clsx';
import './ClientDetail.css';

const ClientDetail = () => {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [mixClient, setMixClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const clientData = await clientService.getClientById(id);
                setClient(clientData);

                if (clientData?.mix_link_id) {
                    const mixData = await clientService.getClientById(clientData.mix_link_id);
                    setMixClient(mixData);
                }
            } catch (error) {
                console.error("Failed to fetch client details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClientData();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!client) return <div className="p-8 text-center">Client not found</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link to="/clients" className="text-muted hover:text-main">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant={client.type === 'CORPORATE' ? 'blue' : 'green'}>
                            {client.type === 'CORPORATE' ? '法人' : '個人'}
                        </Badge>
                        <h1 className="text-xl">{client.name}</h1>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="secondary" icon={FileText}>レポート出力</Button>
                    <Button>編集</Button>
                </div>
            </div>

            {/* Mix Link Banner */}
            {mixClient && (
                <div className="mix-banner">
                    <span className="text-sm text-muted">関連:</span>
                    <Link to={`/clients/${mixClient.id}`} className="mix-link">
                        {mixClient.type === 'CORPORATE' ? <Building size={16} /> : <User size={16} />}
                        {mixClient.name}
                    </Link>
                </div>
            )}

            <div className="tabs-header">
                <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={User}>基本情報</TabButton>
                <TabButton active={activeTab === 'family'} onClick={() => setActiveTab('family')} icon={Network}>家系図</TabButton>
                <TabButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} icon={Coins}>資産明細</TabButton>
                <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={CheckSquare}>タスク履歴</TabButton>
            </div>

            <div className="tab-content">
                {activeTab === 'summary' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <Card title="基本情報">
                            <dl className="detail-list">
                                <dt>ID</dt><dd>{client.id}</dd>
                                <dt>ステータス</dt><dd><Badge variant="gray">{client.status}</Badge></dd>
                                <dt>タグ</dt>
                                <dd className="flex gap-1 flex-wrap">
                                    {client.tags.map(tag => <Badge key={tag} variant="gray">{tag}</Badge>)}
                                </dd>
                                <dt>最終接触</dt><dd>{client.last_contact}</dd>
                                {client.type === 'CORPORATE' && (
                                    <>
                                        <dt>代表者</dt><dd>{client.representative}</dd>
                                    </>
                                )}
                                {client.type === 'INDIVIDUAL' && (
                                    <>
                                        <dt>年齢</dt><dd>{client.age}歳</dd>
                                    </>
                                )}
                            </dl>
                        </Card>
                        <Card title="リスク判定結果">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`risk-badge risk-${client.risk_level.toLowerCase()}`}>
                                    {client.risk_level}
                                </div>
                                <div className="text-sm text-muted">
                                    最終判定日: 2026-01-01
                                </div>
                            </div>
                            {client.risk_level === 'HIGH' && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-md text-sm text-red-800 flex gap-2 items-center">
                                    <AlertTriangle size={18} />
                                    <span>遺産分割争族リスクが検知されています</span>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'family' && <FamilyTree client={client} />}
                {activeTab === 'assets' && <AssetList client={client} />}
                {activeTab === 'tasks' && <div className="p-4 text-center text-muted">タスク履歴コンポーネント (Coming Soon)</div>}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, children }) => (
    <button
        className={clsx('tab-btn', active && 'active')}
        onClick={onClick}
    >
        <Icon size={18} />
        {children}
    </button>
);

export default ClientDetail;
