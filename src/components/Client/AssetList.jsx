import React from 'react';
import { Card } from '../UI/Card';

const mockAssets = [
    { id: 1, category: '不動産', name: '自宅土地・建物', value: 80000000, holder: '本人' },
    { id: 2, category: '現預金', name: '三菱UFJ銀行 普通', value: 35000000, holder: '本人' },
    { id: 3, category: '有価証券', name: '野村證券 口座', value: 120000000, holder: '本人' },
    { id: 4, category: '自社株', name: '株式会社田中製作所', value: 300000000, holder: '本人' },
];

export const AssetList = ({ client }) => {
    // In a real app, fetch assets by client.id
    const assets = mockAssets;
    const total = assets.reduce((sum, a) => sum + a.value, 0);

    return (
        <Card>
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <span className="font-medium">資産合計 (概算)</span>
                <span className="text-xl font-bold">¥{(total).toLocaleString()}</span>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="p-3">区分</th>
                        <th className="p-3">資産名称</th>
                        <th className="p-3">名義人</th>
                        <th className="p-3 text-right">評価額</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map(asset => (
                        <tr key={asset.id} className="border-b">
                            <td className="p-3">{asset.category}</td>
                            <td className="p-3 font-medium">{asset.name}</td>
                            <td className="p-3">{asset.holder}</td>
                            <td className="p-3 text-right font-mono">¥{asset.value.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};
