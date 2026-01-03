/**
 * Logic to calculate risk levels based on Spec v2.0
 */

export const RISK_RULES = [
    {
        id: 'R_DISPUTE',
        label: '遺産分割リスク',
        severity: 'HIGH',
        message: '親族間不和の懸念あり。遺言必須。',
        check: (client, hearing) => {
            if (client.type !== 'INDIVIDUAL') return false;
            // Condition: Children > 1 AND has_conflict flag
            const children = client.family_structure?.children_count || 0;
            const conflict = hearing?.answers?.section_wishes?.has_conflict === true;
            return children > 1 && conflict;
        }
    },
    {
        id: 'R_FREEZE',
        label: '資産凍結リスク',
        severity: 'WARN', // Treated as MED/HIGH for display
        message: '認知症による資産凍結の対策が未実施です。',
        check: (client, hearing) => {
            if (client.type !== 'INDIVIDUAL') return false;
            // Condition: Age >= 75 AND no trust contract
            const isOld = (client.age || 0) >= 75;
            const noTrust = hearing?.answers?.section_assets?.trust_contract === false;
            return isOld && noTrust;
        }
    },
    {
        id: 'R_SUCCESSION',
        label: '事業承継リスク',
        severity: 'HIGH',
        message: '後継者未定・高齢リスク。事業承継計画が必要。',
        check: (client, hearing) => {
            // For Corporate, check Representative age via mix link? Or assume Client is the Owner for Hearing?
            // Simplification: Check if Client is Individual Owner linked to Corporate OR Corporate itself
            // Impl: If Corporate, we need Owner info. 
            // In this mock, let's assume we check the Owner (Individual) for succession risk relative to their business.

            if (client.type !== 'INDIVIDUAL') return false;
            // Assume if they have 'MANUFACTURING' etc tags or linked company.
            if (!client.mix_link_id && !client.tags.includes('オーナー')) return false;

            const isOld = (client.age || 0) >= 65;
            const noSuccessor = hearing?.answers?.section_wishes?.successor === null;

            return isOld && noSuccessor;
        }
    }
];

export const calculateClientRisks = (client, hearing) => {
    const risks = [];
    RISK_RULES.forEach(rule => {
        if (rule.check(client, hearing)) {
            risks.push({
                id: rule.id,
                label: rule.label,
                severity: rule.severity,
                message: rule.message
            });
        }
    });
    return risks;
};

export const getAggregatedRiskLevel = (risks) => {
    if (risks.some(r => r.severity === 'HIGH')) return 'HIGH';
    if (risks.some(r => r.severity === 'WARN')) return 'MED'; // WARN maps to MED usually
    return 'LOW';
};
