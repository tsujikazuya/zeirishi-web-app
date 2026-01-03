import React from 'react';
import { Card } from '../../UI/Card';
import { Badge } from '../../UI/Badge';
import { User, Building, MapPin, Phone } from 'lucide-react';

export const Step1_BasicInfo = ({ mode, answers, setAnswers, client }) => {
    // In a real app, 'client' would be passed down or fetched via context.
    // For mock, we'll assume it's injected or we display placeholders if missing.
    const mockClient = client || {
        name: '株式会社 田中製作所',
        type: 'CORPORATE',
        representative: '田中 太郎',
        address: '東京都大田区蒲田5-13-1',
        phone: '03-1234-5678',
        tags: ['製造業', '事業承継対策中']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers(prev => ({ ...prev, basic_info: { ...prev.basic_info, [name]: value } }));
    };

    if (mode === 'F2F') {
        return (
            <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
                <h2 className="text-3xl font-bold text-slate-800">
                    まずは、お客様の基本情報を<br />確認させてください。
                </h2>

                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 w-full">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                            {mockClient.type === 'CORPORATE' ? <Building size={48} /> : <User size={48} />}
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{mockClient.name}</h3>
                    <p className="text-xl text-slate-600 mb-6">代表者: {mockClient.representative} 様</p>

                    <div className="text-left bg-white p-6 rounded-lg border text-lg space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-1 text-slate-400" />
                            <span>{mockClient.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="text-slate-400" />
                            <span>{mockClient.phone}</span>
                        </div>
                    </div>
                </div>

                <p className="text-slate-500 text-lg">
                    ※ 内容に変更がある場合は、次の画面で修正できます。
                </p>
            </div>
        );
    }

    // PRO Mode
    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User size={20} />
                基本情報の確認・修正
            </h2>

            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">顧客名</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded bg-slate-50"
                            defaultValue={mockClient.name}
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">代表者名</label>
                        <input
                            type="text"
                            name="representative"
                            className="w-full p-2 border rounded"
                            defaultValue={mockClient.representative}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">電話番号</label>
                        <input
                            type="text"
                            name="phone"
                            className="w-full p-2 border rounded"
                            defaultValue={mockClient.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">住所</label>
                        <input
                            type="text"
                            name="address"
                            className="w-full p-2 border rounded"
                            defaultValue={mockClient.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">タグ</label>
                        <div className="flex gap-2 flex-wrap">
                            {mockClient.tags.map(tag => (
                                <Badge key={tag} variant="blue">{tag}</Badge>
                            ))}
                            <Badge variant="gray" className="cursor-pointer">+ 追加</Badge>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                <strong>Check:</strong> 法人の場合、代表者個人のヒアリングも同時に行うため、個人の家族構成情報を次のステップで確認します。
            </div>
        </div>
    );
};
