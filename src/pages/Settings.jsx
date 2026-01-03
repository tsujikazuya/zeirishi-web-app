import React from 'react';
import { useApp } from '../context/AppContext';
import { Save, RefreshCw } from 'lucide-react';

export default function Settings() {
    const { thresholds, updateThreshold, dashboardConfig, toggleDashboardItem, userRole, setUserRole } = useApp();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>設定</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>リスク判定基準 (動的閾値)</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    ダッシュボードの「リスク案件」抽出条件を変更します。変更は即座に反映されます。
                </p>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            高齢リスク年齢 (歳以上)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="number"
                                value={thresholds.ageHighRisk}
                                onChange={(e) => updateThreshold('ageHighRisk', e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100px' }}
                            />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>現在は {thresholds.ageHighRisk}歳以上 をアラート対象としています</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            高額資産リスク (百万円以上)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="number"
                                value={thresholds.assetHighRisk}
                                onChange={(e) => updateThreshold('assetHighRisk', e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100px' }}
                            />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>現在は {thresholds.assetHighRisk}百万円以上 を対象としています</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            放置期間アラート (ヶ月以上)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="number"
                                value={thresholds.noContactPeriod}
                                onChange={(e) => updateThreshold('noContactPeriod', e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100px' }}
                            />
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>未接触期間が {thresholds.noContactPeriod}ヶ月 を超えると警告します</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>ダッシュボード表示設定</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    ダッシュボードに表示するウィジェットを選択してください。
                </p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={dashboardConfig.showFunnel}
                            onChange={() => toggleDashboardItem('showFunnel')}
                        />
                        <span>ファネル分析 (プロセス状況)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={dashboardConfig.showRiskList}
                            onChange={() => toggleDashboardItem('showRiskList')}
                        />
                        <span>リスク・チャンス案件リスト</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={dashboardConfig.showStaffProgress}
                            onChange={() => toggleDashboardItem('showStaffProgress')}
                        />
                        <span>担当者別 進捗状況</span>
                    </label>
                </div>
            </div>

            <div className="card">
                <h3>【デバッグ用】ユーザーロール切替</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        onClick={() => setUserRole('director')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            border: '1px solid #0f766e',
                            background: userRole === 'director' ? '#0f766e' : 'white',
                            color: userRole === 'director' ? 'white' : '#0f766e',
                            cursor: 'pointer'
                        }}
                    >
                        所長・マネージャー (全件表示)
                    </button>
                    <button
                        onClick={() => setUserRole('staff')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            border: '1px solid #0f766e',
                            background: userRole === 'staff' ? '#0f766e' : 'white',
                            color: userRole === 'staff' ? 'white' : '#0f766e',
                            cursor: 'pointer'
                        }}
                    >
                        担当者 (自分の担当のみ)
                    </button>
                </div>
            </div>
        </div>
    );
}
