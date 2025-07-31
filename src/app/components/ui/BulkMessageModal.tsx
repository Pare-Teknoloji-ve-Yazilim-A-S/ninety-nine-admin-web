import React, { useState } from 'react';
import { Mail, MessageSquare, X } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import TextArea from './TextArea';

interface BulkMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string) => void;
    type: 'email' | 'sms';
    recipientCount: number;
}

export default function BulkMessageModal({
    isOpen,
    onClose,
    onSend,
    type,
    recipientCount
}: BulkMessageModalProps) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        onSend(message);
        setMessage('');
        onClose();
    };

    const isEmail = type === 'email';
    const icon = isEmail ? Mail : MessageSquare;
    const title = isEmail ? 'Toplu E-posta Gönder' : 'Toplu SMS Gönder';
    const placeholder = isEmail 
        ? 'E-posta içeriğini buraya yazın...'
        : 'SMS içeriğini buraya yazın...';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {React.createElement(icon, {
                            className: "w-5 h-5 text-primary-gold"
                        })}
                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-light-secondary dark:text-text-secondary hover:text-text-on-light dark:hover:text-text-on-dark transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Recipient Count */}
                <div className="mb-4">
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {recipientCount} alıcıya {isEmail ? 'e-posta' : 'SMS'} gönderilecek
                    </p>
                </div>

                {/* Message Input */}
                <div className="mb-6">
                    <TextArea
                        value={message}
                        onChange={(e: any) => setMessage(e.target.value)}
                        placeholder={placeholder}
                        rows={6}
                        className="w-full"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        İptal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSend}
                        disabled={!message.trim()}
                        icon={icon}
                    >
                        Gönder
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 