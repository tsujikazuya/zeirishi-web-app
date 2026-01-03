import React from 'react';
import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { Plus, Trash2, Users } from 'lucide-react';

export const Step2_Family = ({ mode, answers, setAnswers }) => {
    // Initial state setup if empty
    const family = answers.family || {
        hasSpouse: true,
        children: []
    };

    const updateFamily = (key, value) => {
        const newFamily = { ...family, [key]: value };
        setAnswers(prev => ({ ...prev, family: newFamily }));
    };

    const addChild = () => {
        const newChildren = [...family.children, { name: '', relation: 'CHILD' }];
        updateFamily('children', newChildren);
    };

    const removeChild = (index) => {
        const newChildren = family.children.filter((_, i) => i !== index);
        updateFamily('children', newChildren);
    };

    const updateChild = (index, field, value) => {
        const newChildren = [...family.children];
        newChildren[index][field] = value;
        updateFamily('children', newChildren);
    };

    if (mode === 'F2F') {
        return (
            <div className="flex flex-col items-center gap-8 text-center max-w-4xl">
                <h2 className="text-3xl font-bold text-slate-800">
                    ご家族構成について<br />教えてください。
                </h2>
                <div className="flex gap-8 justify-center w-full">
                    {/* Spouse Selection */}
                    <div className={`p-8 rounded-xl border-2 cursor-pointer transition-all w-64 ${family.hasSpouse ? 'border-primary bg-blue-50' : 'border-slate-200'}`}
                        onClick={() => updateFamily('hasSpouse', !family.hasSpouse)}>
                        <div className="mb-4">
                            <Users size={64} className={family.hasSpouse ? 'text-primary' : 'text-slate-300'} />
                        </div>
                        <h3 className="text-xl font-bold">配偶者</h3>
                        <p className="text-slate-500">{family.hasSpouse ? 'あり' : 'なし'}</p>
                    </div>

                    {/* Children Count */}
                    <div className="p-8 rounded-xl border-2 border-slate-200 bg-white w-64">
                        <div className="mb-4 text-green-500">
                            <Users size={64} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">お子様</h3>
                        <div className="flex items-center justify-center gap-4">
                            <Button size="sm" onClick={() => {
                                if (family.children.length > 0) removeChild(family.children.length - 1);
                            }}>-</Button>
                            <span className="text-2xl font-bold">{family.children.length}人</span>
                            <Button size="sm" onClick={addChild}>+</Button>
                        </div>
                    </div>
                </div>
                <p className="text-slate-500 text-lg bg-yellow-50 p-4 rounded-lg">
                    ※ 遺産分割のリスク診断に使用します。<br />
                    詳細な情報は後ほど「家系図」画面でも編集可能です。
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users size={20} />
                家族構成の登録
            </h2>

            <Card className="mb-6 p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <label className="font-bold w-32">配偶者の有無</label>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded border ${family.hasSpouse ? 'bg-blue-600 text-white' : 'bg-white'}`}
                            onClick={() => updateFamily('hasSpouse', true)}
                        >
                            配偶者あり
                        </button>
                        <button
                            className={`px-4 py-2 rounded border ${!family.hasSpouse ? 'bg-slate-600 text-white' : 'bg-white'}`}
                            onClick={() => updateFamily('hasSpouse', false)}
                        >
                            配偶者なし
                        </button>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="font-bold">お子様・推定相続人</label>
                        <Button size="sm" icon={Plus} onClick={addChild}>追加</Button>
                    </div>

                    <div className="space-y-3">
                        {family.children.length === 0 && <div className="text-center py-4 text-slate-400 bg-slate-50 rounded">お子様は登録されていません</div>}

                        {family.children.map((child, idx) => (
                            <div key={idx} className="flex gap-2 items-center p-2 bg-slate-50 rounded border">
                                <span className="text-slate-400 font-mono w-6">#{idx + 1}</span>
                                <input
                                    placeholder="氏名 (任意)"
                                    className="p-2 border rounded flex-1"
                                    value={child.name}
                                    onChange={(e) => updateChild(idx, 'name', e.target.value)}
                                />
                                <div className="bg-white border px-3 py-2 rounded text-sm text-slate-600">子</div>
                                <Button variant="ghost" size="sm" icon={Trash2} onClick={() => removeChild(idx)} className="text-red-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                <strong>Tips:</strong> お子様が2名以上いる場合、「遺産分割リスク」の判定対象となります。
            </div>
        </div>
    );
};
