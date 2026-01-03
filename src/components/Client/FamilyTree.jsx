import React from 'react';
import { Card } from '../UI/Card';

export const FamilyTree = ({ client }) => {
    return (
        <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-slate-50 border-dashed">
            <div className="text-center">
                <div className="mb-4 text-6xl">👨‍👩‍👧‍👦</div>
                <h3 className="text-lg font-medium text-slate-700">家系図ビジュアライザー</h3>
                <p className="text-slate-500 mb-4">
                    ここにインタラクティブな家系図が表示されます。<br />
                    ドラッグ＆ドロップで関係性を編集可能です。
                </p>
                <div className="p-4 bg-white rounded shadow-sm inline-block">
                    <strong>{client.name}</strong> (本人)
                </div>
            </div>
        </Card>
    );
};
