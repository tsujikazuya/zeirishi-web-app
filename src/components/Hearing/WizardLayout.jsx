import React from 'react';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';
import { ArrowLeft, ArrowRight, Save, Layout, Monitor } from 'lucide-react';
import clsx from 'clsx';
import './WizardLayout.css';

export const WizardLayout = ({
    title,
    currentStep,
    totalSteps,
    mode,
    onModeToggle,
    onNext,
    onBack,
    onSave,
    canNext = true,
    children
}) => {
    const progress = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className={clsx("wizard-container", mode === 'F2F' ? 'mode-f2f' : 'mode-pro')}>
            {/* Header */}
            <header className="wizard-header">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => window.history.back()}>中断</Button>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                        <span className="text-xs text-slate-500">Step {currentStep} / {totalSteps}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 rounded p-1">
                        <button
                            className={clsx('mode-toggle-btn', mode === 'PRO' && 'active')}
                            onClick={() => onModeToggle('PRO')}
                        >
                            <Layout size={14} /> プロ入力
                        </button>
                        <button
                            className={clsx('mode-toggle-btn', mode === 'F2F' && 'active')}
                            onClick={() => onModeToggle('F2F')}
                        >
                            <Monitor size={14} /> 対面提示
                        </button>
                    </div>
                    <Button variant="secondary" icon={Save} onClick={onSave} size="sm">一時保存</Button>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Content Area */}
            <main className="wizard-content">
                <div className="wizard-paper">
                    {children}
                </div>
            </main>

            {/* Footer / Navigation */}
            <footer className="wizard-footer">
                <Button variant="ghost" onClick={onBack} disabled={currentStep === 1}>
                    前へ
                </Button>

                <Button
                    variant="primary"
                    onClick={onNext}
                    disabled={!canNext}
                    icon={ArrowRight}
                    iconPosition="right"
                >
                    次へ進む
                </Button>
            </footer>
        </div>
    );
};
