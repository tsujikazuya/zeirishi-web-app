
export const mockClients = [
    {
        id: 1,
        name: '株式会社 佐藤製作所',
        person: '佐藤 健一',
        address: '東京都大田区蒲田5-13-1',
        phone: '03-1234-5678',
        email: 'sato@example.com',
        type: 'business',
        note: '後継者未定・自社株評価高',
        age: 65,
        asset: 200, // Million JPY
        lastContact: 3, // Months ago
        assignee: 'staff',
        status: 'active',
        family: ['妻 (60歳)', '長男 (35歳) - 家業に関心なし'],
        industry: '製造業'
    },
    {
        id: 2,
        name: '田中 茂 様',
        person: '田中 茂',
        address: '神奈川県横浜市西区みなとみらい2-2-1',
        phone: '045-987-6543',
        email: 'tanaka@example.com',
        type: 'age',
        note: 'ヒアリング未実施',
        age: 78,
        asset: 50,
        lastContact: 13,
        assignee: 'director',
        status: 'active',
        family: ['長男 (45歳)', '長女 (42歳)'],
        industry: '不動産オーナー'
    },
    {
        id: 3,
        name: '鈴木 財閥 様',
        person: '鈴木 一郎',
        address: '東京都港区六本木6-10-1',
        phone: '03-5555-4444',
        email: 'suzuki@example.com',
        type: 'asset',
        note: '納税資金不足懸念',
        age: 68,
        asset: 500,
        lastContact: 2,
        assignee: 'director',
        status: 'active',
        family: ['妻 (65歳)', '長男 (30歳)', '長女 (28歳)'],
        industry: '投資家'
    },
    {
        id: 4,
        name: '高橋 不動産 様',
        person: '高橋 次郎',
        address: '埼玉県さいたま市大宮区桜木町1-7-5',
        phone: '048-645-1234',
        email: 'takahashi@example.com',
        type: 'period',
        note: '前回面談から期間空き',
        age: 60,
        asset: 100,
        lastContact: 14,
        assignee: 'staff',
        status: 'warning',
        family: ['妻 (58歳)'],
        industry: '不動産業'
    },
    {
        id: 5,
        name: '伊藤 商事',
        person: '伊藤 三郎',
        address: '千葉県千葉市中央区富士見2-3-1',
        phone: '043-222-1111',
        email: 'ito@example.com',
        type: 'normal',
        note: '定期訪問予定',
        age: 55,
        asset: 30,
        lastContact: 1,
        assignee: 'staff',
        status: 'active',
        family: ['妻 (50歳)', '長男 (20歳)'],
        industry: '小売業'
    },
];

export const mockTasks = [
    { id: 101, title: '佐藤様 相続税試算', assignee: 'me', status: 'pending', priority: 'high', due: '2023-11-20' }, // Expired
    { id: 102, title: '田中様 アポ入れ', assignee: 'me', status: 'pending', priority: 'high', due: '2023-11-21' }, // Today/Expired
    { id: 103, title: '鈴木様 月次監査', assignee: 'director', status: 'completed', priority: 'medium', due: '2023-11-25' },
    { id: 104, title: '高橋様 資料作成', assignee: 'staff', status: 'in-progress', priority: 'medium', due: '2023-11-30' },
];

export const getKpiData = (role) => {
    return role === 'staff'
        ? { newClients: 2, proposalRate: '45%', revenue: '¥1,200,000' }
        : { newClients: 12, proposalRate: '68%', revenue: '¥8,400,000' };
};

export const calculateRisks = (clients, thresholds) => {
    return clients.map(client => {
        let riskType = null;
        let riskLabel = null;

        if (client.age >= thresholds.ageHighRisk) {
            riskType = 'age';
            riskLabel = '高齢';
        } else if (client.asset >= thresholds.assetHighRisk) {
            riskType = 'asset';
            riskLabel = '資産多';
        } else if (client.lastContact >= thresholds.noContactPeriod) {
            riskType = 'period';
            riskLabel = '放置';
        } else if (client.note.includes('後継者')) {
            riskType = 'business';
            riskLabel = '事業承継';
        }

        return { ...client, riskType, riskLabel };
    }).filter(client => client.riskType !== null);
};
