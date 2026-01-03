import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { CheckCircle, AlertTriangle, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { calculateClientRisks } from '../lib/riskLogic';

const HearingComplete = () => {
    const { clientId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [analyzing, setAnalyzing] = useState(true);
    const [risks, setRisks] = useState([]);

    // Get answers from navigation state or localStorage (fallback)
    const answers = location.state?.answers ||
        JSON.parse(localStorage.getItem(`hearing_draft_${clientId}`) || '{}').answers || {};

    useEffect(() => {
        // Simulate analysis delay
        const timer = setTimeout(() => {
            // Transform Hearing Answers to Client/Hearing structure expected by riskLogic
            const mockClient = {
                id: clientId,
                name: 'Mock Client (From Hearing)',
                type: 'INDIVIDUAL', // Required by riskLogic
                age: 80, // High age to trigger age-based risks if applicable
                family_structure: {
                    children_count: answers.family?.children?.length || 0,
                    has_spouse: answers.family?.hasSpouse
                },
                tags: [] // Required to prevent crash in R_SUCCESSION check
            };

            const mockHearing = {
                answers: {
                    section_assets: {
                        trust_contract: false // Default to false to test FREEZE risk
                    },
                    section_wishes: {
                        has_conflict: answers.wishes?.concerns?.includes('DISPUTE') || false,
                        successor: answers.wishes?.successor || null
                    }
                }
            };

            try {
                const detected = calculateClientRisks(mockClient, mockHearing);
                setRisks(detected);
            } catch (error) {
                console.error("Risk calculation failed:", error);
                setRisks([]); // Fallback to empty risks
            } finally {
                setAnalyzing(false);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [clientId, answers]);

    if (analyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <h2 className="text-xl font-bold text-slate-700">回答内容を分析中...</h2>
                <p className="text-slate-500">リスク判定と提案書の下書きを作成しています</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">ヒアリング完了</h1>
                    <p className="text-slate-600 mt-2">ご回答ありがとうございました。分析結果は以下の通りです。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Risk Analysis Result */}
                    <Card className="p-6 border-t-4 border-t-blue-600 relative overflow-hidden">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-blue-600" />
                            リスク検知レポート
                        </h2>

                        {risks.length === 0 ? (
                            <div className="p-4 bg-green-50 text-green-800 rounded">
                                特筆すべき重大なリスクは検知されませんでした。
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {risks.map((risk, idx) => (
                                    <div key={idx} className="bg-red-50 border border-red-100 p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-red-800 flex items-center gap-2">
                                                <AlertTriangle size={16} />
                                                {risk.label}
                                            </h3>
                                            <Badge variant="red">{risk.severity}</Badge>
                                        </div>
                                        <p className="text-sm text-red-700">{risk.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-bold text-sm text-slate-500 mb-2">推奨される対策</h4>
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                <li>推定相続人への意向確認</li>
                                <li>遺言書の作成検討</li>
                                <li>生前贈与シミュレーション</li>
                            </ul>
                        </div>
                    </Card>

                    {/* Next Actions */}
                    <div className="flex flex-col gap-4">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FileText className="text-slate-600" />
                                次のアクション
                            </h2>
                            <p className="text-slate-600 mb-6 text-sm">
                                検知されたリスクに基づき、以下のタスクが自動生成されました。
                            </p>

                            <div className="bg-slate-100 p-4 rounded-lg mb-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm">
                                        <input type="checkbox" checked readOnly className="text-blue-600 rounded" />
                                        <span>遺言書作成のご案内資料作成</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <input type="checkbox" checked readOnly className="text-blue-600 rounded" />
                                        <span>財産目録のドラフト作成</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm">
                                        <input type="checkbox" checked readOnly className="text-blue-600 rounded" />
                                        <span>次回面談日程の調整</span>
                                    </li>
                                </ul>
                            </div>

                            <Button className="w-full justify-center">
                                タスク一覧を確認する
                            </Button>
                        </Card>

                        <div className="flex gap-4">
                            <Button variant="secondary" className="flex-1 justify-center" onClick={() => navigate('/')}>
                                ダッシュボードへ
                            </Button>
                            <Button variant="outline" className="flex-1 justify-center" onClick={() => navigate(-1)}>
                                回答を修正する
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HearingComplete;
