import React from 'react';
import { Card } from '../../UI/Card';
import { Button } from '../../UI/Button';
import { Coins, Building, TrendingUp, HelpCircle } from 'lucide-react';

export const Step3_Assets = ({ mode, answers, setAnswers }) => {
    const assets = answers.assets || {
        real_estate: 0,
        cash: 0,
        securities: 0,
        other: 0,
        debt: 0
    };

    const updateAsset = (key, val) => {
        // Simple input handling, replace commas
        const num = parseInt(val.replace(/,/g, ''), 10) || 0;
        setAnswers(prev => ({
            ...prev,
            assets: { ...prev.assets, [key]: num }
        }));
    };

    const totalAssets = (assets.real_estate + assets.cash + assets.securities + assets.other);
    const netAssets = totalAssets - assets.debt;

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(num * 10000); // Input is usually in Man-en
    };

    if (mode === 'F2F') {
        return (
            <div className="flex flex-col items-center gap-8 text-center max-w-4xl">
                <h2 className="text-3xl font-bold text-slate-800">
                    大まかな資産状況を<br />教えていただけますか？
                </h2>

                <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                    <AssetCardF2F
                        icon={Building} color="blue" label="不動産（自宅等）"
                        value={assets.real_estate} onChange={(v) => updateAsset('real_estate', v)}
                    />
                    <AssetCardF2F
                        icon={Coins} color="yellow" label="現預金"
                        value={assets.cash} onChange={(v) => updateAsset('cash', v)}
                    />
                    <AssetCardF2F
                        icon={TrendingUp} color="green" label="有価証券"
                        value={assets.securities} onChange={(v) => updateAsset('securities', v)}
                    />
                    <AssetCardF2F
                        icon={HelpCircle} color="slate" label="その他資産"
                        value={assets.other} onChange={(v) => updateAsset('other', v)}
                    />
                </div>

                <div className="text-2xl font-bold text-slate-700 bg-slate-100 px-8 py-4 rounded-full">
                    概算合計: <span className="text-blue-600 text-3xl ml-2">{formatCurrency(totalAssets)}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coins size={20} />
                資産・負債の状況
            </h2>

            <Card className="mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <AssetInput
                        label="不動産評価額 (概算)"
                        subLabel="自宅、賃貸物件など"
                        value={assets.real_estate}
                        onChange={(v) => updateAsset('real_estate', v)}
                    />
                    <AssetInput
                        label="現預金"
                        subLabel="銀行預金、タンス預金など"
                        value={assets.cash}
                        onChange={(v) => updateAsset('cash', v)}
                    />
                    <AssetInput
                        label="有価証券"
                        subLabel="株式、投資信託、国債など"
                        value={assets.securities}
                        onChange={(v) => updateAsset('securities', v)}
                    />
                    <AssetInput
                        label="その他資産"
                        subLabel="生命保険返戻金、貴金属など"
                        value={assets.other}
                        onChange={(v) => updateAsset('other', v)}
                    />

                    <div className="col-span-2 border-t pt-4 mt-2">
                        <AssetInput
                            label="負債総額"
                            subLabel="借入金、未払金など (マイナス計算されます)"
                            value={assets.debt}
                            onChange={(v) => updateAsset('debt', v)}
                            isDebt
                        />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t flex justify-end items-end gap-4">
                    <div className="text-right">
                        <div className="text-sm text-slate-500">純資産総額 (概算)</div>
                        <div className="text-3xl font-bold text-slate-800">{formatCurrency(netAssets)}</div>
                    </div>
                </div>
            </Card>

            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
                <strong>Tips:</strong> 単位は「万円」です。詳細な評価額は後ほど精査可能です。
            </div>
        </div>
    );
};

const AssetInput = ({ label, subLabel, value, onChange, isDebt }) => (
    <div>
        <label className="block font-bold text-slate-700 mb-1">{label}</label>
        {subLabel && <p className="text-xs text-slate-400 mb-2">{subLabel}</p>}
        <div className="relative">
            <input
                type="number"
                className={`w-full p-3 pr-12 border rounded text-right font-mono text-lg ${isDebt ? 'text-red-600 bg-red-50 border-red-200' : ''}`}
                value={value === 0 ? '' : value}
                placeholder="0"
                onChange={(e) => onChange(e.target.value)}
            />
            <span className="absolute right-3 top-3 text-slate-400">万円</span>
        </div>
    </div>
);

const AssetCardF2F = ({ icon: Icon, color, label, value, onChange }) => (
    <div className={`bg-white p-6 rounded-xl border-2 border-slate-100 flex flex-col items-center gap-3 shadow-sm hover:border-${color}-200 transition-colors`}>
        <div className={`text-${color}-500 bg-${color}-50 p-3 rounded-full`}>
            <Icon size={32} />
        </div>
        <h4 className="font-bold text-slate-600">{label}</h4>
        <div className="flex items-center gap-2 w-full">
            <input
                type="number"
                className="w-full text-center text-xl font-bold border-b-2 border-slate-200 focus:border-primary outline-none py-1"
                value={value === 0 ? '' : value}
                placeholder="0"
                onChange={(e) => onChange(e.target.value)}
            />
            <span className="text-slate-400 font-bold whitespace-nowrap">万円</span>
        </div>
    </div>
);
