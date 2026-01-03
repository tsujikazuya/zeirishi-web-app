/**
 * Logic to auto-generate tasks based on triggers
 */

import { v4 as uuidv4 } from 'uuid'; // Simulation

export const TASK_TEMPLATES = {
    'R_DISPUTE': {
        title: '[提案] 遺産分割対策プランの作成',
        days_due: 14,
        priority: 'HIGH'
    },
    'R_FREEZE': {
        title: '[確認] 家族信託のご案内準備',
        days_due: 30,
        priority: 'MED'
    },
    'UNKNOWN_ITEMS': {
        title: '[確認] ヒアリング不明事項の追跡',
        days_due: 7,
        priority: 'HIGH'
    }
};

export const generateTasksFromRisks = (client, risks) => {
    const newTasks = [];
    const today = new Date();

    risks.forEach(risk => {
        const template = TASK_TEMPLATES[risk.id];
        if (template) {
            const dueDate = new Date(today);
            dueDate.setDate(today.getDate() + template.days_due);

            newTasks.push({
                id: `auto_${Date.now()}_${risk.id}`,
                title: template.title,
                client_name: client.name,
                client_id: client.id,
                due_date: dueDate.toISOString().split('T')[0],
                priority: template.priority,
                status: 'TODO',
                assignee_id: 'u1', // Default to current user for MVP
                assignee_name: '自分',
                auto_generated: true,
                trigger: risk.id
            });
        }
    });

    return newTasks;
};

export const generateFollowUpTasks = (client, hearing) => {
    // Check for unknown items
    if (hearing?.flags?.unknown_items > 0) {
        const template = TASK_TEMPLATES['UNKNOWN_ITEMS'];
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + template.days_due);

        return [{
            id: `auto_${Date.now()}_unknown`,
            title: template.title,
            client_name: client.name,
            client_id: client.id,
            due_date: dueDate.toISOString().split('T')[0],
            priority: template.priority,
            status: 'TODO',
            assignee_id: 'u1',
            assignee_name: '自分',
            auto_generated: true,
            trigger: 'UNKNOWN_ITEMS'
        }];
    }
    return [];
};
