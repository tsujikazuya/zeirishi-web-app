export const mockClients = [
    {
        id: 'c1',
        type: 'CORPORATE',
        name: '株式会社 田中製作所',
        representative: '田中 太郎',
        status: 'ACTIVE',
        tags: ['製造業', '事業承継対策中'],
        assets_approx: 500000000,
        risk_level: 'HIGH', // Derived
        last_contact: '2025-12-01',
        mix_link_id: 'i1',
        industry: 'MANUFACTURING',
        closing_month: 3
    },
    {
        id: 'c2',
        type: 'CORPORATE',
        name: '鈴木医療法人',
        representative: '鈴木 一郎',
        status: 'ACTIVE',
        tags: ['医療法人', '出資持分なし'],
        assets_approx: 1200000000,
        risk_level: 'LOW',
        last_contact: '2026-01-02',
        mix_link_id: 'i2',
        industry: 'MEDICAL',
        closing_month: 9
    },
    {
        id: 'i1',
        type: 'INDIVIDUAL',
        name: '田中 太郎',
        age: 68,
        status: 'ACTIVE',
        tags: ['地主', '特定口座'],
        assets_approx: 300000000,
        risk_level: 'HIGH',
        last_contact: '2025-12-01',
        mix_link_id: 'c1',
        family_structure: {
            spouse: true,
            children_count: 3
        }
    },
    {
        id: 'i2',
        type: 'INDIVIDUAL',
        name: '鈴木 一郎',
        age: 55,
        status: 'ACTIVE',
        tags: ['医師', '投資家'],
        assets_approx: 800000000,
        risk_level: 'MED',
        last_contact: '2026-01-02',
        mix_link_id: 'c2',
        family_structure: {
            spouse: true,
            children_count: 2
        }
    },
    {
        id: 'i3',
        type: 'INDIVIDUAL',
        name: '佐藤 花子',
        age: 82,
        status: 'PROSPECT',
        tags: ['未亡人', '認知症懸念'],
        assets_approx: 150000000,
        risk_level: 'HIGH',
        last_contact: '2025-11-15',
        mix_link_id: null,
        family_structure: {
            spouse: false,
            children_count: 0
        }
    }
];

// Helper to get latest hearing result
export const mockHearingResults = [
    {
        client_id: 'i1',
        completed_at: '2025-12-01',
        answers: {
            section_wishes: {
                has_conflict: true, // R_DISPUTE Risk
                successor: null     // R_SUCCESSION Risk
            },
            section_assets: {
                trust_contract: false // R_FREEZE Risk
            }
        },
        flags: {
            unknown_items: 2
        }
    },
    {
        client_id: 'i3',
        completed_at: '2025-11-15',
        answers: {
            section_wishes: { has_conflict: false },
            section_assets: { trust_contract: false }
        },
        flags: { unknown_items: 0 }
    }
];

export const mockTasks = [
    {
        id: 't1',
        title: '田中製作所 株価算定',
        client_name: '株式会社 田中製作所',
        due_date: '2026-01-10',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assignee_id: 'u1',
        assignee_name: '自分'
    },
    {
        id: 't2',
        title: '佐藤花子様 面談予約',
        client_name: '佐藤 花子',
        due_date: '2026-01-05',
        priority: 'MED',
        status: 'TODO',
        assignee_id: 'u2',
        assignee_name: 'アシスタント'
    },
    {
        id: 't3',
        title: '鈴木医療法人 決算事前検討',
        client_name: '鈴木医療法人',
        due_date: '2026-01-20',
        priority: 'LOW',
        status: 'TODO',
        assignee_id: 'u1',
        assignee_name: '自分'
    }
];

export const mockDashboardStats = {
    total_clients: 312,
    hearing_completion_rate: 68,
    active_proposals: 15,
    expected_revenue: 12500000,
    risk_distribution: {
        high: 45,
        med: 120,
        low: 147
    }
};
