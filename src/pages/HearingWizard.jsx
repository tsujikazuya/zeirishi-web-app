import React, { useState, useEffect } from 'react';
import { WizardLayout } from '../components/Hearing/WizardLayout';
import { Step1_BasicInfo } from '../components/Hearing/Steps/Step1_BasicInfo';
import { Step2_Family } from '../components/Hearing/Steps/Step2_Family';
import { Step3_Assets } from '../components/Hearing/Steps/Step3_Assets';
import { Step4_Wishes } from '../components/Hearing/Steps/Step4_Wishes';
import { useNavigate, useParams } from 'react-router-dom';

const HearingWizard = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();

    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [mode, setMode] = useState('PRO'); // 'PRO' or 'F2F'
    const [answers, setAnswers] = useState({});

    // Steps Configuration
    const steps = [
        { id: 1, title: '基本情報', component: Step1_BasicInfo },
        { id: 2, title: '家族構成', component: Step2_Family },
        { id: 3, title: '資産状況', component: Step3_Assets },
        { id: 4, title: '承継・想い', component: Step4_Wishes },
    ];

    const CurrentComponent = steps[currentStep - 1].component;

    // Handlers
    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(c => c + 1);
        } else {
            // Complete - Navigate to Summary
            navigate(`/clients/${clientId}/hearing/complete`, { state: { answers } });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(c => c - 1);
        }
    };

    const handleSave = () => {
        // Mock Save to LocalStorage
        localStorage.setItem(`hearing_draft_${clientId}`, JSON.stringify({ currentStep, answers }));
        alert('一時保存しました');
    };

    return (
        <WizardLayout
            title={`ヒアリング実施: ${steps[currentStep - 1].title}`}
            currentStep={currentStep}
            totalSteps={steps.length}
            mode={mode}
            onModeToggle={setMode}
            onNext={handleNext}
            onBack={handleBack}
            onSave={handleSave}
            onExit={() => navigate(`/clients/${clientId}`)}
        >
            <CurrentComponent mode={mode} answers={answers} setAnswers={setAnswers} />
        </WizardLayout>
    );
};

export default HearingWizard;
