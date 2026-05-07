import React, { useState } from "react";
import { View, DeviceEventEmitter } from "react-native";
import { WalletMain } from "@/components/wallet/WalletMain";
import { AddMoney } from "@/components/wallet/AddMoney";
import { AddMethod } from "@/components/wallet/AddMethod";
import { SuccessModal } from "@/components/wallet/SuccessModal";
import tw from 'twrnc';

export default function WalletScreen() {
    const [viewStep, setViewStep] = useState<'main' | 'add_money' | 'add_method'>('main');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('1');
    const [amount, setAmount] = useState('');

    const toggleSidebar = (open: boolean) => {
        DeviceEventEmitter.emit('toggleSidebar', open);
    };

    const handleBack = () => {
        if (viewStep === 'add_money') setViewStep('main');
        else if (viewStep === 'add_method') setViewStep('add_money');
    };

    const handleConfirm = () => {
        setModalVisible(true);
    };

    const handleBackHome = () => {
        setModalVisible(false);
        setViewStep('main');
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            {viewStep === 'main' && (
                <WalletMain 
                    onAddMoney={() => setViewStep('add_money')}
                    onToggleSidebar={toggleSidebar}
                />
            )}

            {viewStep === 'add_money' && (
                <AddMoney 
                    amount={amount}
                    setAmount={setAmount}
                    selectedPayment={selectedPayment}
                    setSelectedPayment={setSelectedPayment}
                    onAddMethod={() => setViewStep('add_method')}
                    onBack={handleBack}
                    onConfirm={handleConfirm}
                />
            )}

            {viewStep === 'add_method' && (
                <AddMethod 
                    onBack={handleBack}
                    onSave={() => setViewStep('add_money')}
                />
            )}

            <SuccessModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onBackHome={handleBackHome}
                amount={amount}
            />
        </View>
    );
}
