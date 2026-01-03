import React from 'react';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RiskWidget = ({ clients, hearingResults, riskCalculator }) => {
    const navigate = useNavigate();

    // Calculate risks for all clients
    const riskyClients = clients.map(client => {
        const hearing = hearingResults.find(h => h.client_id === client.id);
        const risks = riskCalculator(client, hearing);
        return { ...client, detected_risks: risks };
    }).filter(c => c.detected_risks.length > 0)
        .sort((a, b) => b.detected_risks.length - a.detected_risks.length); // Sort by risk count

    return (
        <Card title="⚠️ リスク検知アラート" className="h-full">
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {riskyClients.length === 0 ? (
                    <div className="text-center py-8 text-muted">検出されたリスクはありません</div>
                ) : (
                    riskyClients.map(client => (
                        <div
                            key={client.id}
                            className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer group transition-all"
                            onClick={() => navigate(`/clients/${client.id}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-slate-800">{client.name}</span>
                                <ChevronRight size={16} className="text-slate-400 group-hover:text-primary" />
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {client.detected_risks.map(risk => (
                                    <div key={risk.id} className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${risk.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        <AlertTriangle size={12} />
                                        {risk.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {riskyClients.length > 0 && (
                <div className="pt-3 mt-2 border-t text-center">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>全件確認</Button>
                </div>
            )}
        </Card>
    );
};
