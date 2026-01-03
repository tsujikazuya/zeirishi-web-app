import React from 'react';
import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button'; // Assuming Button is available
import { Heart, UserCheck, TriangleAlert, MessageCircle } from 'lucide-react';
import clsx from 'clsx'; // Assuming clsx is installed and available

export const Step4_Wishes = ({ mode, answers, setAnswers }) => {
    const wishes = answers.wishes || {
        successor: '',
        concerns: [],
        notes: ''
    };

    const familyMembers = answers.family?.children || [];

    const handleSuccessor = (name) => {
        setAnswers(prev => ({ ...prev, wishes: { ...prev.wishes, successor: name } }));
    };

    const toggleConcern = (concern) => {
        const current = wishes.concerns;
        const next = current.includes(concern)
            ? current.filter(c => c !== concern)
            : [...current, concern];
        setAnswers(prev => ({ ...prev, wishes: { ...prev.wishes, concerns: next } }));
    };

    const handleNotes = (text) => {
        setAnswers(prev => ({ ...prev, wishes: { ...prev.wishes, notes: text } }));
    };

    if (mode === 'F2F') {
        const concernsList = [
            { id: 'TAX', label: '相続税の負担', icon: TriangleAlert },
            { id: 'DISPUTE', label: '遺産分割での揉め事', icon: UserCheck },
            { id: 'FREEZE', label: '認知症による資産凍結', icon: Heart },
        ];

        return (
            <div className="flex flex-col items-center gap-8 text-center max-w-4xl">
                <h2 className="text-3xl font-bold text-slate-800">
                    最後に、最も気になっている<br />ことは何ですか？
                </h2>

                <div className="flex gap-6 w-full justify-center flex-wrap">
                    {concernsList.map((item) => (
                        <div
                            key={item.id}
                            className={clsx(
                                "p-6 rounded-xl border-2 w-64 cursor-pointer transition-all flex flex-col items-center gap-4",
                                wishes.concerns.includes(item.id) ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
                            )}
                            onClick={() => toggleConcern(item.id)}
                        >
                            <div className={clsx(
                                "p-4 rounded-full",
                                wishes.concerns.includes(item.id) ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
                            )}>
                                <item.Icon size={48} />
                            </div>
                            <h3 className="text-xl font-bold">{item.label}</h3>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-2xl text-left bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-4">
                    <label className="text-lg font-bold mb-2 block flex items-center gap-2">
                        <MessageCircle />
                        その他のご要望・メモ
                    </label>
                    <textarea
                        className="w-full p-4 border rounded-lg text-lg bg-slate-50 min-h-[120px]"
                        placeholder="（例）長男に事業を継がせたいが、次男への配慮もしたい..."
                        value={wishes.notes}
                        onChange={(e) => handleNotes(e.target.value)}
                    />
                </div>
            </div>
        );
    }

    // PRO Mode
    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart size={20} />
                事業承継・相続への想い
            </h2>

            <Card className="mb-6 p-6">
                <div className="mb-8">
                    <label className="block font-bold text-slate-700 mb-2">後継者候補 (想定)</label>
                    <div className="flex gap-2 flex-wrap">
                        {familyMembers.map((child, idx) => (
                            <button
                                key={idx}
                                className={clsx(
                                    "px-4 py-2 rounded border",
                                    wishes.successor === child.name ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 hover:bg-slate-50"
                                )}
                                onClick={() => handleSuccessor(child.name)}
                            >
                                {child.name || `子${idx + 1}`}
                            </button>
                        ))}
                        <button
                            className={clsx(
                                "px-4 py-2 rounded border",
                                wishes.successor === 'OTHER' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 hover:bg-slate-50"
                            )}
                            onClick={() => handleSuccessor('OTHER')}
                        >
                            親族外・未定
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block font-bold text-slate-700 mb-2">懸念事項 (複数選択可)</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'TAX', label: '相続税負担の懸念' },
                            { id: 'DISPUTE', label: '遺産分割トラブルの懸念' },
                            { id: 'FREEZE', label: '認知症による資産凍結の懸念' },
                            { id: 'SUCCESSION', label: '後継者不足・事業承継の不安' },
                        ].map((concern) => (
                            <label key={concern.id} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-blue-600 rounded"
                                    checked={wishes.concerns.includes(concern.id)}
                                    onChange={() => toggleConcern(concern.id)}
                                />
                                <span className="font-bold text-slate-700">{concern.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-bold text-slate-700 mb-2">特記事項・フリーメモ</label>
                    <textarea
                        className="w-full p-3 border rounded text-sm min-h-[100px]"
                        placeholder="顧客の発言やニュアンスを記録"
                        value={wishes.notes}
                        onChange={(e) => handleNotes(e.target.value)}
                    />
                </div>
            </Card>
        </div>
    );
};
