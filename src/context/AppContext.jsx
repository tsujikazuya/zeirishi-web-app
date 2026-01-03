import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    // 1. Dynamic Thresholds (動的閾値)
    const [thresholds, setThresholds] = useState({
        ageHighRisk: 70,       // 高齢リスク年齢
        assetHighRisk: 300,    // 高額資産リスク (単位: 百万円)
        noContactPeriod: 12,   // 放置期間 (単位: ヶ月)
    });

    // 2. Dashboard Customization (表示項目)
    const [dashboardConfig, setDashboardConfig] = useState({
        showKpiIds: ['newClients', 'proposalRate', 'revenue'],
        showFunnel: true,
        showRiskList: true,
        showTasks: true,
        showStaffProgress: true,
    });

    // 3. User Role (擬似的なロール切り替え)
    const [userRole, setUserRole] = useState('director'); // director | staff

    // 4. Data Management (Mock)
    const [clients, setClients] = useState(mockClients);
    const [tasks, setTasks] = useState(mockTasks);

    // Derived Data
    const riskItems = useMemo(() => calculateRisks(clients, thresholds), [clients, thresholds]);
    const kpiData = useMemo(() => getKpiData(userRole), [userRole]);

    const updateThreshold = (key, value) => {
        setThresholds(prev => ({ ...prev, [key]: Number(value) }));
    };

    const toggleDashboardItem = (key) => {
        setDashboardConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AppContext.Provider value={{
            thresholds,
            updateThreshold,
            dashboardConfig,
            toggleDashboardItem,
            userRole,
            setUserRole,
            clients,
            setClients,
            tasks,
            setTasks,
            riskItems,
            kpiData
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
